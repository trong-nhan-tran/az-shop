import { Button } from "@/components/ui-shadcn/button";
import { ProductItemWithDetails } from "@/schemas";
import { Check } from "lucide-react";

type Props = {
  selectedProductItem: ProductItemWithDetails | null;
  isAddingToCart: boolean;
  handleAddToCart: () => void;
};

const CartButton = ({
  selectedProductItem,
  isAddingToCart,
  handleAddToCart,
}: Props) => {
  return (
    <Button
      className="mt-6 sm:mt-8 lg:mt-10 h-12 sm:h-14 text-base sm:text-lg w-full bg-blue-500 hover:bg-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleAddToCart}
      disabled={isAddingToCart || !selectedProductItem}
    >
      <span className="flex items-center justify-center gap-2">
        <i className="bi-bag" /> Thêm vào giỏ hàng
      </span>
    </Button>
  );
};

export default CartButton;
