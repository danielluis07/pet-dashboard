import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { products, insertProdcutSchema, pets, categories } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";

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
  .get("/new-products", async (c) => {
    const data = await db
      .select({
        product: products,
        pet: pets,
        category: categories,
      })
      .from(products)
      .where(eq(products.isNew, true))
      .leftJoin(pets, eq(products.petId, pets.id))
      .leftJoin(categories, eq(products.categoryId, categories.id));

    if (!data) {
      return c.json({ error: "No products found" }, 404);
    }

    return c.json({ data });
  })
  .get("/dogs", async (c) => {
    const data = await db
      .select({
        product: products,
        pet: pets,
        category: categories,
      })
      .from(products)
      .where(eq(products.petId, "d0c4d4c0-9f69-4e2f-90fa-c195521a2301"))
      .leftJoin(pets, eq(products.petId, pets.id))
      .leftJoin(categories, eq(products.categoryId, categories.id));

    if (!data) {
      return c.json({ error: "No products found" }, 404);
    }

    return c.json({ data });
  })
  .get("/dogs/food", async (c) => {
    const data = await db
      .select({
        product: products,
        pet: pets,
        category: categories,
      })
      .from(products)
      .where(
        and(
          eq(products.petId, "d0c4d4c0-9f69-4e2f-90fa-c195521a2301"),
          eq(products.categoryId, "ee98b764-917d-4dbf-a1cc-2628fa05c433")
        )
      )
      .leftJoin(pets, eq(products.petId, pets.id))
      .leftJoin(categories, eq(products.categoryId, categories.id));

    if (!data) {
      return c.json({ error: "No products found" }, 404);
    }

    return c.json({ data });
  })
  .get("/dogs/toys", async (c) => {
    const data = await db
      .select({
        product: products,
        pet: pets,
        category: categories,
      })
      .from(products)
      .where(
        and(
          eq(products.petId, "d0c4d4c0-9f69-4e2f-90fa-c195521a2301"),
          eq(products.categoryId, "f0ff8413-fd44-4d34-bda2-ce9bb9237585")
        )
      )
      .leftJoin(pets, eq(products.petId, pets.id))
      .leftJoin(categories, eq(products.categoryId, categories.id));

    if (!data) {
      return c.json({ error: "No products found" }, 404);
    }

    return c.json({ data });
  })
  .get("/dogs/care", async (c) => {
    const data = await db
      .select({
        product: products,
        pet: pets,
        category: categories,
      })
      .from(products)
      .where(
        and(
          eq(products.petId, "d0c4d4c0-9f69-4e2f-90fa-c195521a2301"),
          eq(products.categoryId, "ee3401f6-e7f7-419f-a59d-3d671ea082aa")
        )
      )
      .leftJoin(pets, eq(products.petId, pets.id))
      .leftJoin(categories, eq(products.categoryId, categories.id));

    if (!data) {
      return c.json({ error: "No products found" }, 404);
    }

    return c.json({ data });
  })
  .get("/cats", async (c) => {
    const data = await db
      .select({
        product: products,
        pet: pets,
        category: categories,
      })
      .from(products)
      .where(eq(products.petId, "9a057d59-847c-4e4d-9a4a-5c01169604b4"))
      .leftJoin(pets, eq(products.petId, pets.id))
      .leftJoin(categories, eq(products.categoryId, categories.id));

    if (!data) {
      return c.json({ error: "No products found" }, 404);
    }

    return c.json({ data });
  })
  .get("/cats/food", async (c) => {
    const data = await db
      .select({
        product: products,
        pet: pets,
        category: categories,
      })
      .from(products)
      .where(
        and(
          eq(products.petId, "9a057d59-847c-4e4d-9a4a-5c01169604b4"),
          eq(products.categoryId, "ee98b764-917d-4dbf-a1cc-2628fa05c433")
        )
      )
      .leftJoin(pets, eq(products.petId, pets.id))
      .leftJoin(categories, eq(products.categoryId, categories.id));

    if (!data) {
      return c.json({ error: "No products found" }, 404);
    }

    return c.json({ data });
  })
  .get("/cats/toys", async (c) => {
    const data = await db
      .select({
        product: products,
        pet: pets,
        category: categories,
      })
      .from(products)
      .where(
        and(
          eq(products.petId, "9a057d59-847c-4e4d-9a4a-5c01169604b4"),
          eq(products.categoryId, "f0ff8413-fd44-4d34-bda2-ce9bb9237585")
        )
      )
      .leftJoin(pets, eq(products.petId, pets.id))
      .leftJoin(categories, eq(products.categoryId, categories.id));

    if (!data) {
      return c.json({ error: "No products found" }, 404);
    }

    return c.json({ data });
  })
  .get("/cats/care", async (c) => {
    const data = await db
      .select({
        product: products,
        pet: pets,
        category: categories,
      })
      .from(products)
      .where(
        and(
          eq(products.petId, "9a057d59-847c-4e4d-9a4a-5c01169604b4"),
          eq(products.categoryId, "ee3401f6-e7f7-419f-a59d-3d671ea082aa")
        )
      )
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
  .get(
    "/only-product/:id",
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
        .where(eq(products.id, id));

      if (!data) {
        return c.json({ error: "No product found" }, 404);
      }

      return c.json({ data });
    }
  )
  .get(
    "/slug/:slug",
    zValidator(
      "param",
      z.object({
        slug: z.string(),
      })
    ),
    async (c) => {
      const { slug } = c.req.valid("param");

      const [data] = await db
        .select({
          product: products,
          pet: pets,
          category: categories,
        })
        .from(products)
        .where(eq(products.slug, slug))
        .leftJoin(pets, eq(products.petId, pets.id))
        .leftJoin(categories, eq(products.categoryId, categories.id));

      if (!data) {
        return c.json({ error: "Product not found" }, 404);
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
