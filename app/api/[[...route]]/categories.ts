import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { categories, insertCategorySchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";

const app = new Hono()
  .get("/", async (c) => {
    const data = await db.select().from(categories);

    if (!data) {
      return c.json({ error: "No products found" }, 404);
    }

    return c.json(data);
  })
  .post(
    "/",
    zValidator(
      "json",
      insertCategorySchema.pick({
        name: true,
      })
    ),
    async (c) => {
      const values = c.req.valid("json");

      if (!values) {
        return c.json({ error: "Invalid data" }, 400);
      }

      const [data] = await db.insert(categories).values(values).returning();

      return c.json(data);
    }
  );

export default app;
