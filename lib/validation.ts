import { z } from 'zod'

// Common schemas
export const phoneNumberSchema = z.string()
  .regex(/^(\+251|0)9\d{8}$/, 'Invalid Ethiopian phone number')

export const emailSchema = z.string()
  .email('Invalid email address')

export const amountSchema = z.number()
  .positive('Amount must be greater than 0')
  .max(999999, 'Amount is too large')

// User schemas
export const createUserSchema = z.object({
  full_name: z.string().min(2, 'Name is too short').max(100),
  email: emailSchema,
  phone_number: phoneNumberSchema,
})

export const updateProfileSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  phone_number: phoneNumberSchema.optional(),
  avatar_url: z.string().url().optional(),
})

// Wallet schemas
export const topupSchema = z.object({
  amount: amountSchema,
  currency: z.string().default('ETB'),
  method: z.enum(['stripe', 'telebirr', 'bank_transfer']).default('stripe'),
})

// Call schemas
export const callLogSchema = z.object({
  phone_number: phoneNumberSchema,
  contact_name: z.string().optional(),
  call_type: z.enum(['outgoing', 'incoming', 'missed']),
  call_status: z.enum(['completed', 'missed', 'rejected', 'failed']),
  duration_seconds: z.number().nonnegative().default(0),
  cost: z.number().nonnegative().default(0),
})

// Transfer schemas
export const moneyTransferSchema = z.object({
  recipient_id: z.string().uuid(),
  amount: amountSchema,
  note: z.string().optional(),
})

// Plan schemas
export const planPurchaseSchema = z.object({
  plan_id: z.string().uuid(),
})

// Contact schemas
export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  phone_number: phoneNumberSchema,
  email: emailSchema.optional(),
  notes: z.string().optional(),
})

export const updateContactSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  phone_number: phoneNumberSchema.optional(),
  email: emailSchema.optional(),
  notes: z.string().optional(),
  is_favorite: z.boolean().optional(),
})

// Validation helper function
export async function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): Promise<{ valid: true; data: T } | { valid: false; errors: z.ZodError }> {
  try {
    const validated = await schema.parseAsync(data)
    return { valid: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, errors: error }
    }
    throw error
  }
}
