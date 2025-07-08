"use client";
import { GitlabLogo } from "phosphor-react";
import Link from "next/link";
import PopupModal from "./dashboard/components/PopUp";

export default function Home() {
  return (
    <>
      <PopupModal />

      <div className="min-h-screen flex flex-col items-center justify-between bg-gray-50 font-sans text-gray-800">
        {/* Hero Section */}

        <section className="w-full px-6 py-20 text-center bg-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Welcome to <span className="text-blue-600">CuriftThemes</span>
            </h1>
            <p className="text-lg sm:text-xl mb-6 text-gray-600">
              Premium, blazing-fast WordPress themes crafted for modern creators
              and businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base flex items-center justify-center px-6 py-3 rounded-md font-medium transition"
              >
                Dashboard
              </Link>
              <a
                href="https://github.com/kofi2552/curiftThemes"
                className="border border-gray-300 text-sm sm:text-base flex flex-row items-center justify-center gap-3 px-6 py-3 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                <GitlabLogo size={20} weight="fill" /> Contribute
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full px-6 py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto grid gap-12 sm:grid-cols-2">
            <div className="bg-white p-6 rounded-lg border border-[#e4e4e4]  transition">
              <h3 className="text-xl font-semibold mb-2">
                Optimized for Speed
              </h3>
              <p className="text-gray-600">
                Our themes are lightweight, fast, and SEO-ready—giving your site
                the edge it needs to rank and convert.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-[#e4e4e4]  transition">
              <h3 className="text-xl font-semibold mb-2">
                Clean & Modern Design
              </h3>
              <p className="text-gray-600">
                Built with best practices and elegant design systems to ensure
                your brand looks great on all devices.
              </p>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="w-full text-center text-sm text-gray-500 py-6 border-t border-gray-200">
          &copy; {new Date().getFullYear()} CuriftThemes. All rights reserved.
        </footer>
      </div>
    </>
  );
}
