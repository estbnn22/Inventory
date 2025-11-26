"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { logActivity } from "./log-activity";
import { diff } from "../utils/diff";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().nonnegative("Price must be >= 0"),
  quantity: z.coerce.number().int().min(0, "Quantity must be >= 0"),
  sku: z.string().optional(),
  loStock: z.coerce.number().int().min(0).optional(),
});

export async function createProduct(formData: FormData) {
  const user = await getCurrentUser();

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    sku: (formData.get("sku") as string) || undefined,
    loStock: (formData.get("lowStockAt") as string) || undefined,
  });
  if (!parsed.success) throw new Error("Validation failed");

  const created = await prisma.product.create({
    data: { ...parsed.data, userId: user.id },
  });

  await logActivity({
    userId: user.id,
    action: "CREATE_PRODUCT",
    productId: created.id,
    meta: { name: created.name, sku: created.sku ?? null },
  });

  redirect("/inventory");
}

export async function updateProduct(id: string, formData: FormData) {
  const user = await getCurrentUser();

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    sku: (formData.get("sku") as string) || undefined,
    loStock: (formData.get("lowStockAt") as string) || undefined,
  });
  if (!parsed.success) throw new Error("Validation failed");

  const before = await prisma.product.findFirst({
    where: { id, userId: user.id },
  });
  if (!before) throw new Error("Product not found");

  const updated = await prisma.product.update({
    where: { id, userId: user.id },
    data: parsed.data,
  });

  await logActivity({
    userId: user.id,
    action: "UPDATE_PRODUCT",
    productId: id,
    meta: {
      name: updated.name,
      sku: updated.sku ?? null,
      diff: diff(
        {
          name: before.name,
          sku: before.sku,
          price: before.price,
          quantity: before.quantity,
          loStock: before.loStock,
        },
        {
          name: updated.name,
          sku: updated.sku,
          price: updated.price,
          quantity: updated.quantity,
          loStock: updated.loStock,
        }
      ),
    },
  });

  revalidatePath("/inventory");
  redirect("/inventory");
}

export async function deleteProduct(id: string) {
  const user = await getCurrentUser();

  const before = await prisma.product.findFirst({
    where: { id, userId: user.id },
  });
  if (!before) throw new Error("Product not found");

  await prisma.product.delete({ where: { id, userId: user.id } });

  await logActivity({
    userId: user.id,
    action: "DELETE_PRODUCT",
    productId: id,
    meta: { name: before.name, sku: before.sku ?? null },
  });

  revalidatePath("/inventory");
}
