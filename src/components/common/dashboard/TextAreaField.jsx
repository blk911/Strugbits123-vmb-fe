import { Textarea } from "@headlessui/react";

export default function TextAreaField({
  label = "Service Description",
  name = "description",
  placeholder = "Enter description",
  classes,
  ...rest
}) {
  return (
    <div className="flex flex-col gap-y-[8px]">
      <label
        htmlFor={name}
        className="text-[14px] lg:text-[16px] font-poppins font-medium text-vmb-text-main"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          fontStyle: "normal",
          lineHeight: "20px",
        }}
      >
        {label}
      </label>

      <Textarea
        id={name}
        name={name}
        placeholder={placeholder}
        rows={4}
        className={`border border-vmb-primary/10 h-28 px-3 py-2 rounded-md
                   text-[12px] leading-[24px] font-poppins font-normal
                   placeholder:text-vmb-text-muted/50 focus:outline-none resize-none ${classes}`}
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 400,
          fontStyle: "normal",
          letterSpacing: "0%",
        }}
        {...rest}
      />
    </div>
  );
}
