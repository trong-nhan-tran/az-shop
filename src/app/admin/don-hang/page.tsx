import { Suspense } from "react";
import OrderTable from "./components/table-order";
import { OrderItemFormProvider } from "./components/form-order-item";
export const metadata = {
  title: "Quản Lí Đơn Hàng | AZ Shop",
};
const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderItemFormProvider />
      <Suspense fallback={<div>Loading...</div>}>
        <OrderTable />
      </Suspense>
    </Suspense>
  );
};

export default Page;
