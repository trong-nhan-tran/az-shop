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
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";
import { NumericFormat } from "react-number-format";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type CustomInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "password";
  className?: string;
  disabled?: boolean;
  isRequired?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  allowDecimal?: boolean;
  labelSize?: "small" | "medium" | "large";
};

function CustomInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  className,
  disabled = false,
  isRequired = false,
  onChange,
  allowDecimal = false,
  labelSize = "small",
}: CustomInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";
  const inputType = isPasswordType && showPassword ? "text" : type;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full gap-0">
          <FormLabel
            className={cn(
              labelSize === "small" && "",
              labelSize === "medium" && "text-base",
              labelSize === "large" && "text-lg",
            )}
          >
            {label}
            {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            {type === "number" ? (
              <NumericFormat
                customInput={Input}
                allowNegative={false}
                allowLeadingZeros={false}
                decimalScale={allowDecimal ? 2 : 0}
                thousandSeparator
                className={cn(
                  "input input-bordered w-full h-12 mt-1",
                  className,
                  disabled && "opacity-70 cursor-not-allowed",
                )}
                disabled={disabled}
                placeholder={placeholder}
                value={field.value ?? ""}
                onValueChange={(values) => {
                  const number = allowDecimal
                    ? parseFloat(values.value)
                    : parseInt(values.value, 10);

                  field.onChange(isNaN(number) ? null : number);
                }}
              />
            ) : (
              <div className="relative">
                <Input
                  type={inputType}
                  placeholder={placeholder}
                  className={cn(
                    "input input-bordered w-full h-12 mt-1",
                    isPasswordType && "pr-10",
                    className,
                    disabled && "opacity-70 cursor-not-allowed",
                  )}
                  disabled={disabled}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    field.onChange(e);
                    onChange?.(e);
                  }}
                />
                {isPasswordType && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default CustomInput;
