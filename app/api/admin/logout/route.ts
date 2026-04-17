import { NextResponse } from 'next/server';
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  try {
    const sessionCookie = request.headers.get("cookie");
    let sessionToken: string | undefined;
    
    if (sessionCookie) {
      const match = sessionCookie.match(/admin-session=([^;]+)/);
      if (match) {
        sessionToken = match[1];
      }
    }

    if (sessionToken) {
      await convex.mutation(api.auth.adminLogout, { sessionToken });
    }

    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete('admin-session');
    
    return response;
  } catch (error) {
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete('admin-session');
    return response;
  }
}
