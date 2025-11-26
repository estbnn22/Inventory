export function diff(
  before: Record<string, unknown> | null | undefined,
  after: Record<string, unknown> | null | undefined
) {
  const a = before ?? {};
  const b = after ?? {};
  const out: Record<string, { from: unknown; to: unknown }> = {};
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    if (k === "createdAt" || k === "updatedAt" || k === "userId" || k === "id")
      continue;
    const va = (a as any)[k];
    const vb = (b as any)[k];
    const nva =
      typeof va?.toString === "function" && typeof va !== "string"
        ? va.toString()
        : va;
    const nvb =
      typeof vb?.toString === "function" && typeof vb !== "string"
        ? vb.toString()
        : vb;
    if (JSON.stringify(nva) !== JSON.stringify(nvb))
      out[k] = { from: nva, to: nvb };
  }
  return out;
}
