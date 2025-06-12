"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Settings, Package, Users, BarChart3 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: <BarChart3 className="h-5 w-5" /> },
    { name: "Products", href: "/admin/products", icon: <Package className="h-5 w-5" /> },
    { name: "Weekly Sales", href: "/admin/weekly-sales", icon: <ShoppingBag className="h-5 w-5" /> },
    { name: "Users", href: "/admin/users", icon: <Users className="h-5 w-5" /> },
    { name: "Settings", href: "/admin/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PC</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Admin Panel</h1>
          </Link>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Admin Dashboard
            </h1>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Back to Store
            </Link>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
