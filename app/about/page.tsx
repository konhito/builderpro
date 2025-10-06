export default function AboutPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">About BuildPro</h1>
      
      <div className="prose prose-slate max-w-none">
        <div className="bg-white rounded-lg border border-slate-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Story</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            BuildPro has been a trusted name in professional building supplies and hardware for years. We understand the needs of tradespeople, contractors, and DIY enthusiasts who demand quality, reliability, and competitive pricing.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Our mission is simple: provide professional-grade products with exceptional service. From screws and fixings to power tools and safety equipment, we stock over 80,000 products to meet every building and construction need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <div className="text-4xl mb-4">🏗️</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Quality Products</h3>
            <p className="text-slate-700">Industry-standard products from trusted manufacturers</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Fast Delivery</h3>
            <p className="text-slate-700">Next-day delivery available on most items</p>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-100">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Expert Support</h3>
            <p className="text-slate-700">Professional advice from experienced team members</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Choose Us?</h2>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Over 80,000 products in stock</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Competitive pricing with bulk discounts available</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Trusted by thousands of professional tradespeople</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Easy online ordering with secure checkout</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Dedicated customer support team</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

