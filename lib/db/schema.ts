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
  
  // Additional fields from Excel file
  summary: text("summary"),
  brand: text("brand"),
  group: text("group"),
  type: text("type"),
  subType: text("subType"),
  countryOfOrigin: text("countryOfOrigin"),
  ceMarked: text("ceMarked"),
  barcode: text("barcode"),
  commodityCode: text("commodityCode"),
  intrastat: text("intrastat"),
  packQuantity: numeric("packQuantity", { precision: 10, scale: 2 }),
  packQuantityUnit: text("packQuantityUnit"),
  packType: text("packType"),
  sellingUnit: text("sellingUnit"),
  
  // Dimensions
  itemLength: numeric("itemLength", { precision: 10, scale: 2 }),
  itemLengthUnit: text("itemLengthUnit"),
  itemWidth: numeric("itemWidth", { precision: 10, scale: 2 }),
  itemWidthUnit: text("itemWidthUnit"),
  itemHeight: numeric("itemHeight", { precision: 10, scale: 2 }),
  itemHeightUnit: text("itemHeightUnit"),
  
  // Packaging dimensions
  packagingLength: numeric("packagingLength", { precision: 10, scale: 2 }),
  packagingLengthUnit: text("packagingLengthUnit"),
  packagingWidth: numeric("packagingWidth", { precision: 10, scale: 2 }),
  packagingWidthUnit: text("packagingWidthUnit"),
  packagingHeight: numeric("packagingHeight", { precision: 10, scale: 2 }),
  packagingHeightUnit: text("packagingHeightUnit"),
  packageWeight: numeric("packageWeight", { precision: 10, scale: 3 }),
  packageWeightUnit: text("packageWeightUnit"),
  
  // Material composition
  paperWeight: numeric("paperWeight", { precision: 10, scale: 2 }),
  plasticWeight: numeric("plasticWeight", { precision: 10, scale: 2 }),
  plasticRecycledContent: numeric("plasticRecycledContent", { precision: 5, scale: 2 }),
  woodWeight: numeric("woodWeight", { precision: 10, scale: 2 }),
  aluminumWeight: numeric("aluminumWeight", { precision: 10, scale: 2 }),
  steelWeight: numeric("steelWeight", { precision: 10, scale: 2 }),
  glassWeight: numeric("glassWeight", { precision: 10, scale: 2 }),
  otherWeight: numeric("otherWeight", { precision: 10, scale: 2 }),
  
  // Secondary packaging
  secondaryPackaging: text("secondaryPackaging"),
  secondaryPackagingLength: numeric("secondaryPackagingLength", { precision: 10, scale: 2 }),
  secondaryPackagingLengthUnit: text("secondaryPackagingLengthUnit"),
  secondaryPackagingWidth: numeric("secondaryPackagingWidth", { precision: 10, scale: 2 }),
  secondaryPackagingWidthUnit: text("secondaryPackagingWidthUnit"),
  secondaryPackagingHeight: numeric("secondaryPackagingHeight", { precision: 10, scale: 2 }),
  secondaryPackagingHeightUnit: text("secondaryPackagingHeightUnit"),
  secondaryPackagingWeight: numeric("secondaryPackagingWeight", { precision: 10, scale: 3 }),
  secondaryPackagingWeightUnit: text("secondaryPackagingWeightUnit"),
  
  // Outer packaging
  outerPackaging: text("outerPackaging"),
  outerPackagingLength: numeric("outerPackagingLength", { precision: 10, scale: 2 }),
  outerPackagingLengthUnit: text("outerPackagingLengthUnit"),
  outerPackagingWidth: numeric("outerPackagingWidth", { precision: 10, scale: 2 }),
  outerPackagingWidthUnit: text("outerPackagingWidthUnit"),
  outerPackagingHeight: numeric("outerPackagingHeight", { precision: 10, scale: 2 }),
  outerPackagingHeightUnit: text("outerPackagingHeightUnit"),
  outerPackagingWeight: numeric("outerPackagingWeight", { precision: 10, scale: 3 }),
  outerPackagingWeightUnit: text("outerPackagingWeightUnit"),
  
  // Shipping & storage
  unNumber: text("unNumber"),
  unNumberDescription: text("unNumberDescription"),
  ufiNumber: text("ufiNumber"),
  hazardousGoods: text("hazardousGoods"),
  properShippingName: text("properShippingName"),
  containsLiquidContent: boolean("containsLiquidContent"),
  flammable: boolean("flammable"),
  ageVerificationRequired: boolean("ageVerificationRequired"),
  expiryPeriodMonths: numeric("expiryPeriodMonths", { precision: 5, scale: 2 }),
  
  // Technical documents
  dopCeFileName: text("dopCeFileName"),
  dopCeFileLink: text("dopCeFileLink"),
  dopUkcaFileName: text("dopUkcaFileName"),
  dopUkcaFileLink: text("dopUkcaFileLink"),
  docCeFileName: text("docCeFileName"),
  docCeFileLink: text("docCeFileLink"),
  docUkcaFileName: text("docUkcaFileName"),
  docUkcaFileLink: text("docUkcaFileLink"),
  sds1FileName: text("sds1FileName"),
  sds1FileLink: text("sds1FileLink"),
  sds2FileName: text("sds2FileName"),
  sds2FileLink: text("sds2FileLink"),
  tdsFileName: text("tdsFileName"),
  tdsFileLink: text("tdsFileLink"),
  
  // Web structure and SEO
  webStructure: text("webStructure"),
  keywords: text("keywords"),
  
  // Images
  webImage1Name: text("webImage1Name"),
  webImage1Link: text("webImage1Link"),
  webImage2Name: text("webImage2Name"),
  webImage2Link: text("webImage2Link"),
  webImage3Name: text("webImage3Name"),
  webImage3Link: text("webImage3Link"),
  webImage4Name: text("webImage4Name"),
  webImage4Link: text("webImage4Link"),
  webImage5Name: text("webImage5Name"),
  webImage5Link: text("webImage5Link"),
  
  // Brochure
  brochurePageName: text("brochurePageName"),
  brochurePageLink: text("brochurePageLink"),
  
  // Date
  lastUpdated: text("lastUpdated"),
  
  // Features (JSON array)
  features: text("features"),
  
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


