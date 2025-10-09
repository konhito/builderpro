"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HomeIcon, 
  CubeIcon, 
  ShoppingBagIcon, 
  UsersIcon, 
  CogIcon,
  ChartBarIcon,
  PlusIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Products", href: "/admin/products", icon: CubeIcon },
  { name: "Add Product", href: "/admin/products/new", icon: PlusIcon },
  { name: "Import Products", href: "/admin/products/import", icon: PencilSquareIcon },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBagIcon },
  { name: "Customers", href: "/admin/customers", icon: UsersIcon },
  { name: "Analytics", href: "/admin/analytics", icon: ChartBarIcon },
  { name: "Settings", href: "/admin/settings", icon: CogIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-lg">
        <div className="flex h-16 shrink-0 items-center">
          <Link href="/admin" className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                          isActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                        }`}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 ${
                            isActive ? "text-blue-700" : "text-gray-400 group-hover:text-blue-700"
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
