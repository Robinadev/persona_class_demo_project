import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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
    const { firstName, lastName, email, phoneNumber, verificationCode } = await request.json();

    // Validate input
    if (!firstName || !lastName || !email || !phoneNumber || !verificationCode) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(phoneNumber);

    // Verify the OTP was actually verified
    const { data: otpRecord, error: otpError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('phone_number', normalizedPhone)
      .eq('code', verificationCode)
      .eq('is_verified', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpRecord) {
      return NextResponse.json(
        { error: 'Phone number not verified. Please complete verification.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('phone_number', normalizedPhone)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this phone number already exists' },
        { status: 409 }
      );
    }

    // Create user account
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        phone_number: normalizedPhone,
        email,
        full_name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        role: 'user', // Default role - admins managed separately
        is_verified: true,
        verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError || !newUser) {
      console.error('User creation error:', createError);
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }

    // Create session
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        user_id: newUser.id,
        token: jwt.sign(
          { userId: newUser.id, phoneNumber: normalizedPhone, role: 'user' },
          JWT_SECRET,
          { expiresIn: '30d' }
        ),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (sessionError || !session) {
      console.error('Session creation error:', sessionError);
      return NextResponse.json(
        { error: 'Account created but session failed. Please login.' },
        { status: 500 }
      );
    }

    // Mark OTP as used
    await supabase
      .from('otp_codes')
      .update({ is_used: true, used_at: new Date().toISOString() })
      .eq('id', otpRecord.id);

    return NextResponse.json(
      {
        success: true,
        token: session.token,
        userId: newUser.id,
        phoneNumber: normalizedPhone,
        message: 'Account created successfully'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create account error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
