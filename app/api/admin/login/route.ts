import { NextResponse } from 'next/server';
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const ipAddress = request.headers.get("x-forwarded-for") || undefined;

    const result = await convex.action(api.auth.adminLogin, {
      email,
      password,
      ipAddress,
    });

    if (result && result.token) {
      const response = NextResponse.json({ success: true });
      
      response.cookies.set('admin-session', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }
    
    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "";
    const errorMessage = errorMsg.includes("Too many attempts") 
      ? "Too many attempts. Try again in 15 minutes." 
      : "Invalid credentials";
      
    return NextResponse.json({ success: false, error: errorMessage }, { status: 401 });
  }
}
