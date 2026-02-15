import AccountContent from "./_components/account-content";
import PageContainer from "../_components/layouts/page-container";

export const metadata = {
  title: "Tài khoản | AZ Shop",
  description: "Quản lý thông tin tài khoản và đơn hàng của bạn",
};
const Page = () => {
  return (
    <PageContainer className="max-w-3xl">
      <AccountContent />
    </PageContainer>
  );
};

export default Page;
