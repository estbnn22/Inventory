"use server";

import { prisma } from "@/lib/prisma";

export type ActivityMeta = {
  name?: string;
  sku?: string | null;
  diff?: Record<string, { from: unknown; to: unknown }>;
};

export async function logActivity(input: {
  userId: string;
  action: "CREATE_PRODUCT" | "UPDATE_PRODUCT" | "DELETE_PRODUCT";
  productId?: string | null;
  meta?: ActivityMeta;
}) {
  const { userId, action, productId, meta } = input;
  await prisma.activity.create({
    data: {
      userId,
      action,
      productId: productId ?? null,
      meta: meta ? (meta as any) : undefined,
    },
  });
}
