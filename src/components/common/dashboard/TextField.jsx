import { Input } from "@headlessui/react";

export default function TextField({
  label = "Service Name",
  name = "full_name",
  placeholder = "Select Service",
  classInput = '',
  onChange,
  type = "text",
  classes = '',
  // value = "",
  icon = ""
}) {
  return (
    <div className={`flex flex-col gap-y-[8px] ${classes}`}>
      {/* Label */}
      {label && <label
        htmlFor={name}
        className="text-[14px] lg:text-[16px] font-poppins font-medium text-[#404040]"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          fontStyle: "medium",
          lineHeight: "20px",
        }}
      >
        {label}
      </label>
      }
      {/* Input */}

      {icon ?
        <div className="relative w-full">
          <Input
            id={name}
            name={name}
            type={type}
            onChange={onChange && ((e) => onChange(e))}
            placeholder={placeholder}
            className={`border border-[#E5E5E5] h-12 px-3 rounded-md
                   text-[12px] leading-[24px] font-poppins font-normal 
                   placeholder:text-[#00000033] focus:outline-none ${classInput}`}
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              letterSpacing: "0%",
            }}
          />
          <span className="absolute inset-y-0 left-3 flex items-center">
            {icon}
          </span>
        </div>

        : <Input
          id={name}
          name={name}
          type={type}
          onChange={onChange && ((e) => onChange(e))}
          placeholder={placeholder}
          className={`border border-[#E5E5E5] h-12 px-3 rounded-md
                   text-[12px] leading-[24px] font-poppins font-normal 
                   placeholder:text-[#00000033] focus:outline-none ${classInput}`}
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            fontStyle: "normal",
            letterSpacing: "0%",
          }}
        />}

    </div>
  );
}
