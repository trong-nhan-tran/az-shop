import { Suspense } from "react";
import ProductTable from "./components/table-product";
import ProductVariantFormProvider from "./components/form-product-variant";
import ProductItemFormProvider from "./components/form-product-item";
import { ProductColorFormProvider } from "./components/form-product-color";
export const metadata = {
  title: "Quản Lí Sản Phẩm | AZ Shop",
};
const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductTable />
      <ProductVariantFormProvider />
      <ProductItemFormProvider />
      <ProductColorFormProvider />
    </Suspense>
  );
};

export default Page;
