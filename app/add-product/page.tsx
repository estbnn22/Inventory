import { getCurrentUser } from "@/lib/auth";
import SideBar from "../components/sideBar";
import Link from "next/link";
import { createProduct } from "@/lib/actions/products";

export default async function AddProduct() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-base-200">
      <SideBar currentPath="/add-product" />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Add Product</h1>
              <p className="text-sm mt-2">
                Add a new product to your inventory
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl gap">
          <div className="bg-white rounded-lg border border-neutral p-6">
            <form action={createProduct} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 "
                >
                  Product Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="input w-full rounded-lg focus:border-transparent"
                  placeholder="Enter Product Name..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium mb-2 "
                  >
                    Price <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    min="0"
                    required
                    className="input w-full rounded-lg focus:border-transparent"
                    placeholder="$0.00"
                  />
                </div>
                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium mb-2 "
                  >
                    Quantity <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="0"
                    required
                    className="input w-full rounded-lg focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="sku"
                  className="block text-sm font-medium mb-2 "
                >
                  SKU
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  min="0"
                  className="input w-full rounded-lg focus:border-transparent"
                  placeholder="Enter SKU..."
                />
              </div>
              <div>
                <label
                  htmlFor="lowStockAt"
                  className="block text-sm font-medium mb-2 "
                >
                  Low Stock At
                </label>
                <input
                  type="number"
                  id="lowStockAt"
                  name="lowStockAt"
                  min="0"
                  className="input w-full rounded-lg focus:border-transparent"
                  placeholder="Enter Low Stock Threshold..."
                />
              </div>

              <div className="flex gap-5">
                <button type="submit" className="btn btn-primary btn-soft">
                  Add Product
                </button>
                <Link href="/inventory" className="btn btn-error btn-soft">
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
