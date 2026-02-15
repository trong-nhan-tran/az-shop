import { NewsFeedType } from "@/schemas";
import { newsFeedService } from "@/services";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Response } from "@/libs/helper-response";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

import Image from "next/image";
import { CalendarDays } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: newsFeedData, success }: Response<NewsFeedType | null> =
    await newsFeedService.getBySlug(slug);
  if (!newsFeedData || !success) {
    return notFound();
  }
  return {
    title: newsFeedData.title ? `${newsFeedData.title} | AZ Shop` : "AZ Shop",
    openGraph: {
      title: newsFeedData.title ? `${newsFeedData.title} | AZ Shop` : "AZ Shop",
      images: newsFeedData.thumbnail ? [newsFeedData.thumbnail] : [],
    },
  };
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const { data: newsFeedData }: Response<NewsFeedType | null> =
    await newsFeedService.getBySlug(slug);
  if (!newsFeedData) {
    notFound();
  }

  return (
    <div className="sm:max-w-5xl w-full mx-auto p-2 mt-2  ">
      <div className="bg-white p-3 sm:p-6 rounded-2xl">
        <h1 className="text-3xl font-bold mb-4">{newsFeedData.title}</h1>
        <p className="text-gray-500 text-sm mb-4 flex items-center gap-1 ">
          <CalendarDays className="w-4 h-4" />
          {formatDistanceToNow(new Date(newsFeedData.created_at), {
            addSuffix: true,
            locale: vi,
          })}
        </p>

        {newsFeedData.thumbnail && (
          <div className="w-full relative mb-4">
            <Image
              src={newsFeedData.thumbnail}
              alt={newsFeedData.title}
              className="object-cover w-full h-full rounded"
              width={800}
              height={400}
            />
          </div>
        )}
        <div
          className="prose max-w-full"
          dangerouslySetInnerHTML={{ __html: newsFeedData.content }}
        />
      </div>
    </div>
  );
};

export default Page;
