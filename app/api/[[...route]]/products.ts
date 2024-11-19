import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { products, insertProdcutSchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";

const app = new Hono()
  .get("/", async (c) => {
    const data = await db.select().from(products);

    if (!data) {
      return c.json({ error: "No products found" }, 404);
    }

    return c.json(data);
  })
  .post(
    "/",
    zValidator(
      "json",
      insertProdcutSchema.pick({
        categoryId: true,
        description: true,
        imageUrl: true,
        name: true,
        petId: true,
        price: true,
        stock: true,
      })
    ),
    async (c) => {
      const values = c.req.valid("json");

      if (!values) {
        return c.json({ error: "Invalid data" }, 400);
      }

      const [data] = await db.insert(products).values(values).returning();

      return c.json(data);
    }
  );

export default app;
