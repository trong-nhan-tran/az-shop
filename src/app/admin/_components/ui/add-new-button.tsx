import React from "react";
import { Button } from "@/components/ui-shadcn/button";
import { Plus } from "lucide-react";
import { cn } from "@/libs/utils";

type Props = {
  addNewText?: string;
  onAddNew: () => void;
  className?: string;
};

const AddNewButton = (props: Props) => {
  return (
    <Button
      type="button"
      onClick={props.onAddNew}
      className={cn(
        "px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600 transition-all duration-200 shadow-sm hover:shadow-md",
        props.className
      )}
    >
      <Plus />
      {props.addNewText || "Thêm"}
    </Button>
  );
};

export default AddNewButton;
