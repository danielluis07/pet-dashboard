import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { products, insertProdcutSchema, pets, categories } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq, inArray } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const data = await db
      .select({
        product: products,
        pet: pets,
        category: categories,
      })
      .from(products)
      .leftJoin(pets, eq(products.petId, pets.id))
      .leftJoin(categories, eq(products.categoryId, categories.id));

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
        .select()
        .from(products)
        .where(eq(products.id, id))
        .leftJoin(pets, eq(products.petId, pets.id))
        .leftJoin(categories, eq(products.categoryId, categories.id));

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
      insertProdcutSchema.pick({
        categoryId: true,
        description: true,
        imageUrl: true,
        name: true,
        petId: true,
        price: true,
        stock: true,
        isFeatured: true,
        slug: true,
        isNew: true,
      })
    ),
    async (c) => {
      const values = c.req.valid("json");

      if (!values) {
        return c.json({ error: "Invalid data" }, 400);
      }

      const [data] = await db.insert(products).values(values).returning();

      return c.json({ data });
    }
  )
  .post(
    "delete-products",
    zValidator("json", z.object({ ids: z.array(z.string()) })),
    async (c) => {
      const values = c.req.valid("json");

      if (!values) {
        return c.json({ error: "Invalid data" }, 400);
      }

      const data = await db
        .delete(products)
        .where(inArray(products.id, values.ids))
        .returning({
          id: products.id,
        });

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator(
      "json",
      insertProdcutSchema.pick({
        name: true,
        categoryId: true,
        description: true,
        imageUrl: true,
        petId: true,
        price: true,
        slug: true,
        stock: true,
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .update(products)
        .set({ ...values, updatedAt: new Date() })
        .where(eq(products.id, id))
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
        .delete(products)
        .where(eq(products.id, id))
        .returning({
          id: products.id,
        });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
