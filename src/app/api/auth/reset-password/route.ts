import { NextRequest, NextResponse } from "next/server";
import { createResetToken, findUserByEmail, findValidResetToken } from "../../../../../lib/database";


export async function POST(req: NextRequest) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required",
        },
        { status: 400 }
      );
    }

    if (!code && !newPassword) {
      // Step 1: Request reset code
      const user = findUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists
        return NextResponse.json({
          success: true,
          message: "If the email exists, a reset code has been sent",
        });
      }

      const resetToken = createResetToken(email);

      // In production, send email here
      console.log(`Reset code for ${email}: ${resetToken.token}`);

      return NextResponse.json({
        success: true,
        message: "Reset code sent to your email",
        // For demo purposes, include the code
        resetCode: resetToken.token,
      });
    }

    if (code && newPassword) {
      // Step 2: Reset password with code
      const resetToken = findValidResetToken(email, code);
      if (!resetToken) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid or expired reset code",
          },
          { status: 400 }
        );
      }

      // In production, update the user's password here
      markResetTokenAsUsed(resetToken.id);

      return NextResponse.json({
        success: true,
        message: "Password reset successful",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid request parameters",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
