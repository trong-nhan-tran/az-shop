import { cn } from "@/libs/utils";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const BoxContent = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-xl p-4 sm:p-8 space-y-5",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default BoxContent;
