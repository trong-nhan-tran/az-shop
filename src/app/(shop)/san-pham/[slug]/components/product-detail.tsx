"use client";

import { useState } from "react";
import {
  ProductVariantWithDetailType,
  ProductItemWithDetails,
} from "@/schemas";
import { calculateDiscountPercentage } from "@/libs/utils";
import ImageSlider from "./images-slider";
import ProductDescription from "./description";
import { toast } from "react-hot-toast";
import SelectColor from "./select-color";
import SelectOption from "./select-option";
import ProductNamePrice from "./product-name-price";
import CartButton from "./cart-button";
import { addCartItem } from "@/apis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartQuantityStore } from "@/stores/store-cart-quantity";
import BoxContent from "@/app/(shop)/_components/layouts/box-content";

type Props = {
  productData: ProductVariantWithDetailType;
};

const ProductDetail = ({ productData }: Props) => {
  const queryClient = useQueryClient();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedProductItem, setSelectedProductItem] =
    useState<ProductItemWithDetails | null>(productData.product_items[0]);
  const { incrementQuantity } = useCartQuantityStore();
  const addMutation = useMutation({
    mutationFn: (data: { product_item_id: number }) =>
      addCartItem({ product_item_id: data.product_item_id, quantity: 1 }),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Đã thêm vào giỏ hàng");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        incrementQuantity(1);
      } else {
        toast.error(response.message || "Thêm sản phẩm vào giỏ hàng thất bại");
      }
    },
    onError: () => {
      console.error("Lỗi thêm sản phẩm vào giỏ hàng");
      toast.error("Lỗi server");
    },
  });
  const currentPrice =
    selectedProductItem?.price || productData?.base_price || 0;

  const percentNumber = calculateDiscountPercentage(
    currentPrice,
    productData?.listed_price || 0,
  );

  return (
    <>
      <BoxContent className="flex-cols sm:flex sm:gap-8">
        <div className="w-full lg:w-1/2">
          <div className="lg:sticky lg:top-4">
            <ImageSlider
              key={selectedProductItem?.id}
              images={selectedProductItem?.product_colors?.images}
              alt={productData.name}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
          <ProductNamePrice
            name={productData.name}
            currentPrice={currentPrice}
            listedPrice={productData.listed_price}
            percentNumber={percentNumber}
          />
          <SelectOption
            productVariants={productData.products?.product_variants || []}
            currentSlug={productData.slug}
          />

          <SelectColor
            colors={productData.product_items}
            currentProductItem={selectedProductItem}
            setSelectedProductItem={setSelectedProductItem}
          />

          <CartButton
            isAddingToCart={isAddingToCart}
            selectedProductItem={selectedProductItem}
            handleAddToCart={async () => {
              if (!selectedProductItem) return;
              setIsAddingToCart(true);
              await addMutation.mutateAsync({
                product_item_id: selectedProductItem.id,
              });
              setIsAddingToCart(false);
            }}
          />
        </div>
      </BoxContent>

      <ProductDescription
        description={productData.products?.description || null}
      />
    </>
  );
};

export default ProductDetail;
