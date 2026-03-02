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
          "bg-[#0F3D3E] text-white hover:bg-white hover:text-[#0F3D3E]"
        : "bg-transparent text-[#581838] hover:bg-[#0F3D3E] hover:text-white"
      }
    `,

    pill: `
      rounded-full
      text-sm sm:text-[16px]
      font-semibold
      bg-[#0F3D3E] text-white
      hover:bg-white hover:text-[#0F3D3E]
      border border-[#0F3D3E]
    `,

    pillLight: `
      rounded-full
      text-sm sm:text-[16px]
      font-medium
      bg-white text-[#5C8374]
      hover:bg-[#0F3D3E] hover:text-white
      border border-[#5C8374]
    `,

    pillGreen: `
      rounded-full
      text-sm sm:text-[16px]
      font-medium
      bg-[#5C8374] text-white
      hover:bg-[#0F3D3E] hover:text-white
      border border-[#5C8374]
    `,

    pillOutline: `
      rounded-full
      text-sm sm:text-[16px]
      bg-white text-[#0F3D3E]
      hover:bg-[#0F3D3E] hover:text-white
      border border-[#0F3D3E]
    `,
  };

  const arrowStyles = {
    header: "bg-[#5C8374] text-white",

    pill: "bg-white text-[#5C8374] group-hover:bg-[#0F3D3E] group-hover:text-white",

    pillLight:
      "bg-[#5C8374] text-white group-hover:bg-white group-hover:text-[#0F3D3E]",

    pillGreen:
      "bg-white text-[#5C8374] group-hover:bg-white group-hover:text-[#0F3D3E]",

    pillOutline:
      "bg-[#0F3D3E] text-white group-hover:bg-white group-hover:text-[#0F3D3E]",
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
        <FaArrowRight className="w-[7px] h-[10px] sm:w-[9px] sm:h-[12px]" />
      </span>
    </button>
  );
}
