import { type InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="mb-2 block text-sm font-medium text-neutral-300">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={clsx(
                        'w-full rounded-lg bg-white/5 py-3 px-4 text-white placeholder-neutral-500 transition-all',
                        'border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
