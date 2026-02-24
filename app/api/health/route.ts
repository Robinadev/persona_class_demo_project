import { NextResponse } from 'next/server'
import { checkDatabaseHealth } from '@/lib/db-init'

export const revalidate = 60 // Revalidate every 60 seconds

export async function GET() {
  try {
    const dbHealth = await checkDatabaseHealth()

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth ? 'healthy' : 'unhealthy',
        api: 'healthy',
      },
    }, {
      status: dbHealth ? 200 : 503,
    })
  } catch (error) {
    console.error('[v0] Health check error:', error)
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }, {
      status: 500,
    })
  }
}
