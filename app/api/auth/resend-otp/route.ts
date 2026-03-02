import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Validate and normalize USA phone number
function validateAndNormalizePhone(phone: string): string | null {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  
  if (cleaned.match(/^\d{10}$/)) {
    return `+1${cleaned}`;
  }
  
  if (cleaned.match(/^1\d{10}$/)) {
    return `+${cleaned}`;
  }
  
  if (cleaned.match(/^\+\d{1,15}$/)) {
    return cleaned;
  }
  
  return null;
}

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Mock SMS sending
async function sendSMS(phoneNumber: string, otp: string): Promise<boolean> {
  console.log(`[OTP] Resending ${otp} to ${phoneNumber}`);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    // Validate input
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Normalize and validate phone number
    const normalizedPhone = validateAndNormalizePhone(phoneNumber);
    if (!normalizedPhone) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Invalidate previous OTP codes for this phone
    const { error: invalidateError } = await supabase
      .from('otp_codes')
      .update({ is_verified: false })
      .eq('phone_number', normalizedPhone)
      .is('verified_at', null);

    if (invalidateError) {
      console.error('Error invalidating previous codes:', invalidateError);
    }

    // Check rate limiting (max 3 requests per 5 minutes)
    const { data: recentAttempts } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('phone_number', normalizedPhone)
      .gt('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if ((recentAttempts?.length || 0) >= 3) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in 5 minutes.' },
        { status: 429 }
      );
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store new OTP
    const { error: insertError } = await supabase
      .from('otp_codes')
      .insert({
        phone_number: normalizedPhone,
        code: otp,
        expires_at: expiresAt.toISOString(),
        attempt_count: 0,
        is_verified: false
      });

    if (insertError) {
      console.error('Database error:', insertError);
      return NextResponse.json(
        { error: 'Failed to generate verification code' },
        { status: 500 }
      );
    }

    // Send SMS
    const smsSent = await sendSMS(normalizedPhone, otp);

    if (!smsSent) {
      return NextResponse.json(
        { error: 'Failed to send SMS. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'New verification code sent to your phone',
      phoneNumber: normalizedPhone,
      expiresIn: 600 // 10 minutes in seconds
    });
  } catch (error) {
    console.error('Error in resend-otp:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
