import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase, UserRole } from '../lib/supabase';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
        iat: number;
        exp: number;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.slice(7);
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({ error: 'JWT secret not configured' });
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
      role: UserRole;
      iat: number;
      exp: number;
    };

    // Verify user still exists in Supabase
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, role, is_active')
      .eq('id', decoded.id)
      .single();

    if (error || !profile) {
      return res.status(401).json({ error: 'User not found or unauthorized' });
    }

    if (!profile.is_active) {
      return res.status(401).json({ error: 'User account is inactive' });
    }

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
