import Image from "next/image";
import Link from "next/link";
import { NewsFeedType } from "@/schemas";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
type NewsListProps = {
  news: NewsFeedType[];
};

const NewsList = ({ news }: NewsListProps) => {
  if (!news || news.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Không có tin tức nào
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {news.map((newsItem) => (
        <Link
          key={newsItem.id}
          href={`/tin-tuc/${newsItem.slug}`}
          className="group flex gap-4 bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="relative w-[180px] h-[140px] flex-shrink-0">
            <Image
              src={newsItem.thumbnail}
              alt={newsItem.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex-1 py-3 pr-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold line-clamp-3 group-hover:text-blue-600 transition-colors">
                {newsItem.title}
              </h3>
            </div>
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              {formatDistanceToNow(new Date(newsItem.created_at), {
                addSuffix: true,
                locale: vi,
              })}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NewsList;
