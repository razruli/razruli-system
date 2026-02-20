import { Controller, useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/form";

type FormFieldProps = {
  name: string;
  label?: string;
  description?: string;
  render: (field: any) => React.ReactNode;
};

export function FormFieldUI({
  name,
  label,
  description,
  render,
}: FormFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>{render(field)}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
