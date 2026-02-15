import { Suspense } from "react";
import NewsFeedTable from "./components/table-news";
export const metadata = {
  title: "Quản Lí Tin Tức | AZ Shop",
};
const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewsFeedTable />
    </Suspense>
  );
};

export default Page;
