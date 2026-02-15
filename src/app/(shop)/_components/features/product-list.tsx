import { ProductVariantType } from "@/schemas";
import ProductVariantCard from "@/app/(shop)/_components/features/product-card";

type ProductListProps = {
  products: ProductVariantType[];
};

const ProductList = ({ products }: ProductListProps) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-2 sm:gap-4">
      {products.map((product) => (
        <ProductVariantCard key={product.id} productVariant={product} />
      ))}
    </div>
  );
};

export default ProductList;
