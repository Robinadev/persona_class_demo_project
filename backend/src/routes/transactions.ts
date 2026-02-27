import { Router, Request, Response } from 'express';
import { supabase, hasPermission } from '../lib/supabase';
import { roleMiddleware } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

interface TransactionRequest {
  recipient_id?: string;
  amount: number;
  description: string;
  type: 'transfer' | 'topup' | 'withdrawal';
}

// Get user transactions
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;
    const { limit = 50, offset = 0, type, start_date, end_date } = req.query;

    if (!userId) {
      throw new AppError(401, 'User not authenticated');
    }

    let query = supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    // Users can only see their own transactions
    if (userRole === 'user') {
      query = query.or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);
    }
    // Admins can see all
    else if (!hasPermission(userRole, 'view_all_users')) {
      query = query.or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (start_date) {
      query = query.gte('created_at', start_date);
    }

    if (end_date) {
      query = query.lte('created_at', end_date);
    }

    const { data: transactions, error, count } = await query.range(
      Number(offset),
      Number(offset) + Number(limit) - 1
    );

    if (error) {
      throw new AppError(400, 'Failed to fetch transactions');
    }

    res.json({
      success: true,
      data: transactions || [],
      total: count || 0,
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create transfer transaction
router.post('/transfer', async (req: Request<{}, {}, TransactionRequest>, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { recipient_id, amount, description } = req.body;

    if (!userId || !recipient_id || !amount || amount <= 0) {
      throw new AppError(400, 'Invalid transfer data');
    }

    if (userId === recipient_id) {
      throw new AppError(400, 'Cannot transfer to yourself');
    }

    // Check recipient exists
    const { data: recipient } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', recipient_id)
      .single();

    if (!recipient) {
      throw new AppError(404, 'Recipient not found');
    }

    // Create transaction
    const transactionId = uuidv4();
    const { error: transError } = await supabase
      .from('transactions')
      .insert({
        id: transactionId,
        sender_id: userId,
        recipient_id,
        amount,
        type: 'transfer',
        description,
        status: 'completed',
      });

    if (transError) {
      throw new AppError(400, 'Failed to create transaction');
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: userId,
      action: 'transfer_sent',
      resource_type: 'transaction',
      resource_id: transactionId,
      details: { recipient_id, amount },
    });

    res.status(201).json({
      success: true,
      message: 'Transfer completed',
      transaction_id: transactionId,
    });
  } catch (error) {
    console.error('Transfer error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create transfer' });
  }
});

// Create topup transaction
router.post('/topup', async (req: Request<{}, {}, Omit<TransactionRequest, 'recipient_id'>>, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { amount, description } = req.body;

    if (!userId || !amount || amount <= 0) {
      throw new AppError(400, 'Invalid topup data');
    }

    const transactionId = uuidv4();
    const { error: transError } = await supabase
      .from('transactions')
      .insert({
        id: transactionId,
        sender_id: userId,
        amount,
        type: 'topup',
        description,
        status: 'completed',
      });

    if (transError) {
      throw new AppError(400, 'Failed to create topup');
    }

    await supabase.from('activity_logs').insert({
      user_id: userId,
      action: 'topup',
      resource_type: 'transaction',
      resource_id: transactionId,
      details: { amount },
    });

    res.status(201).json({
      success: true,
      message: 'Topup completed',
      transaction_id: transactionId,
    });
  } catch (error) {
    console.error('Topup error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create topup' });
  }
});

// Get transaction by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { id } = req.params;

    const { data: transaction, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !transaction) {
      throw new AppError(404, 'Transaction not found');
    }

    // Check access
    if (transaction.sender_id !== userId && transaction.recipient_id !== userId) {
      if ((req as any).user?.role === 'user') {
        throw new AppError(403, 'Cannot view this transaction');
      }
    }

    res.json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

export default router;
