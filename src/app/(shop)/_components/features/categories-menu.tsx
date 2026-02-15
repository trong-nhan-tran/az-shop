import Link from "next/link";
import Image from "next/image";
import { CategoryType } from "@/schemas";

type Props = {
  categories: CategoryType[];
};

const CategoriesMenu = (props: Props) => {
  return (
    <div className="px-4  w-full lg:max-w-7xl m-auto grid gap-3 grid-cols-3 lg:grid-cols-6 lg:gap-4  mt-6">
      {props.categories
        ?.filter((category) => category.slug !== "home") // Lọc bỏ category có slug là "home"
        .map((category) => (
          <Link
            className="bg-white flex flex-col items-center justify-center dark:bg-neutral-700 rounded-2xl p-4 transform transition-transform duration-300 hover:scale-103"
            href={`/danh-muc/${category.slug}`}
            key={category.slug}
          >
            <Image
              src={category?.thumbnail || ""}
              width={160}
              height={160}
              alt="Category image"
              className="mb-2"
            />
            <div className="text-center text-sm font-medium">
              {category?.name || ""}
            </div>
          </Link>
        ))}
    </div>
  );
};

export default CategoriesMenu;
