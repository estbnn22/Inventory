import { getCurrentUser } from "@/lib/auth";
import SideBar from "../components/sideBar";
import MobileTopNav from "../components/mobileTopNav"; // ✅ ADD
import { AccountSettings } from "@stackframe/stack";

export default async function Settings() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-base-200">
      <SideBar currentPath="/settings" />
      <MobileTopNav currentPath="/settings" /> {/* ✅ ADD */}
      {/* ✅ responsive main */}
      <main className="p-4 md:ml-64 md:p-8">
        <div className="mb-6">
          {/* ✅ stack header on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-sm mt-2">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>

        {/* ✅ responsive container */}
        <div className="w-full max-w-6xl">
          <div className="bg-white rounded-lg border border-neutral p-4 sm:p-6">
            <AccountSettings />
          </div>
        </div>
      </main>
    </div>
  );
}
