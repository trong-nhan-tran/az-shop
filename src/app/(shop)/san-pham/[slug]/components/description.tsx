"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui-shadcn/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import BoxContent from "@/app/(shop)/_components/layouts/box-content";

type Props = {
  description: string | null;
};

const ProductDescription = (props: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setShowReadMore(contentHeight > 400); // Reduced height for mobile
    }
  }, [props.description]);

  if (!props.description) {
    return null;
  }

  return (
    <BoxContent>
      <div className="relative items-center flex flex-col">
        <div
          ref={contentRef}
          className={`prose prose-sm sm:prose max-w-none 
            prose-img:my-2 prose-img:rounded-lg prose-img:mx-auto prose-img:max-w-full 
            prose-headings:text-sm prose-headings:sm:text-base
            prose-p:text-sm prose-p:sm:text-base
            transition-all duration-300 overflow-hidden ${
              isExpanded
                ? ""
                : "max-h-[400px] sm:max-h-[600px] lg:max-h-[800px]"
            }`}
          dangerouslySetInnerHTML={{ __html: props.description }}
        />

        {/* Gradient overlay */}
        {!isExpanded && showReadMore && (
          <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-linear-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      {showReadMore && (
        <div className="mt-3 sm:mt-4 text-center">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 text-sm sm:text-base px-4 sm:px-6"
          >
            {isExpanded ? (
              <>
                Thu gọn <ChevronUp className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </>
            ) : (
              <>
                Xem thêm <ChevronDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </BoxContent>
  );
};

export default ProductDescription;
