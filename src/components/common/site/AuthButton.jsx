import { FaArrowRightLong } from "react-icons/fa6";
import { useFormContext } from "react-hook-form";

export default function AuthButton({ text, onClick, disabled: forceDisabled }) {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  const disabled = isSubmitting || forceDisabled;

  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={disabled}
      className="group relative cursor-pointer flex items-center justify-between w-full bg-white hover:bg-[#FF92A5] border border-[#581838] text-[#4b0d23] font-semibold rounded-xl px-4 py-2 overflow-hidden disabled:opacity-50 transition-all "
    >
      <span
        className="text-[#581838] text-[18px] flex-1 text-center pl-2"
        style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
      >
        {disabled ? "Please wait..." : text}
      </span>

      <span className="flex items-center justify-center min-w-8 h-8 rounded-xl bg-[#4b0d23] overflow-hidden group-hover:scale-110 transition-transform">
        <FaArrowRightLong className="text-pink-400 inline-block group-hover:animate-arrow-marquee" />
      </span>

      {disabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
          <div className="w-5 h-5 border-2 border-t-transparent border-pink-500 rounded-full animate-spin"></div>
        </div>
      )}
    </button>
  );
}
