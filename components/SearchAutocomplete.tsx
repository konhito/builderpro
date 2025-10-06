"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import productsData from "@/assets/products.json";

type Product = {
  id: string;
  sku: string;
  title: string;
  size?: string;
  image?: string;
};

const POPULAR_SEARCHES = [
  "Screws",
  "Nails",
  "Drill Bits",
  "Adhesive",
  "Fasteners",
  "Bolts",
  "Washers",
  "Anchors",
  "Paint",
  "Safety Gloves",
];

export default function SearchAutocomplete({ 
  isMobile = false,
  onClose 
}: { 
  isMobile?: boolean;
  onClose?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const products = productsData as Product[];
    const searchLower = query.toLowerCase();
    
    // Search in title and SKU
    const matches = products.filter((p) => 
      p.title.toLowerCase().includes(searchLower) || 
      p.sku.toLowerCase().includes(searchLower)
    );

    // Limit to 8 suggestions
    setSuggestions(matches.slice(0, 8));
    setShowSuggestions(true);
    setSelectedIndex(-1);
  }, [query]);

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
      setQuery("");
      onClose?.();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (product: Product) => {
    router.push(`/product/${product.sku}`);
    setShowSuggestions(false);
    setQuery("");
    onClose?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else {
        handleSearch(query);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-stretch">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search by product name or SKU..."
            className={`z-[1] h-[40px] flex-1 rounded-bl-[3px] rounded-tl-[3px] border-0 bg-white px-4 text-[14px] text-[#333] placeholder:text-[#4A5762] placeholder:font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isMobile ? "min-w-0" : ""
            }`}
          />
          <button
            type="submit"
            className="button-1 search-box-button -ml-[5px] inline-flex h-[40px] w-10 items-center justify-center rounded-tr-[3px] border-0 bg-white text-gray-700 hover:text-blue-600 transition-colors"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </div>

        {!isMobile && (
          <span aria-hidden className="pointer-events-none absolute bottom-0 right-[0.5px] h-0 w-0 border-b-[5px] border-l-[5px] border-r-[5px] border-t-[5px] border-b-blue-600 border-l-white border-r-blue-600 border-t-white" />
        )}
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[400px] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
          {suggestions.length > 0 ? (
            <div>
              <div className="border-b border-gray-100 bg-slate-50 px-4 py-2">
                <p className="text-xs font-semibold text-slate-600">
                  Products ({suggestions.length})
                </p>
              </div>
              <ul>
                {suggestions.map((product, index) => (
                  <li key={product.id}>
                    <button
                      onClick={() => handleSuggestionClick(product)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                        selectedIndex === index
                          ? "bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {product.image && (
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded border border-gray-200 bg-white">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="h-full w-full object-contain p-1"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {product.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                            {product.sku}
                          </span>
                          {product.size && (
                            <span className="text-xs text-gray-500">
                              {product.size}
                            </span>
                          )}
                        </div>
                      </div>
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
              {suggestions.length === 8 && (
                <div className="border-t border-gray-100 bg-slate-50 px-4 py-2 text-center">
                  <button
                    onClick={() => handleSearch(query)}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View all results for &ldquo;{query}&rdquo;
                  </button>
                </div>
              )}
            </div>
          ) : query.length >= 2 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-500">No products found</p>
              <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
            </div>
          ) : (
            <div>
              <div className="border-b border-gray-100 bg-slate-50 px-4 py-2">
                <p className="text-xs font-semibold text-slate-600">
                  Popular Searches
                </p>
              </div>
              <ul className="py-2">
                {POPULAR_SEARCHES.map((term) => (
                  <li key={term}>
                    <button
                      onClick={() => handleSearch(term)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


