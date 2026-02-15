import { ProductVariantWithDetailType } from "@/schemas";
import { productVariantService } from "@/services";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductDetail from "./components/product-detail";
import { Response } from "@/libs/helper-response";
import PageContainer from "../../_components/layouts/page-container";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const {
    data: productData,
    success,
  }: Response<ProductVariantWithDetailType | null> =
    await productVariantService.getBySlug(slug);
  if (!productData || !success) {
    return notFound();
  }
  return {
    title: productData.name ? `${productData.name} | AZ Shop` : "AZ Shop",
    openGraph: {
      title: productData.name ? `${productData.name} | AZ Shop` : "AZ Shop",
      images: productData.thumbnail ? [productData.thumbnail] : [],
    },
  };
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const { data: productData }: Response<ProductVariantWithDetailType | null> =
    await productVariantService.getBySlug(slug);
  if (!productData) {
    notFound();
  }
  return (
    <PageContainer className="max-w-7xl">
      <ProductDetail productData={productData} />
    </PageContainer>
  );
};

export default Page;
