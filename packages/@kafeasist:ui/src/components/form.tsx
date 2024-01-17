"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import cn from "..";
import { FormFieldContextProvider } from "../context/FormField";
import { FormItemContextProvider } from "../context/FormItem";
import { useFormField } from "../hooks/use-form-field";
import { Label, LabelProps } from "./label";

export const Form = FormProvider;

export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContextProvider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContextProvider>
  );
}

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export function FormItem({ className, ...props }: FormItemProps) {
  const id = React.useId();

  return (
    <FormItemContextProvider value={{ id }}>
      <div className={cn(className)} {...props} />
    </FormItemContextProvider>
  );
}

export function FormLabel({ className, ...props }: LabelProps) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

interface FormControlProps
  extends React.ComponentPropsWithoutRef<typeof Slot> {}

export function FormControl({ ...props }: FormControlProps) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

interface FormDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function FormDescription({ className, ...props }: FormDescriptionProps) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      id={formDescriptionId}
      className={cn("mt-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function FormMessage({
  className,
  children,
  ...props
}: FormMessageProps) {
  const { error, formMessageId } = useFormField();

  return (
    <p
      id={formMessageId}
      className={cn(
        error ? "font-medium text-destructive" : "mt-1 text-xs",
        className,
      )}
      {...props}
    >
      {!error ? children : error.message}
    </p>
  );
}
