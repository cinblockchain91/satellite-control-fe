"use client";

import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import * as React from "react";

export interface ToasterProps {
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  maxToasts?: number;
  richColors?: boolean;
}

export const Toaster = ({
  position = "bottom-right",
  maxToasts = 5,
  richColors = true,
}: ToasterProps) => {
  return (
    <SonnerToaster
      position={position}
      toastOptions={{
        style: {
          fontFamily: "var(--st-font-family-sans)",
          fontSize: "var(--st-font-size-sm)",
          borderRadius: "var(--st-radius-md)",
          border: "0.5px solid",
        },
      }}
      richColors={richColors}
      expand={false}
      visibleToasts={maxToasts}
    />
  );
};

// Toast API — wrapper với semantic methods
export const toast = {
  default: (message: string, options?: Parameters<typeof sonnerToast>[1]) =>
    sonnerToast(message, options),

  success: (
    message: string,
    options?: Parameters<typeof sonnerToast.success>[1],
  ) => sonnerToast.success(message, options),

  error: (message: string, options?: Parameters<typeof sonnerToast.error>[1]) =>
    sonnerToast.error(message, options),

  warning: (
    message: string,
    options?: Parameters<typeof sonnerToast.warning>[1],
  ) => sonnerToast.warning(message, options),

  info: (message: string, options?: Parameters<typeof sonnerToast.info>[1]) =>
    sonnerToast.info(message, options),

  loading: (
    message: string,
    options?: Parameters<typeof sonnerToast.loading>[1],
  ) => sonnerToast.loading(message, options),

  promise: <T,>(
    promise: Promise<T>,
    options: Parameters<typeof sonnerToast.promise<T>>[1],
  ) => sonnerToast.promise(promise, options),

  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
};
