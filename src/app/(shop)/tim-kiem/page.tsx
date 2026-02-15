import { redirect } from "next/navigation";
import { Response } from "@/libs/helper-response";
import { productVariantService } from "@/services";
import { ProductVariantType } from "@/schemas";
import ProductList from "../_components/features/product-list";
import Pagination from "../_components/features/pagination";
import FilterSort from "../_components/features/filter-sort";
import { Prisma } from "@prisma/client";
import { Metadata } from "next";
import { Search } from "lucide-react";

type Props = {
  searchParams: Promise<{ page?: string; sort?: string; key?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { key } = await searchParams;

  return {
    title: key
      ? `Kết quả tìm kiếm cho "${key}" | AZ Shop`
      : "Tìm kiếm | AZ Shop",
    openGraph: {
      title: key
        ? `Kết quả tìm kiếm cho "${key}" | AZ Shop`
        : "Tìm kiếm | AZ Shop",
      description: key
        ? `Khám phá các sản phẩm liên quan đến "${key}" tại AZ Shop.`
        : "AZ Shop",
      images: ["/logo2.png"],
    },
  };
}
const Page = async ({ searchParams }: Props) => {
  const { page: pageParam, sort, key } = await searchParams;
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

  let productList: ProductVariantType[] = [];
  let pagination;

  if (key) {
    const result: Response<ProductVariantType[] | null> =
      await productVariantService.getAll(
        {
          name: { contains: key, mode: "insensitive" },
        },
        {
          page: currentPage,
          pageSize: 16,
          orderBy,
        }
      );
    productList = result.data || [];
    pagination = result.pagination;
  }

  return (
    <div className="sm:max-w-7xl w-full mx-auto p-2 sm:p-0 pb-10">
      <form action="/tim-kiem" method="get" className="relative mt-4">
        <div className="relative flex items-center bg-white rounded-lg">
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="key"
            defaultValue={key}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </form>
      {key && productList.length !== 0 && <FilterSort currentSort={sortBy} />}
      <ProductList products={productList || []} />
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
        />
      )}
    </div>
  );
};

export default Page;
