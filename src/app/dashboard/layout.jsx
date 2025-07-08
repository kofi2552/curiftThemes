"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { ArrowElbowDownRight } from "phosphor-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const isActive = (route) =>
    pathname === route || pathname.startsWith(route + "/");

  return (
    <div className="w-full flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-r-[#e4e4e4] hidden md:block">
        <div
          className="p-6 font-bold text-xl cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          CuriftThemes
        </div>
        <nav className="px-6">
          <ul className="space-y-4 mt-8 text-md">
            <li>
              <Link
                href="/dashboard"
                className={clsx(
                  "hover:text-gray-800",
                  isActive("/dashboard")
                    ? "text-gray-800 font-medium"
                    : "text-gray-600"
                )}
              >
                Licenses
              </Link>
              {isActive("/dashboard/license") && (
                <span className="mt-3 text-xs text-gray-400 font-medium flex items-center gap-2">
                  <ArrowElbowDownRight size={18} className="mb-2" /> Edit
                  License
                </span>
              )}
            </li>
            <li>
              <Link
                href="/dashboard/support"
                className={clsx(
                  "hover:text-gray-800",
                  isActive("/dashboard/support")
                    ? "text-gray-800 font-medium"
                    : "text-gray-600"
                )}
              >
                Support
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/notice"
                className={clsx(
                  "hover:text-gray-800",
                  isActive("/dashboard/notice")
                    ? "text-gray-800 font-medium"
                    : "text-gray-600"
                )}
              >
                Notice
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 bg-gray-50">
        <header className="bg-white border-b border-b-[#e4e4e4] px-6 py-8">
          <h1 className="text-xl font-semibold">
            {pathname.startsWith("/dashboard/license")
              ? "Edit License"
              : pathname.startsWith("/dashboard/support")
              ? "Support"
              : pathname.startsWith("/dashboard/notice")
              ? "Notice Board"
              : "Manage Licenses"}
          </h1>
        </header>

        <main className="w-full p-6">{children}</main>
      </div>
    </div>
  );
}
