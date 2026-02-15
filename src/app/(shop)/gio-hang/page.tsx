import PageContainer from "../_components/layouts/page-container";
import CartContent from "./components/cart-content";

export const metadata = {
  title: "Giỏ hàng | AZ Shop",
};

const CartPage = () => {
  return (
    <PageContainer className="max-w-2xl">
      <CartContent />
    </PageContainer>
  );
};

export default CartPage;
