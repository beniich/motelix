import { X } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
};

export function Modal({ open, onClose, title, description, children, size = 'md', footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'w-full bg-elevated border-2 border-black rounded-2xl glow-blue-strong',
          'max-h-[90vh] flex flex-col',
          SIZES[size]
        )}
      >
        <div className="flex items-start justify-between p-6 border-b border-black">
          <div>
            <h2 className="text-xl font-display font-bold text-primary">{title}</h2>
            {description && <p className="text-sm text-muted mt-1">{description}</p>}
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/5">
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">{children}</div>
        {footer && <div className="p-6 border-t border-black">{footer}</div>}
      </div>
    </div>
  );
}
