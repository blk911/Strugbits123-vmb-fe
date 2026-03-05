import clsx from "clsx";

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
  rightIcon = null,
  ...props
}) {
  const baseClasses =
    "rounded-[8px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  let variantClasses = "";
  switch (variant) {
    case "primary":
      variantClasses = "bg-vmb-secondary text-white hover:opacity-90 border-none";
      break;
    case "primary-bordered":
      variantClasses =
        "bg-vmb-secondary text-white hover:opacity-90 border border-gray-200";
      break;
    case "outline-dark":
      variantClasses =
        "border border-vmb-primary bg-transparent text-vmb-primary hover:bg-vmb-primary/10";
      break;
    case "outline-pink":
      variantClasses =
        "border border-vmb-secondary bg-transparent text-vmb-secondary hover:bg-vmb-secondary/5";
      break;
    case "ghost-pink":
      variantClasses = "bg-vmb-secondary/30 text-vmb-primary hover:bg-vmb-secondary/40";
      break;
    case "ghost-pink-light":
      variantClasses = "bg-vmb-secondary/30 text-vmb-secondary hover:bg-vmb-secondary/20";
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
      {rightIcon && <span>{rightIcon}</span>}
    </button>
  );
}
