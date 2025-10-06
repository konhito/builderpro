"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

type OrderItem = {
  id: string;
  productSku: string;
  productName: string;
  productImage?: string;
  productSize?: string;
  quantity: number;
};

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  phone: string;
  notes?: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderId, setOrderId] = useState<string>("");

  useEffect(() => {
    params.then((p) => setOrderId(p.id));
  }, [params]);

  useEffect(() => {
    if (session?.user && orderId) {
      fetchOrder();
    }
  }, [session, orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else if (response.status === 404) {
        notFound();
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Order Details</h1>
        <p className="text-slate-600 mb-8">Please sign in to view order details</p>
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
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
          <div className="h-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return notFound();
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status as keyof typeof colors] || "bg-slate-100 text-slate-800 border-slate-200";
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Order {order.orderNumber}
            </h1>
            <p className="text-slate-600">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className={`px-6 py-3 rounded-lg border-2 font-semibold ${getStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Shipping Address</h3>
            <div className="text-slate-600 space-y-1">
              <p>{order.shippingAddress}</p>
              <p>{order.shippingCity}, {order.shippingPostalCode}</p>
              <p>{order.shippingCountry}</p>
              <p className="mt-2">Phone: {order.phone}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Payment Information</h3>
            <div className="text-slate-600 space-y-1">
              <p>Method: <span className="font-medium">{order.paymentMethod === "card" ? "Credit/Debit Card" : order.paymentMethod === "bank_transfer" ? "Bank Transfer" : "PayPal"}</span></p>
              <p>Status: <span className={`px-2 py-1 rounded text-xs font-semibold ${order.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span></p>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">Order Notes</h3>
            <p className="text-slate-600">{order.notes}</p>
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Order Items</h2>
        
        <div className="space-y-4">
          {order.items?.map((item) => (
            <div key={item.id} className="flex gap-4 pb-4 border-b border-slate-200 last:border-0 last:pb-0">
              <div className="w-20 h-20 flex-shrink-0 bg-slate-50 rounded-lg flex items-center justify-center">
                {item.productImage ? (
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                ) : (
                  <div className="text-3xl">📦</div>
                )}
              </div>

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
                <p className="text-sm text-slate-900 font-medium mt-2">
                  Quantity: {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200 bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Our team will contact you with pricing and payment details for this order.
          </p>
        </div>
      </div>
    </div>
  );
}

