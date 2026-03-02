import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Normalize phone number (same as in send-otp)
function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  if (cleaned.match(/^\d{10}$/)) {
    return `+1${cleaned}`;
  }
  if (cleaned.match(/^1\d{10}$/)) {
    return `+${cleaned}`;
  }
  return cleaned;
}

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, code } = await request.json();

    // Validate input
    if (!phoneNumber || !code) {
      return NextResponse.json(
        { error: 'Phone number and code are required' },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Invalid code format. Code must be 6 digits.' },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(phoneNumber);

    // Find the OTP record
    const { data: otpRecord, error: fetchError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('phone_number', normalizedPhone)
      .eq('code', code)
      .eq('is_verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !otpRecord) {
      // Update attempt count for failed tries
      const { data: failedOtp } = await supabase
        .from('otp_codes')
        .select('attempt_count')
        .eq('phone_number', normalizedPhone)
        .eq('code', code)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (failedOtp) {
        await supabase
          .from('otp_codes')
          .update({ attempt_count: (failedOtp.attempt_count || 0) + 1 })
          .eq('id', failedOtp.id);
      }

      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Check attempt limit (max 5 attempts)
    if ((otpRecord.attempt_count || 0) >= 5) {
      return NextResponse.json(
        { error: 'Too many verification attempts. Request a new code.' },
        { status: 429 }
      );
    }

    // Mark OTP as verified
    const { error: updateError } = await supabase
      .from('otp_codes')
      .update({ 
        is_verified: true,
        verified_at: new Date().toISOString()
      })
      .eq('id', otpRecord.id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to verify code' },
        { status: 500 }
      );
    }

    // Find or create user
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('phone_number', normalizedPhone)
      .single();

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      // Update last login
      await supabase
        .from('users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', userId);
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          phone_number: normalizedPhone,
          is_verified: true,
          verified_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          last_login_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError || !newUser) {
        return NextResponse.json(
          { error: 'Failed to create user account' },
          { status: 500 }
        );
      }

      userId = newUser.id;
    }

    // Create session token
    const token = jwt.sign(
      {
        userId,
        phoneNumber: normalizedPhone,
        iat: Math.floor(Date.now() / 1000)
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Store session in database
    const { error: sessionError } = await supabase
      .from('sessions')
      .insert({
        user_id: userId,
        token,
        device_info: request.headers.get('user-agent') || 'unknown',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

    if (sessionError) {
      console.error('Session creation error:', sessionError);
    }

    // Set secure cookie
    const response = NextResponse.json({
      success: true,
      message: 'Phone number verified successfully',
      userId,
      phoneNumber: normalizedPhone,
      token
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    return response;
  } catch (error) {
    console.error('Error in verify-otp:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
