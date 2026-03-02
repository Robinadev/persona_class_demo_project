import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Verify JWT token from Authorization header
 */
function verifyToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

/**
 * GET: Retrieve sync events for the user
 */
export async function GET(request: NextRequest) {
  try {
    const userId = verifyToken(request.headers.get('authorization'));

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const eventType = searchParams.get('eventType');

    let query = supabase
      .from('sync_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    if (eventType) {
      query = query.eq('event_type', eventType);
    }

    const { data: events, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch sync events' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      events: events || [],
      count: events?.length || 0
    });
  } catch (error) {
    console.error('Error in GET sync events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST: Create a new sync event
 */
export async function POST(request: NextRequest) {
  try {
    const userId = verifyToken(request.headers.get('authorization'));

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { eventType, data } = await request.json();

    // Validate input
    if (!eventType || !data) {
      return NextResponse.json(
        { error: 'eventType and data are required' },
        { status: 400 }
      );
    }

    const validEventTypes = ['call_log', 'user_update', 'device_update', 'settings_change'];
    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json(
        { error: 'Invalid eventType' },
        { status: 400 }
      );
    }

    // Create sync event
    const { data: syncEvent, error } = await supabase
      .from('sync_events')
      .insert({
        user_id: userId,
        event_type: eventType,
        data,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create sync event' },
        { status: 500 }
      );
    }

    // Process event based on type
    await processSyncEvent(userId, eventType, data);

    return NextResponse.json({
      success: true,
      event: syncEvent,
      message: 'Sync event created successfully'
    });
  } catch (error) {
    console.error('Error in POST sync event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH: Update sync event status
 */
export async function PATCH(request: NextRequest) {
  try {
    const userId = verifyToken(request.headers.get('authorization'));

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { eventId, status } = await request.json();

    if (!eventId || !status) {
      return NextResponse.json(
        { error: 'eventId and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'synced', 'failed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update event status
    const { data: updatedEvent, error } = await supabase
      .from('sync_events')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', eventId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update sync event' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      event: updatedEvent,
      message: 'Sync event updated successfully'
    });
  } catch (error) {
    console.error('Error in PATCH sync event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Process sync event based on type
 */
async function processSyncEvent(
  userId: string,
  eventType: string,
  data: any
) {
  try {
    switch (eventType) {
      case 'call_log':
        // Store call log
        await supabase
          .from('call_logs')
          .insert({
            user_id: userId,
            recipient_phone: data.recipientPhoneNumber,
            duration: data.duration,
            start_time: data.startTime,
            end_time: data.endTime,
            call_status: data.status,
            created_at: new Date().toISOString()
          });
        break;

      case 'user_update':
        // Update user profile
        await supabase
          .from('users')
          .update(data)
          .eq('id', userId);
        break;

      case 'device_update':
        // Update device info
        await supabase
          .from('device_info')
          .upsert({
            user_id: userId,
            ...data,
            updated_at: new Date().toISOString()
          });
        break;

      case 'settings_change':
        // Update user settings
        await supabase
          .from('user_settings')
          .upsert({
            user_id: userId,
            ...data,
            updated_at: new Date().toISOString()
          });
        break;
    }

    // Mark sync event as synced
    await supabase
      .from('sync_events')
      .update({ status: 'synced' })
      .eq('user_id', userId)
      .eq('event_type', eventType);
  } catch (error) {
    console.error(`Error processing ${eventType}:`, error);
  }
}
