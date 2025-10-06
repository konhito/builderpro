"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";

type AddToCartButtonProps = {
  productSku: string;
  productName: string;
  productImage?: string;
  productSize?: string;
  className?: string;
};

export default function AddToCartButton({
  productSku,
  productName,
  productImage,
  productSize,
  className = "",
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const { success, error: showError, ToastContainer } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    setIsAdding(true);
    try {
      await addToCart({
        productSku,
        productName,
        productImage,
        productSize,
        quantity: 1,
      });
      success("Added to cart successfully!");
    } catch (err) {
      showError("Failed to add to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all ${className}`}
      >
        {isAdding ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Adding...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </>
        )}
      </button>
    </>
  );
}

