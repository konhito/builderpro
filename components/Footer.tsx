"use client";

import Link from "next/link";

function UpIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden
    >
      <path d="M6 14l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Footer() {
  const scrollTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {}
  };

  const footerLinks = {
    products: [
      { label: "Screws", href: "/search?category=Screws" },
      { label: "Fasteners & Fixings", href: "/search?category=Fasteners%20%26%20Fixings" },
      { label: "Power Tools", href: "/search?category=Powertool%20Accessories" },
      { label: "Hand Tools", href: "/search?category=Hand%20Tools" },
      { label: "Workwear & PPE", href: "/search?category=Workwear%2C%20PPE%20%26%20Safety" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/about" },
      { label: "Sustainability", href: "/about" },
      { label: "Careers", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    support: [
      { label: "Help Center", href: "/help" },
      { label: "FAQs", href: "/faqs" },
      { label: "Returns", href: "/help" },
      { label: "Shipping Info", href: "/help" },
      { label: "Track Order", href: "/orders" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/privacy" },
      { label: "Accessibility", href: "/help" },
    ],
  };

  return (
    <footer className="w-full bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">BuildPro</span>
                <span className="text-xs text-blue-400">Professional Supplies</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-6 max-w-md">
              Your trusted partner for professional building supplies and hardware solutions. Quality products, competitive prices, expert service.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@buildpro.com" className="hover:text-white transition-colors">info@buildpro.com</a>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+441234567890" className="hover:text-white transition-colors">+44 (0) 1234 567890</a>
              </div>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Products</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-white font-semibold mb-2">Subscribe to our newsletter</h3>
            <p className="text-sm text-slate-400 mb-4">Get the latest product updates, exclusive offers, and industry news.</p>
            <form className="flex gap-2 flex-col sm:flex-row justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 sm:max-w-md px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              © 2025 <span className="text-white font-semibold">BuildPro</span>. All rights reserved.
            </p>
            
            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm text-slate-400">
              {footerLinks.legal.map((link, index) => (
                <Link key={index} href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12.06C22 6.49 17.52 2 11.94 2 6.37 2 1.88 6.49 1.88 12.06c0 4.99 3.65 9.13 8.42 9.95v-7.03H7.97v-2.92h2.33V9.61c0-2.3 1.37-3.57 3.46-3.57.99 0 2.03.18 2.03.18v2.23h-1.14c-1.12 0-1.47.69-1.47 1.39v1.67h2.5l-.4 2.92h-2.1v7.03c4.77-.82 8.42-4.96 8.42-9.95Z" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.34-1.6.57-2.46.68a4.23 4.23 0 0 0 1.85-2.33 8.52 8.52 0 0 1-2.69 1.03 4.24 4.24 0 0 0-7.35 2.9c0 .33.04.65.1.96a12.03 12.03 0 0 1-8.73-4.43 4.23 4.23 0 0 0 1.31 5.66 4.2 4.2 0 0 1-1.92-.53v.05a4.24 4.24 0 0 0 3.4 4.16c-.46.13-.95.2-1.45.2-.35 0-.7-.03-1.03-.1a4.25 4.25 0 0 0 3.96 2.95A8.5 8.5 0 0 1 2 19.54c-.33 0-.66-.02-.98-.06A12.02 12.02 0 0 0 7.5 21c7.19 0 11.12-5.95 11.12-11.12v-.51A7.9 7.9 0 0 0 22.46 6Z" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.45 20.45h-3.56v-5.6c0-1.34-.02-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.86 3.38-1.86 3.61 0 4.28 2.38 4.28 5.47v6.28ZM5.34 7.45a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm-1.78 13h3.56V9H3.56v11.45Z" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.2c3.18 0 3.56.01 4.82.07 1.2.06 1.86.26 2.3.43.58.23 1 .5 1.44.94.44.44.71.86.94 1.44.17.44.37 1.1.43 2.3.06 1.26.07 1.64.07 4.82s-.01 3.56-.07 4.82c-.06 1.2-.26 1.86-.43 2.3a3.83 3.83 0 0 1-.94 1.44 3.83 3.83 0 0 1-1.44.94c-.44.17-1.1.37-2.3.43-1.26.06-1.64.07-4.82.07s-3.56-.01-4.82-.07c-1.2-.06-1.86-.26-2.3-.43a3.83 3.83 0 0 1-1.44-.94 3.83 3.83 0 0 1-.94-1.44c-.17-.44-.37-1.1-.43-2.3C2.21 15.56 2.2 15.18 2.2 12s.01-3.56.07-4.82c.06-1.2.26-1.86.43-2.3.23-.58.5-1 .94-1.44.44-.44.86-.71 1.44-.94.44-.17 1.1-.37 2.3-.43C8.44 2.21 8.82 2.2 12 2.2Zm0 1.8c-3.14 0-3.51.01-4.75.07-.98.05-1.51.21-1.86.35-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.14.35-.3.88-.35 1.86-.06 1.24-.07 1.61-.07 4.75s.01 3.51.07 4.75c.05.98.21 1.51.35 1.86.18.47.4.8.75 1.15.35.35.68.57 1.15.75.35.14.88.3 1.86.35 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c.98-.05 1.51-.21 1.86-.35.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.14-.35.3-.88.35-1.86.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.05-.98-.21-1.51-.35-1.86a3.03 3.03 0 0 0-.75-1.15 3.03 3.03 0 0 0-1.15-.75c-.35-.14-.88-.3-1.86-.35-1.24-.06-1.61-.07-4.75-.07Zm0 3.15a4.85 4.85 0 1 1 0 9.7 4.85 4.85 0 0 1 0-9.7Zm0 1.8a3.05 3.05 0 1 0 0 6.1 3.05 3.05 0 0 0 0-6.1Zm5.34-2.1a1.13 1.13 0 1 1 0 2.26 1.13 1.13 0 0 1 0-2.26Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        type="button"
        aria-label="Back to top"
        onClick={scrollTop}
        className="fixed bottom-8 right-8 z-40 grid h-12 w-12 place-items-center bg-gradient-to-br from-orange-500 to-orange-600 rounded-full text-white shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all hover:scale-110 hover:shadow-2xl"
      >
        <UpIcon className="h-5 w-5" />
      </button>
    </footer>
  );
}
