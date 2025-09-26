import React, { useRef } from 'react'

function FileUploadButton({ text, icon, classes, textClasses, onChange }) {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={handleClick}
                className={`flex justify-center items-center py-[8px] px-[17px] rounded-[8px] cursor-pointer gap-x-[7px] bg-[#FF92A5] ${classes}`}
            >
                {icon && icon}
                <span
                    className={`max-xl:text-[16px] text-[#FFFFFF] xl:text-[18px] max-xl:leading-[20px] ${textClasses}`}
                    style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                    }}
                >
                    {text}
                </span>
            </button>

            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={onChange}
            />
        </>
    )
}

export default FileUploadButton
