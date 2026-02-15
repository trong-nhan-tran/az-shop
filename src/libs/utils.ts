import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics (accent marks)
    .toLowerCase()
    .replace(/đ/g, "d") // Replace Vietnamese đ with d
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .trim(); // Remove whitespace from both ends
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(price));
}
export function extractImageUrlsFromDescription(description: string): string[] {
  const regex = /https?:\/\/[^\s"]+\.(jpg|jpeg|png|gif)/g;
  return description.match(regex) || [];
}

export const calculateDiscountPercentage = (
  basePrice: number,
  listedPrice: number,
) => {
  if (listedPrice === 0) return null;
  const percentage = Math.round(
    ((listedPrice - basePrice) / listedPrice) * 100,
  );
  return percentage >= 1 ? percentage : null;
};
