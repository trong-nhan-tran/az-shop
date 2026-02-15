import { notFound } from "next/navigation";
import { Response } from "@/libs/helper-response";

import BannerSlider from "@/app/(shop)/_components/features/banner-carousel";
import {
  bannerService,
  categoryService,
  productVariantService,
} from "@/services";
import { BannerType, CategoryWithSubType, ProductVariantType } from "@/schemas";
import ProductList from "../../_components/features/product-list";
import Pagination from "../../_components/features/pagination";
import FilterSort from "../../_components/features/filter-sort";
import { Prisma } from "@prisma/client";
import { Metadata } from "next";
import PageContainer from "../../_components/layouts/page-container";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const {
    data: categoryData,
    success: categorySuccess,
  }: Response<CategoryWithSubType | null> =
    await categoryService.getBySlug(slug);
  if (!categoryData || !categorySuccess) {
    return notFound();
  }
  return {
    title: categoryData.name ? `${categoryData.name} | AZ Shop` : "AZ Shop",
    openGraph: {
      title: categoryData.name ? `${categoryData.name} | AZ Shop` : "AZ Shop",
      description: `Khám phá các sản phẩm trong danh mục ${categoryData.name} tại AZ Shop.`,
      images: categoryData.thumbnail ? [categoryData.thumbnail] : [],
    },
  };
}

const Page = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const { page: pageParam, sort } = await searchParams;
  const currentPage = Number(pageParam) || 1;
  const sortBy = sort || "newest";

  let orderBy: Prisma.product_variantsOrderByWithRelationInput = {
    created_at: "desc",
  };

  switch (sortBy) {
    case "newest":
      orderBy = { created_at: "desc" };
      break;
    case "best-selling":
      orderBy = {};
      break;
    case "price-asc":
      orderBy = { base_price: "asc" };
      break;
    case "price-desc":
      orderBy = { base_price: "desc" };
      break;
  }

  const {
    data: categoryData,
    success: categorySuccess,
  }: Response<CategoryWithSubType | null> =
    await categoryService.getBySlug(slug);
  if (categoryData == null || categorySuccess === false) {
    return notFound();
  }
  const { data: bannerData }: Response<BannerType[] | null> =
    await bannerService.getByCategorySlug(slug);

  const {
    data: productList,
    pagination,
  }: Response<ProductVariantType[] | null> =
    await productVariantService.getAllByCategorySlug(slug, {
      page: currentPage,
      pageSize: 16,
      orderBy,
    });

  return (
    <PageContainer className="max-w-7xl sm:space-y-4">
      <BannerSlider banners={bannerData || []} variant="category" />
      <FilterSort currentSort={sortBy} categoryWithSub={categoryData} />
      <ProductList products={productList || []} />
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
        />
      )}
    </PageContainer>
  );
};

export default Page;
