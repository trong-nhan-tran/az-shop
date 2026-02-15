"use client";

import { Button } from "@/components/ui-shadcn/button";
import { cn } from "@/libs/utils";

type FormActionsProps = {
  loading?: boolean;
  onCancel?: () => void;
  cancelText?: string;
  submitText?: string;
  className?: string;
};

const FormActions = ({
  loading = false,
  onCancel,
  cancelText = "Hủy",
  submitText = "Lưu",
  className,
}: FormActionsProps) => {
  return (
    <div className={cn("flex justify-end gap-2", className)}>
      <Button type="button" variant="outline" onClick={onCancel}>
        {cancelText}
      </Button>

      <Button
        type="submit"
        disabled={loading}
        className="relative bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 shadow-sm"
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-arrow-repeat animate-spin text-white"></i>
          </span>
        )}
        <span className={loading ? "opacity-0" : ""}>{submitText}</span>
      </Button>
    </div>
  );
};

export default FormActions;
