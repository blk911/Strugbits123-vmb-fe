import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthMode, setAuthType } from "../../../store/features/authSlice";
export default function Button({ text, classes, textclass, navigateTo, type }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <button
      onClick={() => {
        if (!navigateTo) return;
        dispatch(setAuthType(type));
        dispatch(setAuthMode("signup"));
        navigate(navigateTo);
      }}
      className={`animated-btn flex items-center gap-2 pl-[15px] pr-[5px] py-[8px]
        rounded-full border-2 border-vmb-primary text-vmb-primary
        font-medium text-lg relative  overflow-hidden
      after:content-[''] after:absolute after:h-1 after:w-1 after:bg-vmb-secondary 
       after:left-1/2 after:bottom-0 after:-translate-x-1/2 after:translate-y-full 
        after:rounded-md after:z-0 after:transition-all after:duration-700
        hover:after:scale-[400]
        cursor-pointer
        ${classes}`}
    >
      <span className={`max-sm:text-[14px] relative z-10 ${textclass}`}>
        {text}
      </span>
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-vmb-primary relative z-10">
        <svg
          width="13"
          height="9"
          viewBox="0 0 13 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.13952 5.44914C7.8215 5.44914 6.50349 5.44914 5.18547 5.44914C4.00997 5.44914 2.83448 5.45871 1.65898 5.44315C0.998083 5.43477 0.589435 5.12355 0.511237 4.62799C0.419165 4.04625 0.900967 3.59737 1.66025 3.59498C3.88511 3.5866 6.11123 3.59139 8.3361 3.59139C8.56186 3.59139 8.78763 3.59139 9.17862 3.59139C8.60601 3.02281 8.13556 2.55718 7.66763 2.09154C7.50871 1.93354 7.3397 1.78152 7.1934 1.61274C6.77844 1.13873 6.76709 0.63 7.15177 0.269702C7.55159 -0.10496 8.14817 -0.0989746 8.60979 0.348705C9.62258 1.33144 10.6265 2.32256 11.6002 3.33882C12.8047 4.59567 12.7972 4.63278 11.5939 5.86569C10.7237 6.75746 9.83826 7.63487 8.95033 8.50988C8.37394 9.07845 7.80889 9.15027 7.36114 8.73611C6.9134 8.32195 6.94871 7.7833 7.54781 7.2219C8.11412 6.69163 8.74349 6.2236 9.34511 5.72684C9.277 5.63467 9.20889 5.54131 9.14078 5.44914L9.13952 5.44914Z"
            fill="var(--vmb-secondary)"
          />
        </svg>
      </span>
    </button>
  );
}
