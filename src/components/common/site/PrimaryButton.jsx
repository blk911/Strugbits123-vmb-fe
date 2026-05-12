import { FaArrowRight } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setAuthMode, setAuthType } from "../../../store/features/authSlice";

export default function PrimaryButton({
  text,
  onClick,
  variant = "header",
  isActive = false,
  className = "",
  authType = null,
  authMode = null,
}) {
  const dispatch = useDispatch();
  const handleClick = () => {
    if (authType) {
      dispatch(setAuthType(authType));
    }
    if (authMode) {
      dispatch(setAuthMode(authMode));
    }

    if (onClick) {
      onClick();
    }
  };

  const variants = {
    header: `
      h-[34px] sm:h-[40px]
      px-3 sm:px-[16px]
      rounded-none
      text-[11px] sm:text-[13px]
      font-semibold uppercase tracking-[0.08em]
      ${
        isActive ?
          "bg-vmb-primary text-white "
        : "bg-[#f5eee9] text-vmb-primary hover:bg-[#efe3dc]"
      }
    `,

    pill: `
      rounded-[4px]
      text-sm sm:text-[16px]
      font-semibold
      bg-vmb-primary text-white
      hover:bg-white hover:text-vmb-primary
      border border-vmb-primary
    `,

    pillLight: `
      rounded-[4px]
      text-sm sm:text-[16px]
      font-medium
      bg-white text-vmb-secondary
      hover:bg-vmb-primary hover:text-white
      border border-vmb-secondary
    `,

    pillGreen: `
      rounded-[4px]
      text-sm sm:text-[16px]
      font-semibold
      bg-vmb-secondary text-white
     
      border border-vmb-secondary
    `,

    pillOutline: `
      rounded-[4px]
      text-sm sm:text-[16px]
      bg-white text-vmb-primary
      hover:bg-vmb-primary hover:text-white
      border border-vmb-primary
    `,

    gold: `
      h-[40px]
      rounded-[4px]
      px-4
      text-[12px] sm:text-[13px]
      font-semibold uppercase tracking-[0.08em]
      bg-vmb-secondary text-white
      hover:brightness-95
      border border-vmb-secondary
    `,
  };

  const arrowStyles = {
    header: "hidden",

    pill: "bg-white text-vmb-secondary group-hover:bg-vmb-primary group-hover:text-white",

    pillLight:
      "bg-vmb-secondary text-white group-hover:bg-white group-hover:text-vmb-primary",

    pillGreen: "bg-white text-vmb-secondary ",

    pillOutline:
      "bg-vmb-primary text-white group-hover:bg-white group-hover:text-vmb-primary",

    gold: "hidden",
  };

  return (
    <button
      onClick={handleClick}
      className={`
        group cursor-pointer
        flex items-center justify-center gap-2
        transition-all duration-300
        whitespace-nowrap
        font-poppins
        ${variants[variant]}
        ${className}
      `}
    >
      <span>{text}</span>

      {/* Arrow */}
      {arrowStyles[variant] !== "hidden" && (
        <span
          className={`
            flex items-center justify-center
            w-[22px] h-[22px] sm:w-[29px] sm:h-[29px]
            rounded-[4px]
            transition-all duration-300
            ${arrowStyles[variant]}
          `}
        >
          <FaArrowRight className="w-[7px] h-[10px]  sm:w-[9px] sm:h-[12px]" />
        </span>
      )}
    </button>
  );
}
