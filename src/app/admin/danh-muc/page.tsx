import { Suspense } from "react";
import CategoryTable from "./components/table-category";
import { CategoryFormProvider } from "./components/form-category";
import { SubcategoryFormProvider } from "./components/form-subcategory";
export const metadata = {
  title: "Quản Lí Danh Mục | AZ Shop",
};
const Page = () => {
  return (
    <>
      <CategoryFormProvider />
      <SubcategoryFormProvider />
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryTable />
      </Suspense>
    </>
  );
};

export default Page;
