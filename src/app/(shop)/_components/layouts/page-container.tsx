import { cn } from "@/libs/utils";
import { ReactNode } from "react";
type Props = {
  children?: ReactNode;
  className?: string;
};

const PageContainer = ({ children, className = "" }: Props) => {
  return (
    <div
      className={cn(
        "m-2 sm:m-4 sm:mx-auto max-w-4xl space-y-2 sm:space-y-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default PageContainer;
