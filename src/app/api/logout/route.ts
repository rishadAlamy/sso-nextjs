import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "../../../../lib/database";

// Logout endpoint - Clear session
export async function POST(req: NextRequest) {
  try {
    console.log("🚪 Logout initiated");
    
    const sessionToken = req.cookies.get("session")?.value;
    
    if (sessionToken) {
      deleteSession(sessionToken);
      console.log("✅ Session deleted");
    }

    // Clear session cookie
    const response = NextResponse.json({ 
      success: true, 
      message: "Logged out successfully" 
    });
    
    response.cookies.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/'
    });

    console.log("🏠 User logged out");
    return response;
    
  } catch (error) {
    console.error("❌ Logout failed:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Logout failed" 
    }, { status: 500 });
  }
}
