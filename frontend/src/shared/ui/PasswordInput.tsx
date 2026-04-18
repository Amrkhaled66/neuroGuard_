import { useState, type ChangeEvent } from "react";

interface PasswordInputProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  notShowingIcon?: boolean;
}

const PasswordInput = ({
  label,
  name,
  placeholder,
  error,
  onChange,
  value,
  notShowingIcon,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="flex flex-col gap-y-3">
      <label className="text-start text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <input
          placeholder={placeholder || label}
          onChange={onChange}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full bg-white  text-sm px-2 py-3 border-0 border-b transition-colors focus:outline-none ${
            notShowingIcon ? "pe-2" : "pe-10"
          } ${
            error
              ? "border-red-500 hover:bg-red-500/5"
              : "border-gray-400/40 hover:bg-blue-500/5"
          }`}
          type={showPassword ? "text" : "password"}
          name={name}
        />

        {!notShowingIcon && (
          <div
            className="absolute inset-y-0 end-0 flex cursor-pointer items-center pe-2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9.76379 5.29519C10.4662 5.10724 11.2121 5 11.9997 5C15.7571 5 18.5637 7.4404 20.2324 9.43934C21.4845 10.9394 21.4844 13.0609 20.2322 14.5609C20.0403 14.7907 19.8334 15.0264 19.6117 15.2635M12.4998 9.04148C13.756 9.25224 14.7475 10.2437 14.9583 11.5M2.99976 3L20.9998 21M11.4998 14.9585C10.4156 14.7766 9.5286 14.0132 9.17047 13M4.3489 8.77822C4.14189 9.00124 3.94797 9.22274 3.76737 9.43907C2.51518 10.9391 2.51498 13.0606 3.76715 14.5607C5.4358 16.5596 8.24239 19 11.9998 19C12.8019 19 13.5606 18.8888 14.2742 18.6944"
                  stroke="#616161"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
                  stroke="#616161"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                  stroke="#616161"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        )}

        <span
          className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
            error ? "bg-red-500" : "bg-primary"
          } ${isFocused ? "w-full" : "w-0"}`}
        />
      </div>
      {error && <p className="mt-1 text-start text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default PasswordInput;