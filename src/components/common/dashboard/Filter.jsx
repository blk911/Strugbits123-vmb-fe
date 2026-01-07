import React from "react";
import TextField from "./TextField";
import SelectField from "./SelectField";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../../../store/features/admin/listsSaloonSlice";

function Filter({ searchQuery }) {
  const dispatch = useDispatch();
  return (
    <div className="w-full flex items-center gap-x-[10px]">
      <TextField
        classes="w-full"
        value={searchQuery}
        classInput="bg-white !placeholder-[#6B7280] !text-[14px]"
        label={false}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        placeholder="Search (Owner,Salon,email,phone etc)"
      />

      <SelectField
        classes={"!bg-[#EFEFEF] text-[#6B7280]"}
        label={false}
        option={["Filter", "B", "C"]}
        icon={
          <svg
            width="17"
            height="10"
            viewBox="0 0 17 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_943_2709)">
              <path
                d="M8.50826 0.00158832C10.9982 0.00158832 13.4881 0.00158832 15.9781 0.00158832C16.2755 0.00158832 16.5564 0.0298642 16.767 0.266575C16.8735 0.381959 16.9469 0.522832 16.9798 0.674905C17.0126 0.826979 17.0038 0.984846 16.9541 1.1325C16.9045 1.28015 16.8158 1.41233 16.697 1.51565C16.5783 1.61896 16.4337 1.68972 16.278 1.72077C16.129 1.74561 15.9779 1.75509 15.8269 1.74905H1.1764C1.0662 1.75229 0.955896 1.74986 0.845952 1.74177C0.305667 1.68764 -0.015696 1.33783 4.02972e-07 0.831285C0.0156968 0.324741 0.356886 0.00643711 0.915347 0.00562923C3.44604 -0.000295263 5.97701 -0.00164322 8.50826 0.00158832Z"
                fill="#6B7280"
              />
              <path
                d="M8.50826 4.1251H13.2519C13.3897 4.12003 13.5277 4.12436 13.6649 4.13803C14.1259 4.20104 14.4911 4.5969 14.4811 5.01215C14.4712 5.42741 14.1218 5.79176 13.679 5.85801C13.5419 5.87334 13.4038 5.87847 13.2659 5.87336H3.73739C2.95588 5.87336 2.4982 5.54051 2.50894 4.98469C2.51968 4.42886 2.96331 4.12348 3.72252 4.12348L8.50826 4.1251Z"
                fill="#6B7280"
              />
              <path
                d="M8.47192 9.99755C7.92337 9.99755 7.37317 10.004 6.82462 9.99755C6.3149 9.99028 5.94067 9.65582 5.9068 9.20017C5.87293 8.74452 6.23725 8.28564 6.74614 8.27352C7.91263 8.24444 9.07967 8.24444 10.2473 8.27352C10.7537 8.28645 11.118 8.74371 11.0816 9.2034C11.0453 9.66308 10.6727 9.99028 10.1613 9.99836C9.59792 10.004 9.03533 9.99755 8.47192 9.99755Z"
                fill="#6B7280"
              />
            </g>
            <defs>
              <clipPath id="clip0_943_2709">
                <rect width="17" height="10" fill="white" />
              </clipPath>
            </defs>
          </svg>
        }
      />
    </div>
  );
}

export default Filter;
