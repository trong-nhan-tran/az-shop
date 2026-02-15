"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/libs/utils";
import { Button } from "@/components/ui-shadcn/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui-shadcn/popover";

type SelectOption = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  label: string;
  control: any;
  options: SelectOption[];
  className?: string;
  isRequired?: boolean;
  isNumeric?: boolean;
  disabled?: boolean;
  defaultValue?: string | number | null;
  onChange?: (value: any) => void;
};

const SelectCustom = ({
  name,
  label,
  control,
  options,
  className,
  isRequired = false,
  isNumeric = false,
  disabled = false,
  onChange,
}: Props) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string | null>(null);

  return (
    <div className={cn("space-y-1", className)}>
      <label className="text-sm font-medium">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full h-12 justify-between",
              disabled ? "opacity-70 cursor-not-allowed" : ""
            )}
            disabled={disabled}
          >
            {value
              ? options.find((option) => option.value === value)?.label ||
                "Chọn"
              : "Chọn"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
          sideOffset={4}
        >
          <div className="max-h-[200px] overflow-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100",
                  value === option.value && "bg-gray-200"
                )}
                onClick={() => {
                  const finalValue = isNumeric
                    ? Number(option.value)
                    : option.value;
                  setValue(option.value);
                  control.setValue(name, finalValue);
                  onChange?.(finalValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SelectCustom;
