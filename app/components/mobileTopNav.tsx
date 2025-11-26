// app/components/mobileTopNav.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function MobileTopNav({ currentPath }: { currentPath: string }) {
  const [open, setOpen] = useState(false);

  const nav = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Inventory", href: "/inventory" },
    { name: "Add Product", href: "/add-product" },
    { name: "Activity", href: "/activity" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <div className="md:hidden sticky top-0 z-20 bg-neutral text-white border-b border-black/20">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-semibold">Inventory App</span>

        <button
          onClick={() => setOpen((v) => !v)}
          className="btn btn-sm btn-ghost text-white"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="px-2 pb-3">
          {nav.map((item) => {
            const active = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm ${
                  active ? "bg-primary text-white" : "text-secondary"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
