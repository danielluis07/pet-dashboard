import { z } from "zod";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  numeric,
  primaryKey,
  decimal,
  serial,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import type { AdapterAccountType } from "next-auth/adapters";
import { createInsertSchema } from "drizzle-zod";

export const role = pgEnum("role", ["ADMIN", "USER"]);
export const orderStatusEnum = pgEnum("order_status", [
  "WAITING_FOR_PAYMENT",
  "PAID",
  "SHIPPED",
]);
export const logisticStatusEnum = pgEnum("logistic_status", [
  "WAITING_FOR_PAYMENT",
  "IN_TRANSIT",
  "DELIVERED",
]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").unique(),
  name: text("name"),
  password: varchar("password", { length: 255 }),
  image: text("image"),
  imageName: varchar("imageName", { length: 255 }),
  isTwoFactorEnabled: boolean("is_two_factor_enabled").default(false),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  address: varchar("address", { length: 255 }),
  address2: varchar("address2", { length: 255 }),
  city: varchar("city", { length: 255 }),
  state: varchar("state", { length: 255 }),
  phone: varchar("phone", { length: 255 }),
  postalCode: varchar("postal_code", { length: 255 }),
  role: role("role"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const account = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })]
);

export const session = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationToken = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })]
);

export const authenticator = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (t) => [primaryKey({ columns: [t.userId, t.credentialID] })]
);

export const passwordResetToken = pgTable("password_reset_token", {
  id: varchar("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires").notNull(),
});

export const twoFactorToken = pgTable("two_factor_token", {
  id: varchar("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires").notNull(),
});

export const twoFactorConfirmation = pgTable("two_factor_confirmation", {
  id: varchar("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const review = pgTable("review", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notification = pgTable("notification", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  message: text("message").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  viewed: boolean("viewed").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const pets = pgTable("pets", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
});

export const categories = pgTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
});

export const products = pgTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  petId: text("pet_id")
    .notNull()
    .references(() => pets.id),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  stock: integer("stock").default(0).notNull(),
  slug: text("slug").notNull().unique(),
  isNew: boolean("is_new").default(false),
  isFeatured: boolean("is_featured").default(false),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const shippingMethods = pgTable("shipping_methods", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  estimatedTime: text("estimated_time"),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: text("id")
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  imageUrl: text("image_url"),
});

export const orders = pgTable("orders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  number: serial("number").notNull(),
  totalPrice: integer("total_price").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  status: orderStatusEnum("status").default("WAITING_FOR_PAYMENT"),
  logisticStatus: logisticStatusEnum("logistic_status").default(
    "WAITING_FOR_PAYMENT"
  ),
  isRefunded: boolean("is_refunded").default(false),
  isShipped: boolean("is_shipped").default(false),
  shippingDate: timestamp("shipping_date"),
  shippingMethodId: text("shipping_method_id").references(
    () => shippingMethods.id
  ),
  phone: varchar("phone", { length: 255 }),
  address1: varchar("address1", { length: 255 }),
  address2: varchar("address2", { length: 255 }),
  city: varchar("city", { length: 255 }),
  state: varchar("state", { length: 255 }),
  postalCode: varchar("postal_code", { length: 255 }),
  country: varchar("country", { length: 255 }),
  trackId: text("track_id"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schemas

export const createUserSchema = z.object({
  name: z.string().min(3, "O nome deve conter no mínimo 3 caracteres"),
  email: z.string(),
  password: z.string().min(8, "A senha deve conter no mínimo 8 caracteres"),
});

export const insertUserWithConfirmPasswordSchema = createUserSchema.extend({
  confirm_password: z.string().min(1, "Confirmação de senha é obrigatória"),
});

export const loginUserSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const insertProdcutSchema = createInsertSchema(products);
export const insertCategorySchema = createInsertSchema(categories);
export const insertPetSchema = createInsertSchema(pets);
