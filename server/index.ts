import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleRates } from "./routes/rates";

import { handleStripeWebhook } from "./routes/stripe";
import { handleCreateCheckout } from "./routes/checkout";

export function createServer() {
  const app = express();

  // CORS first
  app.use(cors());

  // Stripe webhook must get raw body. Register BEFORE json/urlencoded.
  app.post("/stripe/webhook", express.raw({ type: "*/*" }), handleStripeWebhook);

  // Other middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/rates", handleRates);
  app.post("/api/checkout", handleCreateCheckout);

  // Product CRUD (simple file-backed DB)
  // GET /api/products
  // POST /api/products
  // PATCH /api/products/:id
  // DELETE /api/products/:id
  const { handleGetProducts, handleCreateProduct, handleUpdateProduct, handleDeleteProduct } = require("./routes/products");
  app.get("/api/products", handleGetProducts);
  app.post("/api/products", handleCreateProduct);
  app.patch("/api/products/:id", handleUpdateProduct);
  app.delete("/api/products/:id", handleDeleteProduct);

  return app;
}
