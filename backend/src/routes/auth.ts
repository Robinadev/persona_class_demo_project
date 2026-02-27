import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabase, UserRole } from '../lib/supabase';
import { AppError } from '../middleware/errorHandler';

const router = Router();

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;
}

// Login route
router.post('/login', async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'Email and password are required');
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, avatar_url, is_active')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      throw new AppError(401, 'User profile not found');
    }

    if (!profile.is_active) {
      throw new AppError(401, 'User account is inactive');
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new AppError(500, 'JWT secret not configured');
    }

    const token = jwt.sign(
      {
        id: profile.id,
        email: profile.email,
        role: profile.role,
      },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: profile.id,
      action: 'login',
      resource_type: 'auth',
      resource_id: profile.id,
      status: 'success',
    });

    res.json({
      success: true,
      token,
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        avatar_url: profile.avatar_url,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Login failed' });
  }
});

// Signup route
router.post('/signup', async (req: Request<{}, {}, SignupRequest>, res: Response) => {
  try {
    const { email, password, full_name, role = 'user' } = req.body;

    if (!email || !password || !full_name) {
      throw new AppError(400, 'Email, password, and full name are required');
    }

    if (password.length < 6) {
      throw new AppError(400, 'Password must be at least 6 characters');
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      throw new AppError(400, error?.message || 'Signup failed');
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email,
        full_name,
        role,
        is_active: true,
      });

    if (profileError) {
      throw new AppError(400, 'Failed to create user profile');
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: data.user.id,
      action: 'signup',
      resource_type: 'auth',
      resource_id: data.user.id,
      status: 'success',
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: data.user.id,
        email,
        full_name,
        role,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Logout route
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    
    if (userId) {
      await supabase.from('activity_logs').insert({
        user_id: userId,
        action: 'logout',
        resource_type: 'auth',
        resource_id: userId,
        status: 'success',
      });
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Refresh token route
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;
    const email = (req as any).user?.email;

    if (!userId || !userRole) {
      throw new AppError(401, 'User not authenticated');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new AppError(500, 'JWT secret not configured');
    }

    const newToken = jwt.sign(
      {
        id: userId,
        email,
        role: userRole,
      },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    res.json({
      success: true,
      token: newToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

export default router;
