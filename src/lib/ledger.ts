// ─────────────────────────────────────────────────────────────────────────────
// Customer + Order ledger
//
// Besides the database, every new customer and every order is also appended to a
// clean, human-readable file under  /data  so the founder can open and read them
// without any database tools:
//
//   data/customers.json   — one tidy record per signup (newest last)
//   data/customers.csv     — same data, spreadsheet-friendly (Excel/Sheets)
//   data/orders.json       — one record per placed order
//
// Writes are best-effort and fully wrapped in try/catch: if the filesystem is
// read-only (e.g. a serverless host), the app keeps working — only the local
// convenience copy is skipped. The database remains the source of truth.
// ─────────────────────────────────────────────────────────────────────────────

import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJsonArray(file: string): Promise<Record<string, unknown>[]> {
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function csvEscape(value: unknown): string {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

export interface CustomerRecord {
  name: string;
  email: string;
  phone: string;
  source?: string; // e.g. "signup" | "checkout"
}

/** Append a customer to data/customers.json + data/customers.csv (best-effort). */
export async function appendCustomer(record: CustomerRecord): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    const jsonFile = path.join(DATA_DIR, "customers.json");
    const rows = await readJsonArray(jsonFile);
    const entry = {
      name: record.name,
      email: record.email,
      phone: record.phone,
      source: record.source ?? "signup",
      signedUpAt: new Date().toISOString(),
    };
    rows.push(entry);
    await fs.writeFile(jsonFile, JSON.stringify(rows, null, 2) + "\n", "utf8");

    const csvFile = path.join(DATA_DIR, "customers.csv");
    const header = "Name,Email,Phone,Source,SignedUpAt\n";
    let csv = await fs.readFile(csvFile, "utf8").catch(() => "");
    if (!csv) csv = header;
    csv +=
      [entry.name, entry.email, entry.phone, entry.source, entry.signedUpAt]
        .map(csvEscape)
        .join(",") + "\n";
    await fs.writeFile(csvFile, csv, "utf8");
  } catch (err) {
    console.warn("[ledger] could not write customer file:", err);
  }
}

export interface OrderRecord {
  orderNumber: string;
  customer: { name: string; email: string; phone: string };
  shippingAddress: Record<string, unknown>;
  items: { productName: string; variantName: string; quantity: number; price: number }[];
  totalAmount: number;
}

/** Append a placed order to data/orders.json (best-effort). */
export async function appendOrder(record: OrderRecord): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const jsonFile = path.join(DATA_DIR, "orders.json");
    const rows = await readJsonArray(jsonFile);
    rows.push({ ...record, placedAt: new Date().toISOString() });
    await fs.writeFile(jsonFile, JSON.stringify(rows, null, 2) + "\n", "utf8");
  } catch (err) {
    console.warn("[ledger] could not write order file:", err);
  }
}
