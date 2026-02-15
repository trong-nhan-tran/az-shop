import { Suspense } from "react";
import FlashSaleTable from "./components/table-flash-sale";
import FlashSaleFormProvider from "./components/form-flash-sale";
import FlashSaleItemFormProvider from "./components/form-flash-sale-item";
export const metadata = {
  title: "Quản Lí Flash Sale | AZ Shop",
};
const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FlashSaleTable />
      <FlashSaleFormProvider />
      <FlashSaleItemFormProvider />
    </Suspense>
  );
};

export default Page;
