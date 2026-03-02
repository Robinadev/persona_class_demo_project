import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// International phone number regex (E.164 format)
const PHONE_REGEX = /^\+?1?\d{9,15}$/;

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Validate and normalize USA phone number
function validateAndNormalizePhone(phone: string): string | null {
  // Remove spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-()]/g, '');
  
  // If it's 10 digits, add +1 prefix for USA
  if (cleaned.match(/^\d{10}$/)) {
    return `+1${cleaned}`;
  }
  
  // If it starts with 1 and has 11 digits, format as +1XXXXXXXXXX
  if (cleaned.match(/^1\d{10}$/)) {
    return `+${cleaned}`;
  }
  
  // If it already has + prefix
  if (cleaned.match(/^\+\d{1,15}$/)) {
    return cleaned;
  }
  
  return null;
}

// Mock SMS sending (in production, use Twilio, Vonage, or AWS SNS)
async function sendSMS(phoneNumber: string, otp: string): Promise<boolean> {
  console.log(`[OTP] Sending ${otp} to ${phoneNumber}`);
  
  // In production, uncomment and configure your SMS provider:
  // Example with Twilio:
  // const twilio = require('twilio');
  // const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
  // await client.messages.create({
  //   body: `Your verification code is: ${otp}. Valid for 10 minutes.`,
  //   from: process.env.TWILIO_PHONE_NUMBER!,
  //   to: phoneNumber
  // });
  
  // For now, return success (in dev/test environment)
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
        { error: 'Invalid phone number format. Please use a valid USA number (e.g., +1 555 123 4567 or 5551234567)' },
        { status: 400 }
      );
    }

    // Check if too many attempts (rate limiting)
    const { data: recentAttempts } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('phone_number', normalizedPhone)
      .gt('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
      .order('created_at', { ascending: false });

    if ((recentAttempts?.length || 0) >= 3) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in 5 minutes.' },
        { status: 429 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
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
      message: 'Verification code sent to your phone',
      phoneNumber: normalizedPhone,
      expiresIn: 600 // 10 minutes in seconds
    });
  } catch (error) {
    console.error('Error in send-otp:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
