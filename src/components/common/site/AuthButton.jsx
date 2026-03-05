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
      className="group relative cursor-pointer flex items-center justify-between w-full bg-white hover:bg-vmb-secondary border border-vmb-primary text-vmb-primary font-semibold rounded-xl px-4 py-2 overflow-hidden disabled:opacity-50 transition-all "
    >
      <span className="text-vmb-primary text-[18px] flex-1 text-center pl-2 font-poppins font-medium">
        {disabled ? "Please wait..." : text}
      </span>

      <span className="flex items-center justify-center min-w-8 h-8 rounded-xl bg-vmb-primary overflow-hidden group-hover:scale-110 transition-transform">
        <FaArrowRightLong className="text-vmb-secondary inline-block group-hover:animate-arrow-marquee" />
      </span>

      {disabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
          <div className="w-5 h-5 border-2 border-t-transparent border-vmb-secondary rounded-full animate-spin"></div>
        </div>
      )}
    </button>
  );
}
