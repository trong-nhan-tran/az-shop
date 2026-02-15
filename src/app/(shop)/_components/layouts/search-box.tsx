"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui-shadcn/input";
import { Button } from "@/components/ui-shadcn/button";

const SearchBox = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchTerm = searchInputRef.current?.value;
    if (searchTerm && searchTerm.trim() !== "") {
      router.push(`/tim-kiem?key=${encodeURIComponent(searchTerm.trim())}`);
      onClose(); // Close the search box after submitting
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 bg-opacity-30 z-40" // Adjust opacity here
        onClick={onClose}
      ></div>

      {/* Search Box */}
      <div className="fixed top-0 left-0 w-full bg-white z-50 shadow-md">
        <div className="container mx-auto px-4 lg:px-50 py-3">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-3"
          >
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="px-4 text-sm border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <Button
              type="submit"
              className="bg-blue-500 text-white px-6 rounded-full text-sm font-medium hover:bg-blue-600 transition-all"
            >
              Tìm
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SearchBox;
