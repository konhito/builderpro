"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";

export default function CheckoutPage() {
  const { cart, cartCount, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const { success, error: showError, ToastContainer } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    shippingAddress: "",
    shippingCity: "",
    shippingPostalCode: "",
    shippingCountry: "United Kingdom",
    phone: "",
    notes: "",
    paymentMethod: "card",
  });

  if (!session?.user) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Checkout</h1>
        <p className="text-slate-600 mb-8">Please sign in to continue with checkout</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Your Cart is Empty</h1>
        <p className="text-slate-600 mb-8">Add some products to your cart before checking out</p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: cart,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await clearCart();
        success("Order placed successfully!");
        setTimeout(() => router.push(`/orders/${data.orderId}`), 1500);
      } else {
        showError("Failed to place order. Please try again.");
      }
    } catch (error) {
      showError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Shipping Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shippingCity}
                      onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="London"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shippingPostalCode}
                      onChange={(e) => setFormData({ ...formData, shippingPostalCode: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="SW1A 1AA"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Country *
                  </label>
                  <select
                    required
                    value={formData.shippingCountry}
                    onChange={(e) => setFormData({ ...formData, shippingCountry: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>United Kingdom</option>
                    <option>Ireland</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+44 1234 567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Any special instructions for your order"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-4 h-4"
                  />
                  <span className="font-medium">Credit / Debit Card</span>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={formData.paymentMethod === "bank_transfer"}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-4 h-4"
                  />
                  <span className="font-medium">Bank Transfer</span>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === "paypal"}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-4 h-4"
                  />
                  <span className="font-medium">PayPal</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>{cartCount} {cartCount === 1 ? "item" : "items"}</span>
                </div>
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-600">{item.productName.substring(0, 30)}...</span>
                    <span className="text-slate-900 font-medium">×{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 text-blue-900 px-4 py-3 rounded-lg mb-6">
                <p className="text-sm font-medium">
                  📞 Our team will contact you with a quote and payment details
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>

              <Link
                href="/cart"
                className="block text-center text-blue-600 hover:text-blue-700 font-medium mt-4"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

