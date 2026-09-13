import * as React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type AlertType = 'error' | 'success' | 'warning' | 'info';

interface FormAlertProps {
  type: AlertType;
  title?: string;
  message: string;
  className?: string;
}

const alertConfig: Record<AlertType, { icon: typeof AlertCircle; className: string }> = {
  error: {
    icon: AlertCircle,
    className: 'bg-destructive/10 border-destructive/20 text-destructive',
  },
  success: {
    icon: CheckCircle2,
    className: 'bg-primary/10 border-primary/20 text-primary',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400',
  },
  info: {
    icon: Info,
    className: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
  },
};

export function FormAlert({ type, title, message, className }: FormAlertProps) {
  const config = alertConfig[type];
  const Icon = config.icon;
  
  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 rounded-lg border p-4',
        config.className,
        className
      )}
    >
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="space-y-1">
        {title && <p className="font-medium">{title}</p>}
        <p className="text-sm opacity-90">{message}</p>
      </div>
    </div>
  );
}
