import { Input } from "@headlessui/react";

export default function TextField({
  label,
  placeholder = "Select Service",
  classInput = "",
  type = "text",
  classes = "",
  icon,
  name,
  onChange,
  onBlur,
  ref,
  ...rest
}) {
  return (
    <div className={`flex flex-col gap-y-[8px] ${classes}`}>
      {label && (
        <label
          htmlFor={name}
          className="text-[14px] lg:text-[16px] font-poppins font-medium text-[#404040]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
          }}
        >
          {label}
        </label>
      )}

      {icon ? (
        <div className="relative w-full">
          <Input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            ref={ref}
            className={`border border-[#E5E5E5] h-12 px-3 rounded-md
              text-[12px] leading-[24px] font-poppins font-normal 
              placeholder:text-[#00000033] focus:outline-none pl-10 ${classInput}`}
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
            }}
            {...rest}
          />
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            {icon}
          </span>
        </div>
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          ref={ref}
          className={`border border-[#E5E5E5] h-12 px-3 rounded-md
            text-[12px] leading-[24px] font-poppins font-normal 
            placeholder:text-[#00000033] focus:outline-none ${classInput}`}
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
          }}
          {...rest}
        />
      )}
    </div>
  );
}
