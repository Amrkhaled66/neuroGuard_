import React from "react";

type ButtonVariant = "primary" | "outline" | "danger" | "ghost";

interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
  type?: "submit" | "reset" | "button";
  isLoading?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-primary border-brand-primary text-white hover:bg-transparent hover:text-brand-primary",

  outline:
    "bg-transparent border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white",

  danger:
    "bg-red-600 border-red-600 text-white hover:bg-transparent hover:text-red-600",

  ghost:
    "bg-transparent border-transparent text-brand-primary hover:bg-brand-primary/10",
};

const Button = ({
  className = "",
  children,
  type = "button",
  isLoading = false,
  onClick,
  disabled = false,
  variant = "primary",
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={`
        px-3 py-2 rounded-lg border font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed!
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {isLoading ? (
        <span className="inline-block size-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
