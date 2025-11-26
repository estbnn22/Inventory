import { stackServerApp } from "@/stack/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await stackServerApp.getUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-base-200">
        {/* ✅ Mobile-friendly top bar */}
        <div className="md:hidden sticky top-0 z-20 bg-neutral text-white border-b border-black/20">
          <div className="px-4 py-3">
            <h1 className="font-semibold text-base">
              Inventory Management System
            </h1>
          </div>
        </div>

        {/* ✅ Desktop-only sidebar placeholder (keeps your look) */}
        <div className="hidden md:block fixed left-0 top-0 bg-neutral text-white w-64 min-h-screen p-6 z-10">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <h1 className="font-bold text-lg">
                Sign In to see your dashboard
              </h1>
            </div>
          </div>
        </div>

        {/* ✅ Main full width on mobile, sidebar offset only on md+ */}
        <main className="p-4 md:ml-64 md:p-8">
          <div className="flex flex-col gap-5 items-center justify-center min-h-[80vh] md:h-screen text-center">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Inventory Management System
            </h1>

            <p className="text-base sm:text-lg font-medium">
              Please sign in to see your dashboard
            </p>

            <Link
              href="/signIn"
              className="btn btn-neutral rounded-lg w-full sm:w-auto"
            >
              Sign In
            </Link>
          </div>
        </main>
      </div>
    );
  }

  redirect("/dashboard");
}
