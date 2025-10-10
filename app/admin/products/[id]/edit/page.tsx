"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

interface Product {
  id: string;
  sku: string;
  title: string;
  description: string;
  price: string | number;
  originalPrice?: string | number;
  category: string;
  image?: string;
  images?: string;
  isActive: boolean;
  isFeatured: boolean;
  stockQuantity?: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  weight?: string;
  dimensions?: any;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/products/${params.id}`);
      
      if (response.ok) {
        const productData = await response.json();
        setProduct(productData);
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">{error}</div>
          <button
            onClick={() => router.push('/admin/products')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Product not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update product information for {product.title}
        </p>
      </div>

      <ProductForm 
        initialData={product}
        isEdit={true}
        productId={product.id}
      />
    </div>
  );
}