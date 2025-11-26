import { stackServerApp } from "@/stack/server";
import SideBar from "./components/sideBar";

export default async function Loading() {
  // Stack uses React Suspense, which will render this page while user data is being fetched.
  // See: https://nextjs.org/docs/app/api-reference/file-conventions/loading
  const user = await stackServerApp.getUser();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="fixed left-0 top-0 bg-neutral text-white w-64 min-h-screen p-6 z-10">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <h1 className="font-bold text-lg">
                Sign In to see your dashboard
              </h1>
            </div>
          </div>
        </div>
        <span className="loading loading-dots loading-xl h-screen ml-64"></span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <SideBar currentPath="" />
      <span className="loading loading-dots loading-xl h-screen ml-64"></span>
    </div>
  );
}
