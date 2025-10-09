import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { product, order, user } from "@/lib/db/schema";
import { count, eq, sql } from "drizzle-orm";
import AdminStats from "@/components/admin/AdminStats";
import RecentOrders from "@/components/admin/RecentOrders";
import TopProducts from "@/components/admin/TopProducts";

export default async function AdminDashboard() {
  const session = await requireAdmin();

  // Get dashboard statistics
  const [
    totalProducts,
    activeProducts,
    totalOrders,
    totalUsers,
    recentOrders,
    topProducts,
  ] = await Promise.all([
    // Total products
    db.select({ count: count() }).from(product),
    
    // Active products
    db.select({ count: count() }).from(product).where(eq(product.isActive, true)),
    
    // Total orders
    db.select({ count: count() }).from(order),
    
    // Total users
    db.select({ count: count() }).from(user),
    
    // Recent orders (last 10)
    db.select({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      user: {
        name: user.name,
        email: user.email,
      },
    })
    .from(order)
    .leftJoin(user, eq(order.userId, user.id))
    .orderBy(sql`${order.createdAt} DESC`)
    .limit(10),
    
    // Top products by order count
    db.select({
      sku: product.sku,
      title: product.title,
      orderCount: sql<number>`COUNT(${order.id})`,
    })
    .from(product)
    .leftJoin(order, sql`JSON_EXTRACT(${order.id}, '$.items') LIKE CONCAT('%', ${product.sku}, '%')`)
    .groupBy(product.id, product.sku, product.title)
    .orderBy(sql`COUNT(${order.id}) DESC`)
    .limit(5),
  ]);

  const stats = {
    totalProducts: totalProducts[0]?.count || 0,
    activeProducts: activeProducts[0]?.count || 0,
    totalOrders: totalOrders[0]?.count || 0,
    totalUsers: totalUsers[0]?.count || 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {session.user.name}! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      <AdminStats stats={stats} />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentOrders orders={recentOrders} />
        <TopProducts products={topProducts} />
      </div>
    </div>
  );
}
