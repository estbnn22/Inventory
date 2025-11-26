import { prisma } from "@/lib/prisma";
import SideBar from "../components/sideBar";
import MobileTopNav from "../components/mobileTopNav"; // ✅ ADD
import { getCurrentUser } from "@/lib/auth";
import ProductsChart from "../components/productsChart";
import Link from "next/link";

import type { Prisma, Activity as ActivityRow } from "@prisma/client";

type ActivityMeta = {
  name?: string;
  sku?: string | null;
  diff?: Record<string, { from: unknown; to: unknown }>;
};

function isActivityMeta(value: unknown): value is ActivityMeta {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatAction(a: ActivityRow["action"]) {
  return String(a).replace(/_/g, " ").toLowerCase();
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userId = user.id;

  // ------ Metrics ------
  const totalProducts = await prisma.product.count({ where: { userId } });

  const lowStock = await prisma.product.count({
    where: { userId, loStock: { not: null }, quantity: { lt: 10 } },
  });

  const candidates = await prisma.product.findMany({
    where: { userId, loStock: { not: null } },
    orderBy: { quantity: "asc" },
    take: 20,
  });
  const lowList = candidates
    .filter(
      (c) => typeof c.loStock === "number" && c.quantity < (c.loStock as number)
    )
    .slice(0, 5);

  const allProducts = await prisma.product.findMany({
    where: { userId },
    select: { price: true, quantity: true, createdAt: true },
  });

  const totalValue = allProducts.reduce(
    (sum, p) => sum + Number(p.price) * Number(p.quantity),
    0
  );

  const inStockCount = allProducts.filter((p) => Number(p.quantity) > 5).length;
  const lowStockCount = allProducts.filter(
    (p) => Number(p.quantity) <= 5 && Number(p.quantity) >= 1
  ).length;
  const outOfStockCount = allProducts.filter(
    (p) => Number(p.quantity) === 0
  ).length;

  const inStockPercentage =
    totalProducts > 0 ? Math.round((inStockCount / totalProducts) * 100) : 0;
  const lowStockPercentage =
    totalProducts > 0 ? Math.round((lowStockCount / totalProducts) * 100) : 0;
  const outOfStockPercentage =
    totalProducts > 0 ? Math.round((outOfStockCount / totalProducts) * 100) : 0;

  const now = new Date();
  const weeklyProductsData: { week: string; products: number }[] = [];

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekLabel = `${String(weekStart.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(weekStart.getDate() + 1).padStart(2, "0")}`;

    const weekProducts = allProducts.filter((product) => {
      const productDate = new Date(product.createdAt);
      return productDate >= weekStart && productDate <= weekEnd;
    });

    weeklyProductsData.push({ week: weekLabel, products: weekProducts.length });
  }

  // ------ Stock Levels card ------
  const recentProducts = await prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  // ------ Recent Activity ------
  const recentActivity = await prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: { id: true, action: true, meta: true, createdAt: true },
  });

  return (
    <div className="min-h-screen bg-base-200">
      <SideBar currentPath="/dashboard" />

      {/* ✅ Mobile-only top nav */}
      <MobileTopNav currentPath="/dashboard" />

      {/* ✅ main full width on mobile, sidebar offset only on md+ */}
      <main className="p-4 md:ml-64 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-md mt-2">
                Welcome to your dashboard! You can manage your products and
                inventory here.
              </p>
            </div>
          </div>
        </div>

        {/* Top 2 cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Key Metrics */}
          <div className="bg-white rounded-lg border border-primary p-6 hover:shadow-md">
            <h2 className="text-lg font-semibold mb-6">Key Metrics</h2>

            {/* ✅ responsive metrics grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{totalProducts}</div>
                <div className="text-sm">Total Products</div>
                <div>
                  <span
                    className={`text-xs ${
                      lowStock <= 0 ? "hidden" : "text-green-600"
                    }`}
                  >
                    +{totalProducts}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold">
                  ${Number(totalValue).toFixed(0)}
                </div>
                <div className="text-sm">Total Value</div>
                <div>
                  <span
                    className={`text-xs ${
                      lowStock <= 0 ? "hidden" : "text-green-600"
                    }`}
                  >
                    + ${Number(totalValue).toFixed(0)}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold">{lowStock}</div>
                <div className="text-sm text-error font-semibold">
                  Less than 10 in stock
                </div>
                <div>
                  <span
                    className={`text-xs ${
                      lowStock <= 0 ? "hidden" : "text-red-600"
                    }`}
                  >
                    +{lowStock}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* inventory over time */}
          <div className="bg-white rounded-lg border border-primary p-6 hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2>New Products per Week</h2>
            </div>
            <div className="h-48">
              <ProductsChart data={weeklyProductsData} />
            </div>
          </div>
        </div>

        {/* Bottom 4 cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Stock Levels */}
          <div className="bg-white rounded-lg border border-primary p-6 hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h2 className="card-title text-base">Stock Levels</h2>
              <Link href="/inventory?q=" className="link link-hover text-sm">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {recentProducts.map((product, key) => {
                const stockLevel =
                  product.quantity === 0
                    ? 0
                    : product.quantity <= (product.loStock || 5)
                    ? 1
                    : 2;

                const bgColors = [
                  "bg-red-500",
                  "bg-yellow-500",
                  "bg-green-500",
                ];
                const textColors = [
                  "text-red-500",
                  "text-yellow-500",
                  "text-green-500",
                ];

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${bgColors[stockLevel]}`}
                      />
                      <span className="text-sm font-medium">
                        {product.name}
                      </span>
                    </div>
                    <div
                      className={`text-sm font-medium ${textColors[stockLevel]}`}
                    >
                      {product.quantity} units
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Low Stock list */}
          <div className="card bg-white hover:shadow-md border border-primary">
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <h2 className="card-title text-base">Low-stock</h2>
                <Link href="/inventory?q=" className="link link-hover text-sm">
                  View all
                </Link>
              </div>

              {lowList.length === 0 ? (
                <div className="text-sm opacity-60">
                  All good — nothing below threshold.
                </div>
              ) : (
                <ul className="space-y-2">
                  {lowList.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs opacity-60">
                          Qty {item.quantity} • Min {item.loStock}
                        </div>
                      </div>
                      <span className="badge badge-error badge-sm">Low</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Efficiency */}
          <div className="bg-white rounded-lg border border-primary p-6 hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Efficiency</h2>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900">
                      {inStockPercentage}%
                    </div>
                    <div className="text-sm text-gray-600">In Stock</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-600" />
                  <span>In Stock ({inStockPercentage}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-200" />
                  <span>Less than 10 in Stock ({lowStockPercentage}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                  <span>Out of Stock ({outOfStockPercentage}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="card bg-white hover:shadow-md border border-primary">
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <h2 className="card-title text-base">Recent activity</h2>
                <a href="/activity" className="link link-hover text-sm">
                  View all
                </a>
              </div>

              <ul className="space-y-2">
                {recentActivity.map((r) => {
                  const meta = isActivityMeta(r.meta) ? r.meta : {};
                  return (
                    <li key={r.id} className="flex items-start justify-between">
                      <div>
                        <div className="text-sm">
                          <span className="font-medium">
                            {meta.name ?? "Product"}
                          </span>
                          {" — "}
                          <span className="opacity-80">
                            {formatAction(r.action)}
                          </span>
                        </div>
                        <div className="text-[11px] opacity-60">
                          {new Date(r.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <span className="badge badge-ghost badge-xs">
                        {meta.sku ?? "—"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
