"use client";

import { useState } from "react";

type ScrapedProduct = {
  sku: string;
  title: string;
  size?: string;
  quantity?: string;
  description?: string;
  price?: string;
  images?: string[];
  specifications?: Record<string, string>;
  availability?: string;
  category?: string;
  breadcrumbs?: string[];
  url?: string;
  relatedProducts?: Array<{
    sku: string;
    title: string;
    image?: string;
    url: string;
  }>;
};

export default function TestScraperPage() {
  const [sku, setSku] = useState("35012C2");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ScrapedProduct | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testScraper = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`/api/product/${sku}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Product Scraper Test Tool</h1>
        <p className="text-neutral-600 mb-8">
          Test the on-demand scraping functionality by entering a product SKU
        </p>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Enter SKU (e.g., 35012C2)"
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#DA291C]"
            />
            <button
              onClick={testScraper}
              disabled={loading || !sku}
              className="bg-[#DA291C] text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Scraping..." : "Test Scraper"}
            </button>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            <span className="text-sm text-neutral-600">Try these SKUs:</span>
            {["35012C2", "35016C2", "35020C2", "35025C2"].map((testSku) => (
              <button
                key={testSku}
                onClick={() => setSku(testSku)}
                className="text-sm px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded"
              >
                {testSku}
              </button>
            ))}
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#DA291C] border-r-transparent"></div>
              <p className="mt-4 text-neutral-600">Scraping product data from TIMCO...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {data && !loading && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
                ✅ Successfully scraped product data!
              </div>

              <div className="grid gap-4">
                <InfoCard title="Basic Info">
                  <InfoRow label="SKU" value={data.sku} />
                  <InfoRow label="Title" value={data.title} />
                  <InfoRow label="Size" value={data.size} />
                  <InfoRow label="Quantity" value={data.quantity} />
                  <InfoRow label="Price" value={data.price} />
                  <InfoRow label="Availability" value={data.availability} />
                  <InfoRow label="Category" value={data.category} />
                </InfoCard>

                {data.description && (
                  <InfoCard title="Description">
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      {data.description}
                    </p>
                  </InfoCard>
                )}

                {data.images && data.images.length > 0 && (
                  <InfoCard title={`Images (${data.images.length})`}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {data.images.slice(0, 8).map((img: string, idx: number) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Product ${idx + 1}`}
                          className="w-full aspect-square object-contain border rounded bg-neutral-50"
                        />
                      ))}
                    </div>
                  </InfoCard>
                )}

                {data.specifications && Object.keys(data.specifications).length > 0 && (
                  <InfoCard title="Specifications">
                    <div className="space-y-2">
                      {Object.entries(data.specifications).map(([key, value]) => (
                        <InfoRow key={key} label={key} value={value as string} />
                      ))}
                    </div>
                  </InfoCard>
                )}

                {data.breadcrumbs && data.breadcrumbs.length > 0 && (
                  <InfoCard title="Breadcrumbs">
                    <p className="text-sm text-neutral-700">
                      {data.breadcrumbs.join(" > ")}
                    </p>
                  </InfoCard>
                )}

                {data.relatedProducts && data.relatedProducts.length > 0 && (
                  <InfoCard title={`Related Products (${data.relatedProducts.length})`}>
                    <div className="space-y-2">
                      {data.relatedProducts.map((related, idx) => (
                        <div key={idx} className="text-sm border-l-2 border-neutral-200 pl-3">
                          <span className="font-medium">{related.sku}</span> - {related.title}
                        </div>
                      ))}
                    </div>
                  </InfoCard>
                )}

                <InfoCard title="Raw JSON Response">
                  <pre className="text-xs bg-neutral-900 text-green-400 p-4 rounded overflow-x-auto">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </InfoCard>
              </div>

              <div className="flex gap-4">
                <a
                  href={`/product/${data.sku}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-md hover:bg-neutral-800"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Product Page
                </a>
                {data.url && (
                  <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-2 border-neutral-900 text-neutral-900 px-4 py-2 rounded-md hover:bg-neutral-900 hover:text-white"
                  >
                    View on TIMCO
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-3">How It Works</h2>
          <ol className="space-y-2 text-sm text-neutral-700">
            <li>1. Enter a product SKU or click a sample SKU</li>
            <li>2. Click &ldquo;Test Scraper&rdquo; to fetch data from the API</li>
            <li>3. The API scrapes the TIMCO website in real-time</li>
            <li>4. Extracted data is displayed below</li>
            <li>5. Results are cached for 1 hour for performance</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold text-neutral-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-4 py-1 text-sm">
      <span className="font-medium text-neutral-700 min-w-[120px]">{label}:</span>
      <span className="text-neutral-600">{value}</span>
    </div>
  );
}


