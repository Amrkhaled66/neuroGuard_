import React, { useState } from "react";

type FormInputProps = {
  label: string;
  name?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  error?: string;
  min?: string|number;
};

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  required,
  className = "",
  error,
  min,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <label className="flex flex-col gap-1">
      <span className="text-start text-sm font-medium">{label}</span>
      <div className="relative w-full">
        <input
          name={name}
          type={type}
          {...props}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          min={type === "number" ? min : undefined}
          onBlur={handleBlur}
          onFocus={handleFocus}
          required={required}
          // {...(type === "number" && { min })}
          className={`w-full border-0 border-b px-2 py-3 text-sm transition-colors focus:outline-none ${
            error
              ? "border-red-500 hover:bg-red-500/5"
              : "border-gray-400/40 hover:bg-blue-500/5"
          } ${className}`}
        />
        <span
          className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
            error ? "bg-red-500" : "bg-primary"
          } ${isFocused ? "w-full" : "w-0"}`}
        />
      </div>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </label>
  );
};

export default FormInput;
