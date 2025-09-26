import React from 'react'
import { useDispatch } from 'react-redux'
import {setNext} from '../../../store/features/authSlice'

function PrevButton({classes}) {

    const dispatch = useDispatch();

    return (
        <span onClick={()=>{dispatch(setNext())}}  className={`relative flex items-center  justify-center min-w-8 h-8 rounded-full bg-[#4b0d23] overflow-hidden ${classes}`}>
            {/* First arrow (default, slides out right) */}
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.06728 3.9454C5.53174 3.9454 6.99621 3.9454 8.46067 3.9454C9.76678 3.9454 11.0729 3.93476 12.379 3.95205C13.1133 3.96136 13.5674 4.30716 13.6543 4.85779C13.7566 5.50417 13.2212 6.00292 12.3776 6.00558C9.90551 6.01489 7.43204 6.00957 4.95997 6.00957C4.70912 6.00957 4.45827 6.00957 4.02383 6.00957C4.66007 6.64132 5.18279 7.1587 5.70271 7.67607C5.87929 7.85163 6.06708 8.02054 6.22964 8.20807C6.6907 8.73475 6.70331 9.3 6.27589 9.70033C5.83164 10.1166 5.16878 10.11 4.65587 9.61255C3.53054 8.52062 2.41502 7.41938 1.33314 6.2902C-0.00519498 4.8937 0.00321357 4.85247 1.34015 3.48256C2.30712 2.49171 3.2909 1.51682 4.27749 0.544583C4.91793 -0.087169 5.54575 -0.166969 6.04325 0.293212C6.54075 0.753394 6.50151 1.3519 5.83585 1.97567C5.20662 2.56486 4.50732 3.08489 3.83885 3.63684C3.91452 3.73925 3.9902 3.84299 4.06587 3.9454L4.06728 3.9454Z" fill="#FF92A5" />
            </svg>


            {/* Second arrow (starts left, slides in) */}

        </span>
    )
}

export default PrevButton