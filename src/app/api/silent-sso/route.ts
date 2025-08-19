import { NextRequest, NextResponse } from "next/server";
import { findSessionByToken, findUserById } from "../../../../lib/database";

// Silent SSO - Check if user already has a valid session
export async function GET(req: NextRequest) {
  try {
    console.log("🔍 Silent SSO check initiated");

    const sessionToken = req.cookies.get("session")?.value;

    if (!sessionToken) {
      console.log("❌ No session token found");
      return NextResponse.json({
        authenticated: false,
        reason: "No session token",
      });
    }

    const session = findSessionByToken(sessionToken);
    if (!session) {
      console.log("❌ Invalid or expired session");
      return NextResponse.json({
        authenticated: false,
        reason: "Invalid or expired session",
      });
    }

    const user = findUserById(session.userId);
    if (!user) {
      console.log("❌ User not found for session");
      return NextResponse.json({
        authenticated: false,
        reason: "User not found",
      });
    }

    console.log("✅ Silent SSO successful for:", user.email);

    // Remove sensitive data
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      authenticated: true,
      user: userWithoutPassword,
      sessionValid: true,
    });
  } catch (error) {
    console.error("❌ Silent SSO failed:", error);
    return NextResponse.json(
      {
        authenticated: false,
        reason: "Silent SSO check failed",
      },
      { status: 500 }
    );
  }
}
