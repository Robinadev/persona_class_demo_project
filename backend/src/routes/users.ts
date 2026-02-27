import { Router, Request, Response } from 'express';
import { supabase, hasPermission, UserRole, canAccessRole } from '../lib/supabase';
import { roleMiddleware } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Get current user profile
router.get('/me', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new AppError(401, 'User not authenticated');
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      throw new AppError(404, 'User profile not found');
    }

    res.json({
      success: true,
      user: profile,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/me', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { full_name, avatar_url, phone, address } = req.body;

    if (!userId) {
      throw new AppError(401, 'User not authenticated');
    }

    const { data: updated, error } = await supabase
      .from('profiles')
      .update({
        full_name: full_name || undefined,
        avatar_url: avatar_url || undefined,
        phone: phone || undefined,
        address: address || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error || !updated) {
      throw new AppError(400, 'Failed to update profile');
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: userId,
      action: 'profile_updated',
      resource_type: 'profile',
      resource_id: userId,
    });

    res.json({
      success: true,
      user: updated,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get all users (admin only)
router.get('/', roleMiddleware(['super_admin', 'admin']), async (req: Request, res: Response) => {
  try {
    const { limit = 50, offset = 0, role, search } = req.query;

    let query = supabase
      .from('profiles')
      .select('id, email, full_name, role, is_active, created_at')
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (role) {
      query = query.eq('role', role);
    }

    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    const { data: users, error, count } = await query;

    if (error) {
      throw new AppError(400, 'Failed to fetch users');
    }

    res.json({
      success: true,
      data: users,
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error('Get users error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID (admin only)
router.get('/:id', roleMiddleware(['super_admin', 'admin']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !user) {
      throw new AppError(404, 'User not found');
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user role (super admin only)
router.put('/:id/role', roleMiddleware(['super_admin']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role: newRole } = req.body;
    const adminRole = (req as any).user?.role;

    if (!newRole || !['user', 'support', 'admin', 'super_admin'].includes(newRole)) {
      throw new AppError(400, 'Invalid role');
    }

    // Check if admin can assign this role
    if (!canAccessRole(adminRole, newRole)) {
      throw new AppError(403, 'Cannot assign a role higher than your own');
    }

    const { data: updated, error } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      throw new AppError(400, 'Failed to update user role');
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: (req as any).user?.id,
      action: 'role_changed',
      resource_type: 'user',
      resource_id: id,
      details: { old_role: updated.role, new_role: newRole },
    });

    res.json({
      success: true,
      user: updated,
    });
  } catch (error) {
    console.error('Update user role error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Deactivate user (super admin only)
router.post('/:id/deactivate', roleMiddleware(['super_admin']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: updated, error } = await supabase
      .from('profiles')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      throw new AppError(400, 'Failed to deactivate user');
    }

    res.json({
      success: true,
      message: 'User deactivated',
      user: updated,
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to deactivate user' });
  }
});

export default router;
