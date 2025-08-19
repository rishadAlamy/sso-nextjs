import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json({ user: null });
    }

    // Remove sensitive data before sending
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to get user",
      },
      { status: 500 }
    );
  }
}
