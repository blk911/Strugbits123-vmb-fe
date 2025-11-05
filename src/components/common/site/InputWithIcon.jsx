
import { twMerge } from "tailwind-merge";

export default function InputWithIcon({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  register,
  name,
  error,
  className,
}) {
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
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF92A5] text-md" />
        )}

        <input
          type={type}
          {...(register && name && register(name))}
          placeholder={placeholder}
          className={twMerge(
            `w-full border rounded-md py-4 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FF92A5] focus:border-none ${
              Icon ? "pl-10" : "pl-4"
            }`,
            error ? "border-red-500" : "border-gray-300",
            className
          )}
        />
      </div>

      {error?.message && (
        <p className="mt-1 text-xs text-red-600">{error.message}</p>
      )}
    </div>
  );
}