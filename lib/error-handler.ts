export class TalarittelError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    public message: string
  ) {
    super(message)
    this.name = "TalarittelError"
  }
}

export const ErrorCodes = {
  // Authentication
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  SESSION_EXPIRED: "SESSION_EXPIRED",

  // Validation
  INVALID_INPUT: "INVALID_INPUT",
  MISSING_REQUIRED_FIELD: "MISSING_REQUIRED_FIELD",

  // User
  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",

  // Payment
  INSUFFICIENT_BALANCE: "INSUFFICIENT_BALANCE",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  INVALID_AMOUNT: "INVALID_AMOUNT",

  // Calls
  CALL_FAILED: "CALL_FAILED",
  INVALID_PHONE_NUMBER: "INVALID_PHONE_NUMBER",

  // Server
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
} as const

export function createErrorResponse(error: unknown) {
  if (error instanceof TalarittelError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
    }
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      statusCode: 500,
    }
  }

  return {
    success: false,
    error: "An unexpected error occurred",
    code: ErrorCodes.INTERNAL_SERVER_ERROR,
    statusCode: 500,
  }
}

export function validatePhoneNumber(phone: string): boolean {
  // Basic Ethiopian phone number validation
  // Ethiopians numbers typically start with +251 or 0
  const pattern = /^(\+251|0)9\d{8}$/
  return pattern.test(phone)
}

export function validateEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(email)
}
