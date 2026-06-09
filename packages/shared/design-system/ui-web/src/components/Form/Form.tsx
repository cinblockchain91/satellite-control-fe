import * as React from "react";
import {
  useForm,
  FormProvider,
  useFormContext,
  useController,
  type UseFormProps,
  type FieldValues,
  type FieldPath,
  type Control,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z, type ZodType } from "zod";

// Form root
export interface FormProps<T extends FieldValues> extends Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  "onSubmit"
> {
  schema: ZodType<T>;
  defaultValues?: UseFormProps<T>["defaultValues"];
  onSubmit: (values: T) => void | Promise<void>;
}

export const Form = <T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
  ...props
}: FormProps<T>) => {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={["flex flex-col gap-[var(--st-spacing-4)]", className]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
};

// FormField
export interface FormFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control?: Control<T>;
  render: (props: {
    value: unknown;
    onChange: (...event: unknown[]) => void;
    onBlur: () => void;
    error?: string;
  }) => React.ReactNode;
}

export const FormField = <T extends FieldValues>({
  name,
  render,
}: FormFieldProps<T>) => {
  const { control } = useFormContext<T>();

  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <>
      {render({
        value: field.value,
        onChange: field.onChange,
        onBlur: field.onBlur,
        error: error?.message,
      })}
    </>
  );
};

// FormSection
export interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const FormSection = ({
  title,
  description,
  children,
}: FormSectionProps) => {
  return (
    <div className="flex flex-col gap-[var(--st-spacing-3)]">
      {(title || description) && (
        <div className="flex flex-col gap-[var(--st-spacing-1)]">
          {title && (
            <h3 className="text-[var(--st-font-size-base)] font-medium text-[var(--st-color-text-default)]">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)]">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="flex flex-col gap-[var(--st-spacing-3)]">{children}</div>
    </div>
  );
};

// FormActions
export const FormActions = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={[
        "flex items-center justify-end gap-[var(--st-spacing-3)]",
        "pt-[var(--st-spacing-2)] border-t border-[var(--st-color-text-muted)] border-opacity-20",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
};
