"use client";

import type { FC } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";
import Logo from "./Logo";
import SearchAutocomplete from "./SearchAutocomplete";
import CartIcon from "./CartIcon";
import { useSession } from "@/lib/auth-client";

const SearchIcon: FC<{ className?: string }> = ({ className = "h-5 w-5 text-gray-700" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const MenuIcon: FC<{ className?: string }> = ({ className = "h-6 w-6 text-white" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon: FC<{ className?: string }> = ({ className = "h-6 w-6 text-white" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

type NavLink = { name: string; href: string; isSpecial?: boolean };

const navLinks: NavLink[] = [
  { name: "Screws", href: "/search?category=Screws" },
  { name: "Fasteners & Fixings", href: "/search?category=Fasteners+%26+Fixings" },
  { name: "Nails", href: "/search?category=Nails" },
  { name: "Adhesives & Building Chemicals", href: "/search?category=Adhesives+%26+Building+Chemicals" },
  { name: "Powertool Accessories", href: "/search?category=Powertool+Accessories" },
  { name: "Hand Tools", href: "/search?category=Hand+Tools" },
  { name: "Painting & Decorating", href: "/search?category=Painting+%26+Decorating" },
  { name: "Building Hardware & Supplies", href: "/search?category=Building+Hardware+%26+Supplies" },
  { name: "Security & Ironmongery", href: "/search?category=Security+%26+Ironmongery" },
  { name: "Workwear, PPE & Safety", href: "/search?category=Workwear%2C+PPE+%26+Safety" },
  { name: "New Products", href: "/search", isSpecial: true },
];

const Navbar: FC = () => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const showCategoryNav = pathname === "/" || pathname.startsWith("/search");
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const crumbs = (() => {
    if (!pathname || pathname === "/") return [] as { label: string; href: string }[];
    const segs = pathname.split("/").filter(Boolean);
    let acc = "";
    return segs.map((s) => {
      acc += `/${s}`;
      const cleaned = decodeURIComponent(s).replace(/^\d+-/, "");
      const label = cleaned.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
      return { label, href: acc };
    });
  })();

  return (
    <header className="w-full font-sans">
      <div className="header-top bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 pt-[20px] pb-[10px] shadow-lg">
        <div className="header-container mx-auto max-w-screen-xl px-4 sm:px-6">
          <div className="flex items-center justify-between md:hidden">
            <Logo />
            <div className="flex items-center gap-4">
              <button type="button" aria-label="Search" className="p-1" onClick={() => setMobileSearchOpen((v) => !v)}>
                <SearchIcon className="h-5 w-5 text-white" />
              </button>
              <button type="button" aria-label="Open menu" className="p-1" onClick={() => setMenuOpen(true)}>
                <MenuIcon />
              </button>
            </div>
          </div>

          {mobileSearchOpen && (
            <div className="mt-3 md:hidden">
              <SearchAutocomplete isMobile onClose={() => setMobileSearchOpen(false)} />
            </div>
          )}

          <div className="grid-row hidden items-center gap-6 py-3 md:grid md:grid-cols-12">
            <div className="grid-col-logo flex items-center md:col-span-3 min-w-0">
              <div className="header-logo shrink-0">
                <Logo />
              </div>
            </div>

            <div className="grid-col-search md:col-span-6 min-w-0">
              <div className="header-cart-search-wrapper">
                <div className="search-box store-search-box">
                  <SearchAutocomplete />
                </div>
              </div>
            </div>

            <div className="hidden items-center justify-end gap-2 text-white md:col-span-3 md:flex">
              <CartIcon />
              {!isLoggedIn && (
                <Link 
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold hover:text-orange-300 transition-colors whitespace-nowrap"
                >
                  Register
                </Link>
              )}
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      {showCategoryNav && (
        <nav className="hidden bg-slate-800 lg:block shadow-md">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
            <div className="flex items-stretch justify-start">
            <ul className="flex items-stretch">
              {navLinks.map((link) => (
                <li key={link.name} className="flex">
                  <a href={link.href} className={`flex items-center px-4 text-center text-sm font-medium transition-colors ${link.isSpecial ? "bg-gradient-to-r from-orange-500 to-orange-600 py-4 text-white hover:from-orange-600 hover:to-orange-700" : "py-3 text-slate-200 hover:bg-slate-700 hover:text-white"}`}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            </div>
          </div>
        </nav>
      )}

      {crumbs.length > 0 && (
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 py-2.5">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm">
              <Link href="/" className="text-slate-600 hover:text-blue-600 transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </Link>
              {crumbs.map((c, idx) => (
                <span key={c.href} className="flex items-center gap-1">
                  <svg className="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  {idx === crumbs.length - 1 ? (
                    <span aria-current="page" className="font-semibold text-blue-700">{c.label}</span>
                  ) : (
                    <Link href={c.href} className="text-slate-600 hover:text-blue-600 transition-colors">{c.label}</Link>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-white shadow-md">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <span className="hidden sm:inline">🎉 Special Offer: Free Shipping on Orders Over £500</span>
              <span className="sm:hidden">🎉 Free Shipping £500+</span>
            </div>
            <a href="#" className="text-sm font-bold underline hover:text-orange-100 transition-colors whitespace-nowrap">
              Shop Now →
            </a>
          </div>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={navLinks} loggedIn={isLoggedIn} />
    </header>
  );
};

export default Navbar;

function MobileMenu({ open, onClose, links, loggedIn }: { open: boolean; onClose: () => void; links: NavLink[]; loggedIn: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-4">
          <div className="flex flex-1 items-center gap-2">
            <Logo className="scale-90" />
          </div>
          <button type="button" aria-label="Close menu" onClick={onClose} className="p-1">
            <CloseIcon />
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 flex items-center justify-between text-white">
          <span className="text-sm font-semibold">🎉 Free Shipping £500+</span>
          {!loggedIn && (
            <Link 
              href="/register" 
              onClick={onClose}
              className="text-xs font-bold bg-white text-orange-600 px-3 py-1.5 rounded-full hover:bg-orange-50 transition-colors"
            >
              Register
            </Link>
          )}
        </div>
        <div className="py-2">
          <div className="px-4 py-2 text-xs font-semibold text-[#4A5762]">Product Categories</div>
          <ul className="divide-y divide-gray-200">
            {links.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="flex items-center justify-between px-4 py-3 text-sm text-[#333f48]">
                  <span>{link.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" className="h-4 w-4 text-[#333f48]"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
