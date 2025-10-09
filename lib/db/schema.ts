import { pgTable, text, timestamp, boolean, integer, numeric } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// Users table
export const user = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("user"), // user, admin, super_admin
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Sessions table
export const session = pgTable("session", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

// Accounts table (for OAuth)
export const account = pgTable("account", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Verification tokens table
export const verification = pgTable("verification", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Cart table
export const cart = pgTable("cart", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  productSku: text("productSku").notNull(),
  productName: text("productName").notNull(),
  productImage: text("productImage"),
  productSize: text("productSize"),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Orders table
export const order = pgTable("order", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  orderNumber: text("orderNumber").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, cancelled
  totalAmount: numeric("totalAmount", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: text("shippingAddress").notNull(),
  shippingCity: text("shippingCity").notNull(),
  shippingPostalCode: text("shippingPostalCode").notNull(),
  shippingCountry: text("shippingCountry").notNull(),
  billingAddress: text("billingAddress"),
  billingCity: text("billingCity"),
  billingPostalCode: text("billingPostalCode"),
  billingCountry: text("billingCountry"),
  phone: text("phone").notNull(),
  notes: text("notes"),
  paymentMethod: text("paymentMethod").notNull(), // card, paypal, bank_transfer
  paymentStatus: text("paymentStatus").notNull().default("pending"), // pending, paid, failed
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Order items table
export const orderItem = pgTable("orderItem", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  orderId: text("orderId")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  productSku: text("productSku").notNull(),
  productName: text("productName").notNull(),
  productImage: text("productImage"),
  productSize: text("productSize"),
  quantity: integer("quantity").notNull(),
  priceAtTime: numeric("priceAtTime", { precision: 10, scale: 2 }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// Products table for admin management
export const product = pgTable("product", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  sku: text("sku").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }),
  originalPrice: numeric("originalPrice", { precision: 10, scale: 2 }),
  size: text("size"),
  quantity: text("quantity"),
  category: text("category"),
  image: text("image"),
  images: text("images"), // JSON array of image URLs
  specifications: text("specifications"), // JSON object
  availability: text("availability").default("in_stock"),
  isActive: boolean("isActive").notNull().default(true),
  isFeatured: boolean("isFeatured").notNull().default(false),
  stockQuantity: integer("stockQuantity").default(0),
  minOrderQuantity: integer("minOrderQuantity").default(1),
  maxOrderQuantity: integer("maxOrderQuantity"),
  weight: numeric("weight", { precision: 8, scale: 3 }),
  dimensions: text("dimensions"), // JSON object {length, width, height}
  tags: text("tags"), // JSON array of tags
  seoTitle: text("seoTitle"),
  seoDescription: text("seoDescription"),
  metaKeywords: text("metaKeywords"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Types
export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Verification = typeof verification.$inferSelect;
export type Cart = typeof cart.$inferSelect;
export type Order = typeof order.$inferSelect;
export type OrderItem = typeof orderItem.$inferSelect;
export type Product = typeof product.$inferSelect;


