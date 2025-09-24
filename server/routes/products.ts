import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const DATA_PATH = path.join(__dirname, "..", "data", "products.json");

async function readData(): Promise<any[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    // if file missing, initialize
    try { await fs.mkdir(path.dirname(DATA_PATH), { recursive: true }); await fs.writeFile(DATA_PATH, "[]"); } catch {};
    return [];
  }
}

async function writeData(data: any[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function handleGetProducts(req: Request, res: Response) {
  try {
    const list = await readData();
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: "failed_reading_products" });
  }
}

export async function handleCreateProduct(req: Request, res: Response) {
  try {
    const body = req.body || {};
    const list = await readData();
    const id = body.id || randomUUID();
    const product = { id, ...body };
    list.push(product);
    await writeData(list);
    res.status(201).json(product);
  } catch (e) {
    res.status(500).json({ error: "failed_creating_product" });
  }
}

export async function handleUpdateProduct(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const body = req.body || {};
    const list = await readData();
    const idx = list.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) return res.status(404).json({ error: "not_found" });
    const updated = { ...list[idx], ...body };
    list[idx] = updated;
    await writeData(list);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "failed_updating_product" });
  }
}

export async function handleDeleteProduct(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const list = await readData();
    const next = list.filter((p) => String(p.id) !== String(id));
    if (next.length === list.length) return res.status(404).json({ error: "not_found" });
    await writeData(next);
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: "failed_deleting_product" });
  }
}
