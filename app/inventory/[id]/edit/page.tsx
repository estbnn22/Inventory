import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import SideBar from "@/app/components/sideBar";
import MobileTopNav from "@/app/components/mobileTopNav"; // ✅ ADD
import Link from "next/link";
import { updateProduct } from "@/lib/actions/products";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const user = await getCurrentUser();
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: { id, userId: user.id },
  });

  if (!product) {
    return (
      <div className="min-h-screen bg-base-200">
        <SideBar currentPath="/inventory" />
        <MobileTopNav currentPath="/inventory" /> {/* ✅ ADD */}
        {/* ✅ responsive main */}
        <main className="p-4 md:ml-64 md:p-8">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link
            className="btn btn-primary mt-4 w-full sm:w-auto"
            href="/inventory"
          >
            Back to Inventory
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <SideBar currentPath="/inventory" />
      <MobileTopNav currentPath="/inventory" /> {/* ✅ ADD */}
      {/* ✅ responsive main */}
      <main className="p-4 md:ml-64 md:p-8">
        <div className="mb-6">
          {/* ✅ stack header on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold">Edit Product</h1>
              <p className="text-sm opacity-70">
                Update fields and save changes.
              </p>
            </div>

            <Link href="/inventory" className="btn btn-ghost w-full sm:w-auto">
              Back
            </Link>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <form
              action={updateProduct.bind(null, product.id)}
              className="space-y-4"
            >
              {/* ✅ already responsive (1 col mobile, 2 col md+) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="form-control">
                  <div className="label pr-2">
                    <span className="label-text">Name</span>
                  </div>
                  <input
                    name="name"
                    defaultValue={product.name}
                    className="input input-bordered w-full"
                    required
                  />
                </label>

                <label className="form-control">
                  <div className="label">
                    <span className="label-text pr-2">SKU</span>
                  </div>
                  <input
                    name="sku"
                    defaultValue={product.sku ?? ""}
                    className="input input-bordered w-full"
                  />
                </label>

                <label className="form-control">
                  <div className="label">
                    <span className="label-text pr-2">Price</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    defaultValue={product.price.toString()}
                    className="input input-bordered w-full"
                    required
                  />
                </label>

                <label className="form-control">
                  <div className="label pr-2">
                    <span className="label-text">Quantity</span>
                  </div>
                  <input
                    type="number"
                    name="quantity"
                    defaultValue={product.quantity}
                    className="input input-bordered w-full"
                    min={0}
                    required
                  />
                </label>

                <label className="form-control md:col-span-2">
                  <div className="label">
                    <span className="label-text pr-2">Low-stock threshold</span>
                  </div>
                  <input
                    type="number"
                    name="lowStockAt"
                    defaultValue={product.loStock ?? ""}
                    className="input input-bordered w-full"
                    min={0}
                  />
                </label>
              </div>

              {/* ✅ wrap + full width buttons on mobile */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-soft w-full sm:w-auto"
                >
                  Save changes
                </button>
                <Link
                  href="/inventory"
                  className="btn btn-ghost w-full sm:w-auto"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
