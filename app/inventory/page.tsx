// app/inventory/page.tsx
import { prisma } from "@/lib/prisma";
import SideBar from "../components/sideBar";
import MobileTopNav from "../components/mobileTopNav";
import { getCurrentUser } from "@/lib/auth";
import { deleteProduct } from "@/lib/actions/products";
import Pagination from "../components/pagination";
import Link from "next/link";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const user = await getCurrentUser();
  const userId = user.id;
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const pageSize = 6;
  const page = Math.max(1, Number(params.page ?? 1));
  const where = {
    userId,
    ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
  };

  const [totalCount, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="min-h-screen bg-base-200">
      <SideBar currentPath="/inventory" />
      <MobileTopNav currentPath="/inventory" />

      <main className="p-4 md:ml-64 md:p-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold">Inventory</h1>
              <p className="text-sm mt-2">
                Manage you products and track inventory levels.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Search */}
          <div className="p-0 sm:p-6">
            <form
              action="/inventory"
              method="GET"
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                name="q"
                placeholder="Search..."
                defaultValue={q}
                className="input flex-1 px-4 py-2 rounded-lg"
              />
              <button className="px-6 py-2 btn btn-primary text-white rounded-lg">
                Search
              </button>
              <Link href={"/inventory"} className="btn btn-neutral rounded-lg">
                Back
              </Link>
            </form>
          </div>

          {/* products table */}
          <div className="bg-white rounded-lg border border-neutral overflow-x-auto">
            <table className="min-w-[520px] w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-left text-xs font-medium uppercase w-40">
                    Name
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-medium uppercase w-40">
                    Price
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-medium uppercase w-40">
                    Quantity
                  </th>
                  <th className="px-2 py-3 text-right text-xs font-medium uppercase w-40">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((p, key) => (
                  <tr key={key} className="hover:bg-gray-100">
                    <td className="whitespace-nowrap">
                      <div className="font-medium pl-2">{p.name}</div>
                      <div className="text-xs opacity-60 pl-2">
                        {p.sku ?? "-"}
                      </div>
                    </td>

                    <td className="whitespace-nowrap text-center">
                      ${p.price.toFixed(2)}
                    </td>

                    <td className="whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span>{p.quantity}</span>

                        {typeof p.loStock === "number" &&
                        p.quantity < p.loStock ? (
                          <span className="badge badge-error badge-sm">
                            Low
                          </span>
                        ) : null}
                      </div>
                      {typeof p.loStock === "number" ? (
                        <div className="text-xs opacity-60">
                          min {p.loStock}
                        </div>
                      ) : (
                        <div className="text-xs opacity-60">—</div>
                      )}
                    </td>

                    <td className="whitespace-nowrap">
                      <div className="flex flex-wrap justify-end gap-2 pr-2">
                        <Link
                          href={`/inventory/${p.id}/edit`}
                          className="btn btn-sm"
                        >
                          Edit
                        </Link>

                        <form
                          action={async () => {
                            "use server";
                            await deleteProduct(p.id);
                          }}
                        >
                          <button
                            className="btn btn-sm btn-error"
                            type="submit"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              baseUrl="/inventory"
              searchParams={{
                q,
                pageSize: String(pageSize),
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
