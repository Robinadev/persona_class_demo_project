import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Get user wallet balance
router.get('/balance', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new AppError(401, 'User not authenticated');
    }

    const { data: wallet, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // Create wallet if doesn't exist
      const { data: newWallet, error: createError } = await supabase
        .from('wallets')
        .insert({ user_id: userId, balance: 0 })
        .select()
        .single();

      if (createError) {
        throw new AppError(400, 'Failed to get wallet');
      }

      return res.json({
        success: true,
        wallet: newWallet,
      });
    }

    res.json({
      success: true,
      wallet,
    });
  } catch (error) {
    console.error('Get balance error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch wallet' });
  }
});

export default router;
