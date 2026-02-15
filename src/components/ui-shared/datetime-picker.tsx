"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui-shadcn/form";
import { Input } from "@/components/ui-shadcn/input";
import { cn } from "@/libs/utils";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import React from "react";

type DateTimePickerProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  isRequired?: boolean;
  min?: string;
  max?: string;
};

function DateTimePicker<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  className,
  disabled = false,
  isRequired = false,
  min,
  max,
}: DateTimePickerProps<T>) {
  const formatDateTimeLocal = (date: Date | string | null | undefined) => {
    if (!date) return "";

    let dateObj: Date;
    if (typeof date === "string") {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }

    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return "";

    // Convert to local timezone for display in datetime-local input
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const parseLocalDateTime = (value: string): Date | null => {
    if (!value) return null;

    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full gap-0">
          <FormLabel>
            {label}
            {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type="datetime-local"
                placeholder={placeholder}
                className={cn(
                  "input input-bordered w-full h-12 mt-1",
                  className,
                  disabled && "opacity-70 cursor-not-allowed"
                )}
                disabled={disabled}
                min={min}
                max={max}
                value={formatDateTimeLocal(field.value)}
                onChange={(e) => {
                  const value = e.target.value;
                  const parsedDate = parseLocalDateTime(value);
                  field.onChange(parsedDate);
                }}
              />
              <div className="text-xs text-gray-500 mt-1">
                Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default DateTimePicker;
