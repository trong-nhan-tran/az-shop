import { create } from "zustand";
import { BannerType, CategoryWithChildrenType } from "@/schemas";
import { persist } from "zustand/middleware";

interface CategoryStore {
  categories: CategoryWithChildrenType[];
  hasHydrated: boolean;
  setCategories: (categories: CategoryWithChildrenType[]) => void;
  getCategoryBySlug: (slug: string) => CategoryWithChildrenType | null;
  getHomeBanner: () => BannerType[] | null;
  setHasHydrated: (state: boolean) => void;
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [],
      hasHydrated: false,
      setCategories: (categories) => set({ categories }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
      getCategoryBySlug: (slug) => {
        const { categories } = get();
        for (const category of categories) {
          if (category.slug === slug) {
            return category;
          }
          const childCategory = category.subcategories?.find(
            (child) => child.slug === slug
          );
          if (childCategory) {
            return category;
          }
        }
        return null;
      },
      getHomeBanner: () => {
        const { categories } = get();
        const homeCategory = categories.find(
          (category) => category.slug === "home"
        );
        return homeCategory ? homeCategory.banners : null;
      },
    }),
    {
      name: "category-store",
      partialize: (state) => ({ categories: state.categories }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
