import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

export default function InputWithIcon({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  register,
  name,
  error,
  className,
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const fieldProps =
    register && name
      ? register(name, {
          onChange: (e) => {
            let value = e.target.value;

            if (value.startsWith(" ")) {
              value = value.trimStart();
              e.target.value = value;
            }

            const originalOnChange = register(name).onChange;
            if (originalOnChange) originalOnChange(e);
          },
        })
      : {};

  return (
    <div className="w-full">
      {label && (
        <label
          className="block text-[#374151] font-semibold mb-1 text-[14px]"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF92A5] text-md z-10" />
        )}

        <input
          type={isPassword && showPassword ? "text" : type}
          {...fieldProps}
          placeholder={placeholder}
          className={twMerge(
            `w-full border rounded-md py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#FF92A5] focus:border-none transition-all`,
            Icon ? "pl-10" : "pl-4",
            error ? "border-red-500" : "border-gray-300",
            className
          )}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-[#FF92A5] hover:text-[#ff7a8a] transition-colors z-10"
            tabIndex={-1}
          >
            {showPassword ? (
              <FaEye className="w-5 h-5" />
            ) : (
              <FaEyeSlash className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {error?.message && (
        <p className="mt-1 text-xs text-red-600">{error.message}</p>
      )}
    </div>
  );
}
