"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "@/lib/auth-client";

export type CartItem = {
  id: string;
  productSku: string;
  productName: string;
  productImage?: string;
  productSize?: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  cartCount: number;
  isLoading: boolean;
  addToCart: (item: Omit<CartItem, "id">) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = async () => {
    if (!session?.user) {
      setCart([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        setCart(data.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [session?.user]);

  const addToCart = async (item: Omit<CartItem, "id">) => {
    if (!session?.user) {
      alert("Please sign in to add items to cart");
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCart((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(id);
      return;
    }

    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        setCart((prev) =>
          prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
      });

      if (response.ok) {
        setCart([]);
      }
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const refreshCart = () => fetchCart();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

