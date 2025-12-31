

// import { FaClock } from "react-icons/fa";
// import { Popover, Transition } from "@headlessui/react";
// import { Fragment, useEffect, useState } from "react";

// const hours12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
// const minutes = ["00", "30"];

// export default function TimeInput({
//   label,
//   value: externalValue = "",  
//   onChange: externalOnChange,
//   error,
// }) {
//   const hourRecieved=externalValue.split(":")[0];
//   const minutesRecieved=externalValue.split(":")[1];
//   const amOrPm= +(hourRecieved) > 12 ? "PM":"AM" ;
// const convertedRecievedHour = +(hourRecieved) > 12 ? hourRecieved - 12 : hourRecieved ;
//   const [hour12, setHour12] = useState(convertedRecievedHour || "12");
//   const [minute, setMinute] = useState(minutesRecieved || "00");
//   const [ampm, setAmpm] = useState(amOrPm||"AM");


//   useEffect(() => {
//     const hourNum = parseInt(hour12, 10);
//     const displayHour = hourNum === 12 ? 12 : hourNum % 12;
//     if (displayHour === 0) displayHour = 12;

//     const newTime12 = `${displayHour}:${minute} ${ampm}`;

//     if (newTime12 !== externalValue?.trim()) {
//       externalOnChange({ target: { value: newTime12 } });
//     }
//   }, [hour12, minute, ampm]);

//   const displayTime =
//     hour12 === "12" && minute === "00" && ampm === "AM" && !externalValue
//       ? "Select time"
//       : `${parseInt(hour12, 10)}:${minute} ${ampm}`;

//   return (
//     <div className="relative w-full">
//       <label className="block text-[#374151] text-[14px] font-semibold mb-1">
//         {label}
//       </label>

//       <Popover className="relative">
//         {({ open }) => (
//           <>
//             <Popover.Button
//               className={`
//                 w-full bg-white border border-gray-300 rounded-md 
//                 py-3 pl-10 pr-4 text-left text-gray-700
//                 focus:outline-none focus:ring-2 focus:ring-[#FF92A5] focus:border-[#FF92A5]
//                 transition-all cursor-pointer
//                 ${open ? "ring-2 ring-[#FF92A5] border-[#FF92A5]" : ""}
//               `}
//             >
//               <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF92A5] pointer-events-none z-10" />
//               <span className={externalValue ? "text-gray-900" : "text-gray-500"}>
//                 {displayTime}
//               </span>
//             </Popover.Button>

//             <Transition
//               as={Fragment}
//               enter="transition ease-out duration-200"
//               enterFrom="opacity-0 translate-y-1"
//               enterTo="opacity-100 translate-y-0"
//               leave="transition ease-in duration-150"
//               leaveFrom="opacity-100 translate-y-0"
//               leaveTo="opacity-0 translate-y-1"
//             >
//               <Popover.Panel className="absolute z-50 mt-2 w-full min-w-[200px] sm:min-w-[280px] bg-white border border-gray-300 rounded-lg shadow-xl p-4">
//                 <div className="flex gap-3 justify-between">
//                   <select
//                     value={hour12}
//                     onChange={(e) => setHour12(e.target.value)}
//                     className="flex-1 bg-gray-50 border border-gray-300 rounded-md px-1 sm:px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-[#FF92A5]"
//                   >
//                     {hours12.map((h) => (
//                       <option key={h} value={h}>
//                         {parseInt(h, 10)}
//                       </option>
//                     ))}
//                   </select>

//                   <select
//                     value={minute}
//                     onChange={(e) => setMinute(e.target.value)}
//                     className="flex-1 bg-gray-50 border border-gray-300 rounded-md px-1 sm:px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-[#FF92A5]"
//                   >
//                     {minutes.map((m) => (
//                       <option key={m} value={m}>{m}</option>
//                     ))}
//                   </select>

//                   <select
//                     value={ampm}
//                     onChange={(e) => setAmpm(e.target.value)}
//                     className="flex-1 bg-gray-50 border border-gray-300 rounded-md px-1 sm:px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-[#FF92A5]"
//                   >
//                     <option value="AM">AM</option>
//                     <option value="PM">PM</option>
//                   </select>
//                 </div>
//               </Popover.Panel>
//             </Transition>
//           </>
//         )}
//       </Popover>

//       {error?.message && (
//         <p className="text-xs text-red-600 mt-1">
//           {error.message}
//         </p>
//       )}
//     </div>
//   );
// }
import { FaClock } from "react-icons/fa";
import { useFormContext } from "react-hook-form";

export default function TimeInput({ label, name }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const value = watch(name) || "";

  return (
    <div className="relative">
      <label className="block text-[#374151] text-[14px] font-semibold mb-1">
        {label}
      </label>

      <div className="relative">
        <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF92A5] pointer-events-none z-10" />

        <input
          type="time"
          {...register(name)}
          className="w-full bg-white border border-gray-300 rounded-md py-3 pl-10 pr-4 text-gray-700
                   focus:outline-none focus:ring-2 focus:ring-[#FF92A5] focus:border-[#FF92A5]
                   transition-all cursor-pointer
                   [&::-webkit-calendar-picker-indicator]:opacity-0
                   [&::-webkit-calendar-picker-indicator]:absolute
                   [&::-webkit-calendar-picker-indicator]:right-0
                   [&::-webkit-calendar-picker-indicator]:w-full
                   [&::-webkit-calendar-picker-indicator]:h-full"
          style={{ appearance: "none" }}
        />
      </div>

      {errors[name] && (
        <p className="text-xs text-red-600 mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
}