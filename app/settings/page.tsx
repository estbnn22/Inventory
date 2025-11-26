import { getCurrentUser } from "@/lib/auth";
import SideBar from "../components/sideBar";
import { AccountSettings } from "@stackframe/stack";

export default async function Settings() {
  const user = await getCurrentUser();
  return (
    <div className="min-h-screen bg-base-200">
      <SideBar currentPath="/settings" />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-sm mt-2">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl">
          <div className="bg-white rounded-lg border border-neutral p-6">
            <AccountSettings />
          </div>
        </div>
      </main>
    </div>
  );
}
