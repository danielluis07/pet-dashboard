import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { categories, insertCategorySchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const data = await db.select().from(categories);

    if (!data) {
      return c.json({ error: "No products found" }, 404);
    }

    return c.json({ data });
  })
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .select({
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(eq(categories.id, id));

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
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

      return c.json({ data });
    }
  )
  .post(
    "delete-categories",
    zValidator("json", z.object({ ids: z.array(z.string()) })),
    async (c) => {
      const values = c.req.valid("json");

      if (!values) {
        return c.json({ error: "Invalid data" }, 400);
      }

      const data = await db
        .delete(categories)
        .where(inArray(categories.id, values.ids))
        .returning({
          id: categories.id,
        });

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", insertCategorySchema.pick({ name: true })),
    async (c) => {
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .update(categories)
        .set(values)
        .where(eq(categories.id, id))
        .returning();

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .delete(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .delete(categories)
        .where(and(eq(categories.id, id)))
        .returning({
          id: categories.id,
        });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
