import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import './IconButton.css';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  circle?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className = '', children, circle, ...props }, ref) => (
    <button
      className={`icon-button ${circle ? 'circle' : ''} ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
);
