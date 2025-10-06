"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function UserMenu() {
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getAvatarSrc = (raw?: string | null) => {
    if (!raw) return undefined;
    try {
      const url = new URL(raw);
      const host = url.hostname;
      if (host.endsWith("googleusercontent.com")) {
        // Ensure a crisp square crop from Google avatar CDN
        // If size param not present, append s128-c for 128px square crop
        const hasSizeParam = /[?&]sz=\d+/.test(url.search) || /([?&]|=)s\d+(-c)?/.test(raw);
        if (!hasSizeParam) {
          // Preserve existing query/hash while appending size param
          if (url.search) {
            url.search += `&sz=128`;
          } else {
            url.search = `?sz=128`;
          }
        }
      }
      return url.toString();
    } catch {
      return raw;
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  if (isPending) {
    return (
      <div className="h-8 w-8 bg-neutral-300 rounded-full animate-pulse" />
    );
  }

  if (!session?.user) {
    return (
      <button
        className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-[13px] font-semibold text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-md transition-all"
        onClick={() => (window.location.href = "/login")}
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
      >
        {session.user.image ? (
          <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white relative">
            <Image
              src={getAvatarSrc(session.user.image) || session.user.image}
              alt={session.user.name || "User"}
              fill
              sizes="32px"
              className="object-cover"
              referrerPolicy="no-referrer"
              priority
            />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold text-sm border-2 border-white shadow-sm">
            {session.user.name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
        <span className="hidden md:inline text-white text-sm font-semibold">
          {session.user.name}
        </span>
        <svg
          className={`h-4 w-4 text-white transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-neutral-200 py-1 z-50">
          <div className="px-4 py-3 border-b border-neutral-200">
            <p className="text-sm font-semibold text-neutral-900">
              {session.user.name}
            </p>
            <p className="text-xs text-neutral-500 truncate">
              {session.user.email}
            </p>
          </div>
          
          <button
            onClick={() => {
              setIsOpen(false);
              window.location.href = "/profile";
            }}
            className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            My Profile
          </button>
          
          <button
            onClick={() => {
              setIsOpen(false);
              window.location.href = "/orders";
            }}
            className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            My Orders
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              window.location.href = "/settings";
            }}
            className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>

          <div className="border-t border-neutral-200 my-1" />

          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

