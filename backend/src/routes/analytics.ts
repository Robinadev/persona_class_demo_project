import { Router, Request, Response } from 'express';
import { supabase, hasPermission } from '../lib/supabase';
import { roleMiddleware } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Get dashboard stats (admin only)
router.get('/dashboard', roleMiddleware(['super_admin', 'admin']), async (req: Request, res: Response) => {
  try {
    // Total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    // Active users
    const { count: activeUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    // Total transactions
    const { count: totalTransactions } = await supabase
      .from('transactions')
      .select('*', { count: 'exact' });

    // Total volume
    const { data: volumeData } = await supabase
      .from('transactions')
      .select('amount');

    const totalVolume = (volumeData || []).reduce((sum, t) => sum + (t.amount || 0), 0);

    res.json({
      success: true,
      stats: {
        total_users: totalUsers || 0,
        active_users: activeUsers || 0,
        total_transactions: totalTransactions || 0,
        total_volume: totalVolume,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get user distribution by role
router.get('/users-by-role', roleMiddleware(['super_admin']), async (req: Request, res: Response) => {
  try {
    const { data: roleStats } = await supabase.rpc('get_user_count_by_role');

    res.json({
      success: true,
      data: roleStats || [],
    });
  } catch (error) {
    console.error('Role stats error:', error);
    res.status(500).json({ error: 'Failed to fetch role stats' });
  }
});

// Get transaction trends
router.get('/transaction-trends', roleMiddleware(['super_admin', 'admin']), async (req: Request, res: Response) => {
  try {
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const { data: trends } = await supabase
      .from('transactions')
      .select('created_at, amount')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Group by date
    const grouped = (trends || []).reduce((acc: Record<string, number>, t: any) => {
      const date = new Date(t.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + (t.amount || 0);
      return acc;
    }, {});

    res.json({
      success: true,
      data: Object.entries(grouped).map(([date, amount]) => ({
        date,
        amount,
      })),
    });
  } catch (error) {
    console.error('Transaction trends error:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

export default router;
