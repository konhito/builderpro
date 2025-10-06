import Link from "next/link";
import Image from "next/image";

export default function FeaturedProducts() {
  const products = [
    {
      sku: "35012C2",
      name: "C2 Strong-Fix - PZ - Double Countersunk - Sharp Point - Yellow",
      size: "3.5 x 12",
      image: "https://euntimcocdn.blob.core.windows.net/web-product-images/35012C2_w1.jpg",
      badge: "Best Seller",
      category: "Screws",
    },
    {
      sku: "00660ENP",
      name: "Express Nails - Zinc",
      size: "6.0 x 60",
      image: "https://euntimcocdn.blob.core.windows.net/web-product-images/00660ENP_w1.jpg",
      badge: "Popular",
      category: "Nails",
    },
    {
      sku: "5MTAPEM",
      name: "Tape Measure",
      size: "5m/16ft x 25mm",
      image: "https://euntimcocdn.blob.core.windows.net/web-product-images/5MTAPEM_w1.jpg",
      badge: "Essential",
      category: "Hand Tools",
    },
    {
      sku: "770147",
      name: "Standard Safety Goggles",
      size: "Clear",
      image: "https://euntimcocdn.blob.core.windows.net/web-product-images/770147_w1.jpg",
      badge: "Safety First",
      category: "PPE",
    },
  ];

  return (
    <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Featured Products
          </h2>
          <p className="text-slate-600">
            Hand-picked essentials for your projects
          </p>
        </div>
        <Link
          href="/search"
          className="hidden md:inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          View All
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.sku}
            href={`/product/${product.sku}`}
            className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
          >
            <div className="relative bg-white h-48 flex items-center justify-center p-4">
              <Image
                src={product.image}
                alt={product.name}
                width={200}
                height={200}
                className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {product.badge}
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-slate-500 mb-1">SKU: {product.sku}</p>
              <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm text-slate-600 mb-3">{product.size}</p>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                View Product
              </button>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center lg:hidden">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          View All Products
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

