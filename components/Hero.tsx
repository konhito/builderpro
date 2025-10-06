import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-2 text-sm font-medium text-blue-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Over 80,000 Products in Stock
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Professional Building Supplies & Hardware
            </h1>

            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Quality products for tradespeople and DIY enthusiasts. Fast delivery, competitive prices, and expert support you can trust.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all"
              >
                Browse Products
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all"
              >
                Create Account
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold text-orange-400">80K+</div>
                <div className="text-sm text-slate-400">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400">24hr</div>
                <div className="text-sm text-slate-400">Delivery</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400">50K+</div>
                <div className="text-sm text-slate-400">Customers</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image Grid */}
          <div className="relative lg:h-[600px] hidden lg:block">
            <div className="absolute inset-0 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 h-64 flex items-center justify-center shadow-2xl">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🔧</div>
                    <div className="font-semibold">Hand Tools</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-8 h-80 flex items-center justify-center shadow-2xl">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🔩</div>
                    <div className="font-semibold">Fixings</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-8 h-80 flex items-center justify-center shadow-2xl">
                  <div className="text-center">
                    <div className="text-6xl mb-2">⚙️</div>
                    <div className="font-semibold">Power Tools</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 h-64 flex items-center justify-center shadow-2xl">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🦺</div>
                    <div className="font-semibold">Safety Gear</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-auto" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}

