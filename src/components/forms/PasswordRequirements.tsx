import * as React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PASSWORD_REQUIREMENTS } from '@/lib/validations/auth.schema';

interface PasswordRequirementsProps {
  password: string;
  className?: string;
  showOnlyFailed?: boolean;
}

export function PasswordRequirements({ 
  password, 
  className,
  showOnlyFailed = false 
}: PasswordRequirementsProps) {
  const requirements = PASSWORD_REQUIREMENTS.map(req => ({
    ...req,
    met: req.test(password),
  }));
  
  const displayRequirements = showOnlyFailed 
    ? requirements.filter(r => !r.met)
    : requirements;
  
  if (displayRequirements.length === 0) return null;
  
  return (
    <ul className={cn('space-y-1', className)}>
      {displayRequirements.map((req) => (
        <li
          key={req.id}
          className={cn(
            'flex items-center gap-2 text-xs transition-colors',
            req.met ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {req.met ? (
            <Check className="h-3 w-3 shrink-0" />
          ) : (
            <X className="h-3 w-3 shrink-0" />
          )}
          <span>{req.label}</span>
        </li>
      ))}
    </ul>
  );
}
