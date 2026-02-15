"use client";
import { useState } from "react";
import Link from "next/link";
import CartIcon from "./cart-icon";
import SearchBox from "./search-box";
import Image from "next/image";
import { CategoryType } from "@/schemas";
import { AccountIcon } from "./account-icon";

type Props = { categories: CategoryType[] };

const NavBar = ({ categories }: Props) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-black w-full sticky  top-0 z-50">
      <div className="container mx-auto px-4 w-full">
        {/* Main Navbar */}
        <div className="flex items-center justify-between lg:justify-center lg:gap-20">
          {/* Logo */}
          <Link href="/">
            <Image src="/images/logo1.png" alt="Logo" width={90} height={90} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:flex-row lg:gap-16">
            {categories
              .filter((category) => category.slug !== "home")
              .map((category) => (
                <Link key={category.id} href={`/danh-muc/${category.slug}`}>
                  {category.name}
                </Link>
              ))}
            <Link href="/tin-tuc">Tin tức</Link>
          </nav>

          {/* Right Side: Search + Cart */}
          <div className="flex items-center gap-4 lg:gap-20">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                viewBox="0 0 15 44"
              >
                <path d="M14.298,27.202l-3.87-3.87c0.701-0.929,1.122-2.081,1.122-3.332c0-3.06-2.489-5.55-5.55-5.55c-3.06,0-5.55,2.49-5.55,5.55 c0,3.061,2.49,5.55,5.55,5.55c1.251,0,2.403-0.421,3.332-1.122l3.87,3.87c0.151,0.151,0.35,0.228,0.548,0.228 s0.396-0.076,0.548-0.228C14.601,27.995,14.601,27.505,14.298,27.202z M1.55,20c0-2.454,1.997-4.45,4.45-4.45 c2.454,0,4.45,1.997,4.45,4.45S8.454,24.45,6,24.45C3.546,24.45,1.55,22.454,1.55,20z"></path>
              </svg>
            </button>
            <AccountIcon />

            {/* Cart Icon */}
            <CartIcon />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden border-t border-gray-200">
          <nav className="flex items-center justify-between overflow-x-auto py-2 gap-2">
            {categories
              .filter((category) => category.slug !== "home")
              .map((category) => (
                <Link
                  key={category.id}
                  href={`/danh-muc/${category.slug}`}
                  className="text-sm"
                >
                  {category.name}
                </Link>
              ))}
            <Link href="/tin-tuc" className="text-sm">
              Tin tức
            </Link>
          </nav>
        </div>
      </div>

      {/* Search Box Modal */}
      {isSearchOpen && <SearchBox onClose={() => setIsSearchOpen(false)} />}
    </div>
  );
};

export default NavBar;
