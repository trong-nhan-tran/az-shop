import Image from "next/image";
import Link from "next/link";
import { NewsFeedType } from "@/schemas";

type NewsSliderProps = {
  news: NewsFeedType[];
};

const NewsSlider = ({ news }: NewsSliderProps) => {
  if (!news || news.length === 0) {
    return null;
  }

  const displayNews = news.slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
      {displayNews[0] && (
        <Link
          href={`/tin-tuc/${displayNews[0].slug}`}
          className="relative block md:col-span-2 h-[400px] md:h-[500px] group overflow-hidden rounded-2xl"
        >
          <Image
            src={displayNews[0].thumbnail}
            alt={displayNews[0].title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
          <h1 className="absolute bottom-6 left-6 right-6 text-3xl font-bold text-white drop-shadow-2xl line-clamp-3">
            {displayNews[0].title}
          </h1>
        </Link>
      )}

      <div className="flex flex-col gap-2 sm:gap-4">
        {displayNews[1] && (
          <Link
            href={`/tin-tuc/${displayNews[1].slug}`}
            className="relative block h-[400px] md:h-[243px] group overflow-hidden rounded-2xl"
          >
            <Image
              src={displayNews[1].thumbnail}
              alt={displayNews[1].title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
            <h2 className="absolute bottom-4 left-4 right-4 text-xl md:text-2xl font-bold text-white drop-shadow-2xl line-clamp-2">
              {displayNews[1].title}
            </h2>
          </Link>
        )}

        {displayNews[2] && (
          <Link
            href={`/tin-tuc/${displayNews[2].slug}`}
            className="relative block h-[400px] md:h-[243px] group overflow-hidden rounded-2xl"
          >
            <Image
              src={displayNews[2].thumbnail}
              alt={displayNews[2].title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
            <h2 className="absolute bottom-4 left-4 right-4 text-xl md:text-2xl font-bold text-white drop-shadow-2xl line-clamp-2">
              {displayNews[2].title}
            </h2>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NewsSlider;
