"use client";

import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui-shadcn/form";
import Image from "next/image";
import { ProductColorType } from "@/schemas";

interface RadioColorProps {
  control: Control<any>;
  name: string;
  label: string;
  options: ProductColorType[];
  disabledValues?: number[];
  isRequired?: boolean;
}

const RadioColor = ({
  control,
  name,
  label,
  options,
  disabledValues = [],
  isRequired = false,
}: RadioColorProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="gap-1">
          <FormLabel>
            {label}
            {isRequired && <span className="text-red-500">*</span>}{" "}
          </FormLabel>
          <FormControl>
            <div
              className={`grid grid-cols-2 gap-3 mt-0 ${
                fieldState.error ? "border-2 border-red-300 rounded-lg p-2" : ""
              }`}
            >
              {options.map((color) => {
                const isDisabled = disabledValues.includes(color.id);
                const isSelected =
                  field.value?.toString() === color.id.toString();

                return (
                  <button
                    key={color.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      if (!isDisabled) {
                        field.onChange(isSelected ? undefined : color.id);
                      }
                    }}
                    className={`
                      relative p-2 rounded-lg border-2 transition-all duration-200
                      ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : fieldState.error
                          ? "border-red-300 bg-red-50 hover:border-red-400"
                          : "border-gray-200 bg-white hover:border-blue-300"
                      }
                      ${
                        isDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer hover:shadow-sm"
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      {color.thumbnail && (
                        <Image
                          src={color.thumbnail}
                          alt={color.color_name}
                          width={50}
                          height={50}
                          className="object-cover"
                        />
                      )}

                      <div className="flex-1 text-left">
                        <span
                          className={`text-sm font-medium ${
                            fieldState.error ? "text-red-600" : "text-gray-700"
                          }`}
                        >
                          {color.color_name}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RadioColor;
