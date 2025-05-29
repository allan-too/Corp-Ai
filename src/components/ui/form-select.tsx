import * as React from "react";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import { FormControl } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
}

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  field,
  options,
  placeholder = "Select an option",
  className,
}: FormSelectProps<TFieldValues, TName>) {
  return (
    <FormControl>
      <div className="relative">
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
        >
          <SelectTrigger className={className}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FormControl>
  );
}
