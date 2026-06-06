import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ batchNumber: string }> }) {
  const { batchNumber } = await params;

  const batch = await db.batchNumber.findUnique({
    where: { batchNumber },
    include: { products: { include: { product: { select: { name: true } } } } },
  });

  if (!batch) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(batch);
}
