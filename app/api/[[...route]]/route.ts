import { Hono } from "hono";
import { handle } from "hono/vercel";
import users from "./users";
import products from "./products";
import categories from "./categories";
import pets from "./pets";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

const routes = app
  .route("/users", users)
  .route("/products", products)
  .route("/categories", categories)
  .route("pets", pets);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
