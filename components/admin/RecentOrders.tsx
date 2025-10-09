import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: string;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  } | null;
}

interface RecentOrdersProps {
  orders: Order[];
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
        <div className="flow-root">
          <ul role="list" className="-my-5 divide-y divide-gray-200">
            {orders.length === 0 ? (
              <li className="py-4">
                <p className="text-sm text-gray-500">No recent orders</p>
              </li>
            ) : (
              orders.map((order) => (
                <li key={order.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {order.user?.name || "Unknown Customer"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[order.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        £{order.totalAmount}
                      </span>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        {orders.length > 0 && (
          <div className="mt-4">
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all orders →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
