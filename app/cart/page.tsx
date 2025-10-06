"use client";

import { useCart } from "@/contexts/CartContext";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, cartCount, isLoading, removeFromCart, updateQuantity } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Shopping Cart</h1>
        <p className="text-slate-600 mb-8">Please sign in to view your cart</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-16">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-200 h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Your Cart is Empty</h1>
          <p className="text-slate-600 mb-8">
            Start adding products to your cart and they will appear here.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">
        Shopping Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-lg p-4 flex gap-4"
            >
              {/* Product Image */}
              <div className="w-24 h-24 flex-shrink-0 bg-slate-50 rounded-lg flex items-center justify-center">
                {item.productImage ? (
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                ) : (
                  <div className="text-4xl">📦</div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <Link
                  href={`/product/${item.productSku}`}
                  className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  {item.productName}
                </Link>
                <p className="text-sm text-slate-600 mt-1">
                  SKU: {item.productSku}
                  {item.productSize && ` | Size: ${item.productSize}`}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border border-slate-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-slate-100 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="px-4 py-1 border-x border-slate-300 min-w-[3rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-slate-100 transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-semibold">Request Quote</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-semibold">Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold text-slate-900 mb-6">
              <span>Total</span>
              <span>Contact for pricing</span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
            >
              Proceed to Checkout
            </button>

            <Link
              href="/search"
              className="block text-center text-blue-600 hover:text-blue-700 font-medium mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

