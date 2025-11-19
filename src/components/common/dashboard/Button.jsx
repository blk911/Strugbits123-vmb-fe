import React from 'react'
import { FaArrowRightLong } from 'react-icons/fa6'

function Button({ text, icon, classes, textClasses, onClick }) {
    return (
        <button onClick={onClick} className={`flex justify-center items-center py-[8px] px-[17px] rounded-[8px] cursor-pointer gap-x-[7px] bg-[#FF92A5] ${classes}`}>
           
            <span
                className={`max-xl:text-[16px] text-[#FFFFFF]  xl:text-[18px] max-xl:leading-[20px] ${textClasses}`}
                style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                }}
            >
                {text}
            </span>
              <span className="flex  items-center justify-center min-w-8 h-8 rounded-xl bg-[#4b0d23]">
                            <FaArrowRightLong className="text-pink-400 group-hover:translate-x-[4px] transition-transform duration-300" />
                          </span>
             {/* {icon && icon} */}
        </button>
    )
}

export default Button