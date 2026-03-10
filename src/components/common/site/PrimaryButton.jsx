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
      h-[32px] sm:h-[39px]
      px-2 sm:px-[10px]
      rounded-[8px] sm:rounded-[10px]
      text-[12px] sm:text-[16px]
      font-normal
      ${
        isActive ?
          "bg-vmb-primary text-white "
        : "bg-transparent text-vmb-primary"
      }
    `,

    pill: `
      rounded-full
      text-sm sm:text-[16px]
      font-semibold
      bg-vmb-primary text-white
      hover:bg-white hover:text-vmb-primary
      border border-vmb-primary
    `,

    pillLight: `
      rounded-full
      text-sm sm:text-[16px]
      font-medium
      bg-white text-vmb-secondary
      hover:bg-vmb-primary hover:text-white
      border border-vmb-secondary
    `,

    pillGreen: `
      rounded-full
      text-sm sm:text-[16px]
      font-medium
      bg-vmb-secondary text-white
      hover:bg-vmb-primary hover:text-white
      border border-vmb-secondary
    `,

    pillOutline: `
      rounded-full
      text-sm sm:text-[16px]
      bg-white text-vmb-primary
      hover:bg-vmb-primary hover:text-white
      border border-vmb-primary
    `,
  };

  const arrowStyles = {
    header: "bg-vmb-secondary text-white",

    pill: "bg-white text-vmb-secondary group-hover:bg-vmb-primary group-hover:text-white",

    pillLight:
      "bg-vmb-secondary text-white group-hover:bg-white group-hover:text-vmb-primary",

    pillGreen:
      "bg-white text-vmb-secondary group-hover:bg-white group-hover:text-vmb-primary",

    pillOutline:
      "bg-vmb-primary text-white group-hover:bg-white group-hover:text-vmb-primary",
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
      <span
        className={`
          flex items-center justify-center
          w-[22px] h-[22px] sm:w-[29px] sm:h-[29px]
          rounded-full
          transition-all duration-300
          ${arrowStyles[variant]}
        `}
      >
        <FaArrowRight className="w-[7px] h-[10px]  sm:w-[9px] sm:h-[12px]" />
      </span>
    </button>
  );
}
