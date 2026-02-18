"use client";

import { cn } from "@/libs/utils";

interface SimpleModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  className?: string;
}

export default function SimpleModal({
  open,
  onClose,
  children,
  title,
  className,
}: SimpleModalProps) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className={cn(
            "bg-background rounded-xl shadow-lg w-full max-w-md flex flex-col max-h-[90vh] border relative",
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between py-2 px-4 rounded-t-xl border-b sticky top-0 bg-card z-10">
            <h2 className="text-lg font-semibold">{title}</h2>

            <div
              className="px-1 bg-accent hover:bg-accent/80 border rounded-lg cursor-pointer transition-colors duration-200"
              onClick={onClose}
            >
              <i className="bi-x text-2xl"></i>
            </div>
          </div>

          <div className="p-4 overflow-auto flex-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
