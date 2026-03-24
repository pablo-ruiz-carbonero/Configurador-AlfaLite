import { createContext, useCallback, type ReactNode } from "react";
import type { FC } from "react";
import { Toaster, toast } from "sonner";

export type ToastType = "success" | "error" | "info" | "loading";

export interface ToastContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showLoading: (message: string) => string | number;
  updateToast: (id: string | number, message: string, type: ToastType) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: FC<ToastProviderProps> = ({ children }) => {
  const showSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const showError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const showInfo = useCallback((message: string) => {
    toast.info(message);
  }, []);

  const showLoading = useCallback((message: string) => {
    return toast.loading(message);
  }, []);

  const updateToast = useCallback(
    (id: string | number, message: string, type: ToastType) => {
      if (type === "success") toast.success(message, { id });
      if (type === "error") toast.error(message, { id });
      if (type === "info") toast.info(message, { id });
    },
    [],
  );

  return (
    <ToastContext.Provider
      value={{ showSuccess, showError, showInfo, showLoading, updateToast }}
    >
      <Toaster position="bottom-right" richColors />
      {children}
    </ToastContext.Provider>
  );
};
