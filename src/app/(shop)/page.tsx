import BannerCarousel from "@/app/(shop)/_components/features/banner-carousel";
import CategoryMenu from "@/app/(shop)/_components/features/categories-menu";
import ProductSlider from "@/app/(shop)/_components/features/product-carousel";

import FlashSale from "./_components/features/flash-sale";
import { BannerType } from "@/schemas/schema-banner";
import { Response } from "@/libs/helper-response";
import { bannerService, categoryService } from "@/services";
import { CategoryWithFeaturedItemsType } from "@/schemas";

export default async function Home() {
  const { data: homeBanner = [] }: Response<BannerType[] | null> =
    await bannerService.getHomeBanners();

  const {
    data: categories = [],
  }: Response<CategoryWithFeaturedItemsType[] | null> =
    await categoryService.getAllCategoryWithFeaturedItems();
  return (
    <div className="w-full">
      <BannerCarousel banners={homeBanner || []} variant="home" />
      <CategoryMenu categories={categories || []} />
      {categories &&
        categories
          .filter((category) => category.slug !== "home")
          .map((category) => (
            <ProductSlider
              key={category.id}
              href={`/danh-muc/${category.slug}`}
              name={category.name}
              featuredItems={category.featured_items || []}
            />
          ))}
    </div>
  );
}
