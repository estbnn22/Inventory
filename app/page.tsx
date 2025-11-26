import { stackServerApp } from "@/stack/server";
import Image from "next/image";
import Link from "next/link";
import SideBar from "./components/sideBar";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await stackServerApp.getUser();

  if (!user) {
    return (
      <div>
        <div className="fixed left-0 top-0 bg-neutral text-white w-64 min-h-screen p-6 z-10">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <h1 className="font-bold text-lg">
                Sign In to see your dashboard
              </h1>
            </div>
          </div>
        </div>

        <main className="ml-64 p-8">
          <div className="flex flex-col gap-5 items-center justify-center h-screen">
            <h1 className="text-3xl font-bold ">Inventory Management System</h1>
            <p className="text-lg font-medium">
              Please sign in to see your dashboard
            </p>
            <div>
              <Link href="/signIn" className="btn btn-neutral rounded-lg">
                Sign In
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  redirect("/dashboard");
}
