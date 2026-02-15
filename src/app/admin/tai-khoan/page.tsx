import ProfileTable from "./components/table-profile";
import { Suspense } from "react";
export const metadata = {
  title: "Quản Lí Tài Khoản | AZ Shop",
};
const AccountUserPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileTable />
    </Suspense>
  );
};

export default AccountUserPage;
