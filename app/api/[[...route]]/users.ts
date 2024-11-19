import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

const app = new Hono().get("/", async (c) => {
  const data = await db.select().from(users);

  if (!data) {
    return c.json({ error: "No users found" }, 404);
  }

  return c.json({ data });
});

export default app;
