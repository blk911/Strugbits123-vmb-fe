import React from 'react'

function Button({ text, icon, classes, textClasses, onClick }) {
    return (
        <button onClick={onClick} className={`flex justify-center items-center py-[8px] px-[17px] rounded-[8px] cursor-pointer gap-x-[7px] bg-[#FF92A5] ${classes}`}>
            {icon && icon}
            <span
                className={`max-xl:text-[16px] text-[#FFFFFF]  xl:text-[18px] max-xl:leading-[20px] ${textClasses}`}
                style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                }}
            >
                {text}
            </span>
        </button>
    )
}

export default Button