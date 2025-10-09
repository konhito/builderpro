import Link from "next/link";

interface Product {
  sku: string;
  title: string;
  orderCount: number;
}

interface TopProductsProps {
  products: Product[];
}

export default function TopProducts({ products }: TopProductsProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products</h3>
        <div className="flow-root">
          <ul role="list" className="-my-5 divide-y divide-gray-200">
            {products.length === 0 ? (
              <li className="py-4">
                <p className="text-sm text-gray-500">No product data available</p>
              </li>
            ) : (
              products.map((product, index) => (
                <li key={product.sku} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        SKU: {product.sku}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {product.orderCount} orders
                      </span>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        {products.length > 0 && (
          <div className="mt-4">
            <Link
              href="/admin/products"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all products →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
