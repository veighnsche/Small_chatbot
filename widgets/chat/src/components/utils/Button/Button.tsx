import React, { ButtonHTMLAttributes } from "react";
import "./Button.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const ButtonPrimary: React.FC<ButtonProps> = ({ className = "", ...props }) => (
  <button className={`primary-button ${className}`} {...props} />
);

export const ButtonSecondary: React.FC<ButtonProps> = ({ className = "", ...props }) => (
  <button className={`secondary-button ${className}`} {...props} />
);
