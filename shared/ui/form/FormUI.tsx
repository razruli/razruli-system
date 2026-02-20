import * as React from "react";

import { UseFormReturn, FieldValues } from "react-hook-form";

import { Form as ShadForm } from "../shadcn/form";

type FormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  children: React.ReactNode;
  className?: string;
};

export function FormUI<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: FormProps<T>) {
  return (
    <ShadForm {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={className ?? "space-y-6"}
        noValidate
      >
        {children}
      </form>
    </ShadForm>
  );
}
