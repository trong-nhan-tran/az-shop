"use client";
import AccountHeader from "./account-header";
import OrderHistory from "./order-history";
import { useAuthStatus } from "@/hooks/useAuthStatus";
type Props = {};

const AccountContent = (props: Props) => {
  const { isLoggedIn, isChecking } = useAuthStatus();

  return (
    <>
      <AccountHeader enabled={isLoggedIn && !isChecking} />
      <OrderHistory enabled={isLoggedIn && !isChecking} />
    </>
  );
};

export default AccountContent;
