import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import './IconButton.css';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  circle?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, circle, ...props }, ref) => (
    <button
      className={`icon-button ${circle ? 'circle' : ''}`}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
);
