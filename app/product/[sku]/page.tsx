import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import productsData from "@/assets/products.json";
import AddToCartButton from "@/components/AddToCartButton";

type Product = {
  id: string;
  sku: string;
  title: string;
  size?: string;
  quantity?: string;
  image?: string;
  url?: string;
  variants?: string;
};

type EnrichedProduct = Product & {
  description?: string;
  price?: string;
  originalPrice?: string;
  images?: string[];
  specifications?: Record<string, string>;
  availability?: string;
  category?: string;
  breadcrumbs?: string[];
  relatedProducts?: Array<{
    sku: string;
    title: string;
    image?: string;
    url: string;
  }>;
};

async function getProductData(sku: string): Promise<EnrichedProduct | null> {
  try {
    // Try to fetch from our API (which does the scraping)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/product/${sku}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (response.ok) {
      return await response.json();
    }

    // Fallback to basic product data
    const products = productsData as Product[];
    const product = products.find(
      (p) => p.sku.toLowerCase() === sku.toLowerCase()
    );

    return product || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    
    // Fallback to basic product data
    const products = productsData as Product[];
    const product = products.find(
      (p) => p.sku.toLowerCase() === sku.toLowerCase()
    );

    return product || null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  const product = await getProductData(sku);

  if (!product) {
    notFound();
  }

  const displayImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
    ? [product.image] 
    : [];

  return (
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 py-10">
      {/* Breadcrumbs */}
      {product.breadcrumbs && product.breadcrumbs.length > 0 && (
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <Link href="/" className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </Link>
          {product.breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-2">
              <svg className="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-600">{crumb}</span>
            </span>
          ))}
          <svg className="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold text-slate-800">{product.sku}</span>
        </nav>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full bg-neutral-50 rounded-lg overflow-hidden border">
            {displayImages.length > 0 ? (
              <Image
                src={displayImages[0]}
                alt={product.title}
                fill
                className="object-contain p-8"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-400">
                No image available
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {displayImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {displayImages.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square w-full bg-neutral-50 rounded border cursor-pointer hover:border-[#DA291C] transition-colors"
                >
                  <Image
                    src={img}
                    alt={`${product.title} - view ${idx + 2}`}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 1024px) 25vw, 12vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-blue-200">
                SKU: {product.sku}
              </span>
              {product.availability && (
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-green-200">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  In Stock
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              {product.title}
            </h1>
            {product.size && (
              <p className="text-xl text-neutral-600">Size: {product.size}</p>
            )}
          </div>

          {product.price && (
            <div>
              {product.originalPrice && product.originalPrice !== product.price ? (
                <>
                  {Number(product.originalPrice) > Number(product.price) ? (
                    <>
                      <div className="text-lg text-gray-500 line-through">
                        £{Number(product.originalPrice).toFixed(2)}
                      </div>
                      <div className="text-3xl font-bold text-blue-700">
                        £{Number(product.price).toFixed(2)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-lg text-gray-500 line-through">
                        £{Number(product.price).toFixed(2)}
                      </div>
                      <div className="text-3xl font-bold text-blue-700">
                        £{Number(product.originalPrice).toFixed(2)}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-3xl font-bold text-blue-700">
                  £{Number(product.price).toFixed(2)}
                </div>
              )}
            </div>
          )}

          {product.availability && (
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-md">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {product.availability}
            </div>
          )}

          {product.quantity && (
            <div className="border-t border-b border-neutral-200 py-4">
              <p className="text-neutral-700">
                <span className="font-semibold">Pack Quantity:</span> {product.quantity}
              </p>
            </div>
          )}

          {product.description && (
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-neutral-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <AddToCartButton
              productSku={product.sku}
              productName={product.title}
              productImage={product.images?.[0]}
              productSize={product.size}
            />
          </div>

          {product.variants && (
            <div className="bg-blue-50 text-blue-900 px-4 py-3 rounded-md">
              <p className="font-medium">{product.variants}</p>
            </div>
          )}
        </div>
      </div>

      {/* Specifications */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Specifications</h2>
          <div className="bg-neutral-50 rounded-lg overflow-hidden border">
            <table className="w-full">
              <tbody>
                {Object.entries(product.specifications).map(([key, value], idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}
                  >
                    <td className="px-6 py-4 font-semibold text-neutral-700 w-1/3">
                      {key}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {product.relatedProducts.map((related) => (
              <Link
                key={related.sku}
                href={`/product/${related.sku}`}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {related.image && (
                  <div className="relative aspect-square mb-3 bg-neutral-50">
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                )}
                <p className="text-xs text-neutral-500 mb-1">{related.sku}</p>
                <p className="text-sm font-medium text-neutral-900 line-clamp-2">
                  {related.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  const product = await getProductData(sku);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.title} - ${product.sku} | TIMCO`,
    description: product.description || `${product.title} - Size: ${product.size || 'N/A'}`,
  };
}

