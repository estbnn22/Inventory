import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import SideBar from "../components/sideBar";
import MobileTopNav from "../components/mobileTopNav"; // ✅ ADD
import type { Prisma, Activity as ActivityRow } from "@prisma/client";

type SearchParams = Promise<{
  action?: "CREATE_PRODUCT" | "UPDATE_PRODUCT" | "DELETE_PRODUCT";
  q?: string;
  cursorId?: string;
  dir?: "next" | "prev";
  anchorId?: string;
}>;

const PAGE_SIZE = 6;

// Types + helpers
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

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getCurrentUser();
  const userId = user.id;
  const { action, q, cursorId, dir } = await searchParams;
  const direction = dir === "prev" ? "prev" : "next";

  // Base filter (server side)
  const whereBase: any = { userId };
  if (action) whereBase.action = action;

  const orderBy = [{ createdAt: "desc" as const }, { id: "desc" as const }];
  const signedTake = dir === "prev" ? -(PAGE_SIZE + 1) : PAGE_SIZE + 1;

  const records = await prisma.activity.findMany({
    where: whereBase,
    orderBy,
    take: signedTake,
    ...(cursorId ? { cursor: { id: cursorId }, skip: 1 } : {}),
    select: { id: true, action: true, meta: true, createdAt: true },
  });

  const normalized = dir === "prev" ? [...records].reverse() : records;
  const hasMoreInFetchDir = normalized.length > PAGE_SIZE;
  const page = normalized.slice(0, PAGE_SIZE);
  const firstId = page[0]?.id;
  const lastId = page[page.length - 1]?.id;
  const nextCursorId = lastId;
  const prevCursorId = firstId;
  const canPrev = dir === "next" ? Boolean(cursorId) : hasMoreInFetchDir;
  const canNext = dir === "prev" ? page.length > 0 : hasMoreInFetchDir;

  return (
    <div className="min-h-screen bg-base-200">
      <SideBar currentPath="/activity" />
      <MobileTopNav currentPath="/activity" /> {/* ✅ ADD */}
      {/* ✅ responsive main */}
      <main className="p-4 md:ml-64 md:p-8">
        {/* ✅ responsive header row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Activity</h1>
            <p className="text-sm opacity-70">
              Auditing for creates, updates, and deletes.
            </p>
          </div>

          {/* ✅ stack controls on mobile */}
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <form className="join w-full sm:w-auto flex flex-col sm:flex-row">
              <input
                name="q"
                defaultValue={q ?? ""}
                placeholder="Search name/SKU…"
                className="input input-sm input-bordered join-item w-full sm:w-48"
              />
              <select
                name="action"
                defaultValue={action ?? ""}
                className="select select-sm select-bordered join-item w-full sm:w-44"
              >
                <option value="">All actions</option>
                <option value="CREATE_PRODUCT">Create</option>
                <option value="UPDATE_PRODUCT">Update</option>
                <option value="DELETE_PRODUCT">Delete</option>
              </select>
              <button className="btn btn-sm btn-primary btn-soft join-item w-full sm:w-auto">
                Filter
              </button>
            </form>

            <Link
              href="/inventory"
              className="btn btn-sm btn-neutral btn-soft w-full sm:w-auto"
            >
              Back to Inventory
            </Link>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          {/* ✅ horizontal scroll for table on mobile */}
          <div className="card-body overflow-x-auto">
            <table className="table table-zebra min-w-[700px]">
              <thead>
                <tr>
                  <th className="w-40">When</th>
                  <th className="w-40">Action</th>
                  <th>Product</th>
                  <th>Changes</th>
                </tr>
              </thead>
              <tbody>
                {page.map((r) => {
                  const meta = isActivityMeta(r.meta) ? r.meta : undefined;
                  return (
                    <tr key={r.id}>
                      <td className="align-top text-sm">
                        {r.createdAt.toLocaleString()}
                      </td>
                      <td className="align-top">
                        <span className="badge">{formatAction(r.action)}</span>
                      </td>
                      <td className="align-top">
                        <div className="font-medium">{meta?.name ?? "—"}</div>
                        <div className="text-xs opacity-60">
                          {meta?.sku ?? "—"}
                        </div>
                      </td>
                      <td className="align-top">
                        {meta?.diff && Object.keys(meta.diff).length > 0 ? (
                          <div className="text-xs space-y-0.5">
                            {Object.entries(meta.diff).map(([k, v]) => (
                              <div key={k}>
                                <span className="font-medium">{k}</span>:{" "}
                                <span className="line-through opacity-70">
                                  {String(v.from ?? "—")}
                                </span>{" "}
                                → <span>{String(v.to ?? "—")}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="opacity-60">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* ✅ responsive pagination */}
            <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-between">
              {/* Previous */}
              {canPrev && prevCursorId ? (
                <Link
                  href={{
                    pathname: "/activity",
                    query: {
                      action: action ?? "",
                      q: q ?? "",
                      cursorId: prevCursorId,
                      dir: "prev",
                    },
                  }}
                  className="btn btn-sm w-full sm:w-auto"
                >
                  ← Previous
                </Link>
              ) : (
                <span className="btn btn-sm btn-disabled w-full sm:w-auto">
                  ← Previous
                </span>
              )}

              {/* Next */}
              {canNext && nextCursorId ? (
                <Link
                  href={{
                    pathname: "/activity",
                    query: {
                      action: action ?? "",
                      q: q ?? "",
                      cursorId: nextCursorId,
                      dir: "next",
                    },
                  }}
                  className="btn btn-sm w-full sm:w-auto"
                >
                  Next →
                </Link>
              ) : (
                <span className="btn btn-sm btn-disabled w-full sm:w-auto">
                  Next →
                </span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
