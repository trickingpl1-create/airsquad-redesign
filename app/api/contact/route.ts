import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log the contact form submission
    console.log('[v0] Contact form received:', body)
    
    // In a production app, you would:
    // 1. Send an email via SendGrid, Resend, or similar
    // 2. Save to database
    // 3. Send confirmation email to user
    
    // For now, just return success
    return NextResponse.json(
      { success: true, message: 'Message received' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Contact API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
