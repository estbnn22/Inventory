import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import SideBar from "@/app/components/sideBar";
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
        <main className="ml-64 p-8">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link className="btn btn-primary mt-4" href="/inventory">
            Back to Inventory
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <SideBar currentPath="/inventory" />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Edit Product</h1>
              <p className="text-sm opacity-70">
                Update fields and save changes.
              </p>
            </div>
            <Link href="/inventory" className="btn btn-ghost">
              Back
            </Link>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <form
              action={updateProduct.bind(null, product.id)}
              className="space-y-4 spaxce-x-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <label className="form-control">
                  <div className="label pr-2">
                    <span className="label-text">Name</span>
                  </div>
                  <input
                    name="name"
                    defaultValue={product.name}
                    className="input input-bordered"
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
                    className="input input-bordered"
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
                    className="input input-bordered"
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
                    className="input input-bordered"
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
                    className="input input-bordered"
                    min={0}
                  />
                </label>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary btn-soft">
                  Save changes
                </button>
                <Link href="/inventory" className="btn btn-ghost">
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
