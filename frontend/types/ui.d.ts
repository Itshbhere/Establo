import { ToastProps, ToastActionElement } from "@/components/ui/toast";
import * as React from "react";

declare module "@/components/ui/use-toast" {
  export type ToasterToast = ToastProps & {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: ToastActionElement;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  };

  export interface ToastOptions extends Omit<ToasterToast, "id"> {
    variant?: "default" | "destructive";
  }

  export interface State {
    toasts: ToasterToast[];
  }

  export interface Toast {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  }

  export function toast(props: ToastOptions): Toast;
  
  export function useToast(): {
    toasts: ToasterToast[];
    toast: typeof toast;
    dismiss: (toastId?: string) => void;
  };
} 