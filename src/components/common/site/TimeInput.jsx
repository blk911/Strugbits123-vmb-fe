import { FaClock } from "react-icons/fa";
import { useFormContext } from "react-hook-form";

export default function TimeInput({ label, name }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const value = watch(name) || "";

  return (
    <div className="relative">
      <label className="block text-[#374151] text-[14px] font-semibold mb-1">
        {label}
      </label>

      <div className="relative">
        <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF92A5] pointer-events-none z-10" />

        <input
          type="time"
          {...register(name)}
          className="w-full bg-white border border-gray-300 rounded-md py-3 pl-10 pr-4 text-gray-700
                   focus:outline-none focus:ring-2 focus:ring-[#FF92A5] focus:border-[#FF92A5]
                   transition-all cursor-pointer
                   [&::-webkit-calendar-picker-indicator]:opacity-0
                   [&::-webkit-calendar-picker-indicator]:absolute
                   [&::-webkit-calendar-picker-indicator]:right-0
                   [&::-webkit-calendar-picker-indicator]:w-full
                   [&::-webkit-calendar-picker-indicator]:h-full"
          style={{ appearance: "none" }}
        />
      </div>

      {errors[name] && (
        <p className="text-xs text-red-600 mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
}
