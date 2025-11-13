import React from "react";
import clsx from "clsx";
import { FaGift, FaCheck, FaTimes, FaRegCalendarAlt } from "react-icons/fa";

export default function AppButton({
  variant = "primary",
  size = "md",
  fullWidth = true,
  fontWeight = "medium",
  leftIcon = null,
  children,
  onClick,
  disabled = false,
  className = "",
  ...props
}) {
  const baseClasses =
    "rounded-[8px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  let variantClasses = "";
  switch (variant) {
    case "primary":
      variantClasses = "bg-[#FF92A5] text-white hover:opacity-90 border-none";
      break;
    case "primary-bordered":
      variantClasses =
        "bg-[#FF92A5] text-white hover:opacity-90 border border-[#E5E7EB]";
      break;
    case "outline-dark":
      variantClasses =
        "border border-[#581838] bg-transparent text-[#581838] hover:bg-[#581838]/10";
      break;
    case "outline-pink":
      variantClasses =
        "border border-[#FF92A5] bg-transparent text-[#FF92A5] hover:bg-[#FF92A50D]";
      break;
    case "ghost-pink":
      variantClasses = "bg-[#FF92A54D] text-[#581838] hover:bg-[#FF92A566]";
      break;
    case "ghost-pink-light":
      variantClasses = "bg-[#FF92A54D] text-[#FF92A5] hover:bg-[#FF92A533]";
      break;
    default:
      variantClasses = "";
  }

  let sizeClasses = "";
  switch (size) {
    case "xs":
      sizeClasses = "text-[12px] px-[10px] py-[5px]";
      break;
    case "sm":
      sizeClasses = "text-[14px] px-5 py-[15px]";
      break;
    case "md":
      sizeClasses = "text-[14px] px-[20px] py-[12px]";
      break;
    case "lg":
      sizeClasses = "text-[16px] px-[20px] py-[15px]";
      break;
    case "custom":
      sizeClasses = "";
      break;
    default:
      sizeClasses = "text-[14px] px-[20px] py-[12px]";
  }

  const widthClass = fullWidth ? "w-full" : "w-fit";
  const flexClasses =
    leftIcon || typeof children !== "string"
      ? "flex items-center justify-center gap-2"
      : "";
  const fontClass = `font-${fontWeight}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseClasses,
        variantClasses,
        sizeClasses,
        widthClass,
        flexClasses,
        fontClass,
        className
      )}
      {...props}
    >
      {leftIcon && <span>{leftIcon}</span>}
      {children}
    </button>
  );
}

//   const base =
//     "flex items-center justify-center gap-2 rounded-[8px] font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

//   const variants = {
//     primary: "bg-[#FF92A5] text-white hover:opacity-90 border border-[#E5E7EB]",
//     outline:
//       "border border-[#581838] text-[#581838] bg-transparent hover:bg-[#581838]/10",
//     pinkOutline:
//       "border border-[#FF92A5] text-[#FF92A5] bg-transparent hover:bg-[#FF92A50D]",
//     soft: "bg-[#FF92A54D] text-[#581838] hover:bg-[#FF92A566] border border-transparent",
//     decline:
//       "border border-[#581838] bg-white text-[#581838] hover:bg-[#581838]/10",
//     confirm: "border border-[#FF92A5] bg-[#FF92A5] text-white hover:opacity-90",
//     gift: "bg-[#FF92A54D] text-[#581838] hover:bg-[#FF92A566] border border-transparent",
//   };

//   const sizes = {
//     sm: "text-[12px] px-[10px] py-[5px]",
//     md: "text-[14px] px-[20px] py-[12px]",
//     lg: "text-[16px] px-[20px] py-[15px]",
//   };

//   const icons = {
//     gift: <FaGift className="text-[18px]" />,
//     check: <FaCheck className="text-[14px]" />,
//     times: <FaTimes className="text-[14px]" />,
//     calendar: <FaRegCalendarAlt className="text-[18px]" />,
//   };

//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={`${base} ${variants[variant]} ${
//         fullWidth ? "w-full" : "w-fit"
//       } ${sizes.lg} ${className}`}
//     >
//       {icon && icons[icon]}
//       <span>{label}</span>
//     </button>
//   );
// }
