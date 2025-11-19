import React, { useRef } from "react";

export default function FileUploadButton({
  text,
  icon,
  classes,
  textClasses,
  onChange,
}) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`flex justify-center items-center py-[8px] px-[17px] rounded-[8px] cursor-pointer gap-x-[7px] bg-[#FF92A5] ${classes}`}
      >
        {icon && <span>{icon}</span>}
        <span
          className={`text-[#FFFFFF] ${textClasses}`}
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}
        >
          {text}
        </span>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={onChange}
      />
    </>
  );
}
