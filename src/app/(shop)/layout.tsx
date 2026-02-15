import NavBar from "./_components/layouts/navbar-shop";
import Footer from "./_components/layouts/footer";
import { Response } from "@/libs/helper-response";
import { categoryService } from "@/services";
import { CategoryType } from "@/schemas";
import ShopProviders from "./_providers/provider-shop";
export const metadata = {
  title: "AZ Shop | Apple chính hãng giá tốt",
  description: "Cửa hàng Apple chính hãng",
  openGraph: {
    title: "AZ Shop | Apple chính hãng giá tốt",
    description:
      "Cửa hàng Apple chính hãng với các sản phẩm như iPhone, iPad, MacBook và phụ kiện.",
    images: ["/logo2.png"],
  },
};
export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categoriesResponse: Response<CategoryType[] | null> =
    await categoryService.getAll({}, { orderBy: { order_number: "asc" } });
  const categories: CategoryType[] = categoriesResponse.data || [];

  return (
    <ShopProviders>
      <div className="flex flex-col min-h-screen">
        <NavBar categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ShopProviders>
  );
}
