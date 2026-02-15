import NewsSlider from "./_components/banner-news";
import NewsList from "./_components/news-list";
import SearchBox from "./_components/search-box";
import Pagination from "../_components/features/pagination";
import { newsFeedService } from "@/services";
import { NewsFeedType } from "@/schemas/schema-news-feed";
import { Response } from "@/libs/helper-response";
import { Prisma } from "@prisma/client";
import PageContainer from "../_components/layouts/page-container";

type PageProps = {
  searchParams: Promise<{ page?: string; key?: string }>;
};
export const metadata = {
  title: "Tin tức  công nghệ | AZ Shop",
  description: "Cửa hàng Apple chính hãng",
  openGraph: {
    title: "Tin tức  công nghệ | AZ Shop",
    description:
      "Cửa hàng Apple chính hãng với các sản phẩm như iPhone, iPad, MacBook và phụ kiện.",
    images: ["/logo2.png"],
  },
};
export default async function Page({ searchParams }: PageProps) {
  const { page, key } = await searchParams;
  const currentPage = Number(page) || 1;
  const searchQuery = key || "";
  const pageSize = 11;

  // Build where clause for search
  const whereClause: Prisma.news_feedsWhereInput = searchQuery
    ? { title: { contains: searchQuery, mode: "insensitive" } }
    : {};

  const { data: newsFeedList, pagination }: Response<NewsFeedType[] | null> =
    await newsFeedService.getAll(whereClause, {
      page: currentPage,
      pageSize: pageSize,
      orderBy: {
        created_at: "desc",
      },
    });

  // Only show banner on first page and when not searching
  const bannerNews =
    currentPage === 1 && !searchQuery ? newsFeedList?.slice(0, 3) || [] : [];
  const listNews =
    currentPage === 1 && !searchQuery
      ? newsFeedList?.slice(3) || []
      : newsFeedList || [];
  const totalPages = pagination?.totalPages || 1;

  return (
    <PageContainer className="max-w-7xl">
      {currentPage === 1 && !searchQuery && <NewsSlider news={bannerNews} />}

      <div className="mt-8">
        <div className="mb-4">
          <SearchBox />
        </div>

        <h2 className="text-2xl font-bold mb-6">
          {searchQuery
            ? `Kết quả tìm kiếm cho "${searchQuery}"`
            : "Tin tức mới nhất"}
        </h2>
        <NewsList news={listNews} />
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </PageContainer>
  );
}
