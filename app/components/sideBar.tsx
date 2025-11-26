import { UserButton } from "@stackframe/stack";
import Link from "next/link";
import Image from "next/image";
import Add from "../../public/add-circle-svgrepo-com.svg";
import Inv from "../../public/archive-svgrepo-com.svg";
import Dash from "../../public/dashboard-svgrepo-com.svg";
import Activity from "../../public/note-svgrepo-com.svg";
import Settings from "../../public/settings-svgrepo-com.svg";

export default function SideBar({
  currentPath = "/dashboard",
}: {
  currentPath: string;
}) {
  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Image alt="Dash-board" width={20} height={20} src={Dash} />,
    },
    {
      name: "Inventory",
      href: "/inventory",
      icon: <Image alt="Inventory" width={20} height={20} src={Inv} />,
    },
    {
      name: "Add Product",
      href: "/add-product",
      icon: <Image alt="add" width={20} height={20} src={Add} />,
    },
    {
      name: "Activity Log",
      href: "/activity",
      icon: <Image alt="Activity" width={20} height={20} src={Activity} />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Image alt="Settings" width={20} height={20} src={Settings} />,
    },
  ];

  return (
    <div className="fixed left-0 top-0 bg-neutral text-white w-64 min-h-screen p-6 z-10">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span className="text-lg font-semibold">Inventory App</span>
        </div>
      </div>
      <nav className="space-y-1">
        <div className="text-sm font-semibold uppercase text-secondary">
          Inventory
        </div>
        {navigation.map((item, key) => {
          const isActive = currentPath === item.href;

          return (
            <Link
              href={item.href}
              key={key}
              className={`flex items-center space-x-3  py-2 rounded-lg ${
                isActive
                  ? "bg-primary text-white px-3"
                  : "hover:bg-secondary hover:text-white px-3 text-secondary"
              }`}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-neutral">
        <div className="flex items-center justify-between">
          <UserButton showUserInfo />
        </div>
      </div>
    </div>
  );
}
