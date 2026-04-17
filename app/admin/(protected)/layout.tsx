import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin-session")?.value;

  if (!sessionToken) {
    redirect("/admin/login");
  }

  try {
    const { valid } = await convex.query(api.auth.validateSession, {
      sessionToken,
    });

    if (!valid) {
      redirect("/admin/login");
    }
  } catch (e) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#F8F8FC] text-[#1A1A2E] flex font-inter">
      <aside className="w-[72px] lg:w-64 bg-white border-r border-[#E5E5F0] flex flex-col items-center lg:items-start py-6 lg:px-6">
        <div className="font-syne font-bold text-xl text-[#6C63FF] hidden lg:block mb-10">
          SentinalHills
        </div>
        <div className="font-syne font-bold text-xl text-[#6C63FF] block lg:hidden mb-10">
          SH
        </div>
        
        <nav className="flex flex-col gap-6 w-full">
          <a href="/admin" className="text-[#1A1A2E] font-medium hover:text-[#6C63FF] transition-colors flex items-center justify-center lg:justify-start gap-3">
            <span className="lg:hidden text-2xl">📊</span>
            <span className="hidden lg:block">Leads</span>
          </a>
        </nav>
        
        <form action="/api/admin/logout" method="POST" className="mt-auto w-full">
          <button type="submit" className="text-[#EF4444] font-medium hover:text-red-700 transition-colors w-full flex items-center justify-center lg:justify-start gap-3 mt-10">
             <span className="lg:hidden text-2xl">🚪</span>
             <span className="hidden lg:block">Logout</span>
          </button>
        </form>
      </aside>
      <main className="flex-1 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
