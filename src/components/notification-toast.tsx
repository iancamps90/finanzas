'use client';

import { toast } from 'sonner';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToastProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const notificationToast = {
  success: ({ title, description, action }: ToastProps) => {
    toast.success(title, {
      description,
      action: action ? (
        <Button
          variant="outline"
          size="sm"
          onClick={action.onClick}
          className="ml-2"
        >
          {action.label}
        </Button>
      ) : undefined,
      icon: <CheckCircle className="h-4 w-4 text-success" />,
      className: 'border-success/20 bg-success/5',
    });
  },

  error: ({ title, description, action }: ToastProps) => {
    toast.error(title, {
      description,
      action: action ? (
        <Button
          variant="outline"
          size="sm"
          onClick={action.onClick}
          className="ml-2"
        >
          {action.label}
        </Button>
      ) : undefined,
      icon: <XCircle className="h-4 w-4 text-destructive" />,
      className: 'border-destructive/20 bg-destructive/5',
    });
  },

  warning: ({ title, description, action }: ToastProps) => {
    toast.warning(title, {
      description,
      action: action ? (
        <Button
          variant="outline"
          size="sm"
          onClick={action.onClick}
          className="ml-2"
        >
          {action.label}
        </Button>
      ) : undefined,
      icon: <AlertCircle className="h-4 w-4 text-warning" />,
      className: 'border-warning/20 bg-warning/5',
    });
  },

  info: ({ title, description, action }: ToastProps) => {
    toast.info(title, {
      description,
      action: action ? (
        <Button
          variant="outline"
          size="sm"
          onClick={action.onClick}
          className="ml-2"
        >
          {action.label}
        </Button>
      ) : undefined,
      icon: <Info className="h-4 w-4 text-info" />,
      className: 'border-info/20 bg-info/5',
    });
  },

  loading: (title: string) => {
    return toast.loading(title, {
      className: 'border-primary/20 bg-primary/5',
    });
  },

  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId);
  },

  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  },
};

// Hook para usar las notificaciones
export function useNotification() {
  return notificationToast;
}

// Función simple para mostrar notificaciones
export const showNotification = {
  success: (title: string, description?: string) => {
    notificationToast.success({ title, description });
  },
  error: (title: string, description?: string) => {
    notificationToast.error({ title, description });
  },
  warning: (title: string, description?: string) => {
    notificationToast.warning({ title, description });
  },
  info: (title: string, description?: string) => {
    notificationToast.info({ title, description });
  },
};

