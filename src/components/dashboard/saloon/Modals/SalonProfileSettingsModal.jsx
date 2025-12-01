// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment, useRef, useState, useEffect, use } from "react";
// import { IoClose, IoCamera } from "react-icons/io5";
// import { FaClock, FaCalendarAlt, FaFileAlt } from "react-icons/fa";
// import { RiArrowDropDownLine } from "react-icons/ri";
// import defaultSalonImg from "../../../../assets/salon-1.png";
// import uploadIcon from "../../../../assets/upload_photos.png";
// import AppButton from "../../../common/site/AppButton";
// import CustomCheckbox from "../../../common/site/CustomCheckbox";
// import { useUser } from "../../../../hooks/useUser";
// import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";
// import { useUpdateMeMutation } from "../../../../store/api";

// const days = [
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
//   "Sunday",
// ];

// export default function SalonProfileSettingsModal({ isOpen, closeModal }) {
//   const { user, loading } = useUser();
//     const [updateMe, { isLoading }] =
//       useUpdateMeMutation();
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <LoadingIndicator />
//       </div>
//     );
//   }

//   if (!user) return null;
//   console.log("User===>", user);
//   const logoRef = useRef();
//   const docRef = useRef();
//   const photosRef = useRef();
//   const [fullName, setFullName] = useState(user.name || "");
//   const [email, setEmail] = useState(user.email || "");
//   const [salonName, setSalonName] = useState(user.salonName || "");
//   const [address, setAddress] = useState(user.salonAddress || "");
//   const [phone, setPhone] = useState(user.phoneNumber || "");
//   const [description, setDescription] = useState(user.description || "");
//   const [startTime, setStartTime] = useState(user.startTime || "");
//   const [endTime, setEndTime] = useState(user.endTime || "");
//   const [selectedDays, setSelectedDays] = useState(user.workingDays || []);

//   const [imageFile, setImageFile] = useState(null);
//   const [licenseFile, setLicenseFile] = useState(null);
//   const [salonPhotos, setSalonPhotos] = useState(user.salonPhotos || []);

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const wrapperRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const toggleDay = (day) => {
//     setSelectedDays((prev) =>
//       prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
//     );
//   };

//   useEffect(() => {
//     if (isOpen && user) {
//       setFullName(user.name || "");
//       setEmail(user.email || "");
//       setSalonName(user.salonName || "");
//       setAddress(user.salonAddress || "");
//       setPhone(user.phoneNumber || "");
//       setDescription(user.description || "");
//       setStartTime(user.startTime || "");
//       setEndTime(user.endTime || "");
//       setSelectedDays(user.workingDays || []);
//       setSalonPhotos(user.salonPhotos || []);
//       setImageFile(null);
//       setLicenseFile(null);
//     }
//   }, [isOpen, user]);

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog
//         as="div"
//         className="relative z-50 font-[Poppins]"
//         onClose={closeModal}
//       >
//         <div className="fixed inset-0 overflow-y-auto bg-black/30">
//           <div className="flex min-h-full items-center justify-center p-4">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="relative w-full max-w-[900px] rounded-[10px]  bg-[#E8E8E8]  p-[30px] shadow-lg flex flex-col gap-[32px] max-h-[90vh] overflow-y-auto">
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-[#581838] font-bold text-[24px]">
//                     Profile Settings
//                   </h2>
//                   <IoClose
//                     onClick={closeModal}
//                     className="text-[#581838] text-[28px] cursor-pointer"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   <div className="flex flex-col gap-5">
//                     <h3 className="text-[#581838] font-semibold text-[18px]">
//                       Personal Information
//                     </h3>
//                     <div>
//                       <label className="text-[#404040] text-[14px] font-medium">
//                         Full Name
//                       </label>
//                       <input
//                         value={fullName}
//                         onChange={(e) => setFullName(e.target.value)}
//                         className="w-full border border-[#E5E5E5] bg-white p-3 rounded-[8px] mt-1 text-[14px]"
//                         placeholder="Enter full name"
//                       />
//                     </div>

//                     <div>
//                       <label className="text-[#404040] text-[14px] font-medium">
//                         Email
//                       </label>
//                       <input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="w-full border border-[#E5E5E5] bg-white p-3 rounded-[8px] mt-1 text-[14px]"
//                         placeholder="Enter email address"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex flex-col gap-5">
//                     <h3 className="text-[#581838] font-semibold text-[18px]">
//                       Salon Information
//                     </h3>

//                     <div className="flex items-center gap-4">
//                       <div className="relative w-[80px] h-[80px]">
//                         <img
//                           src={
//                             imageFile
//                               ? URL.createObjectURL(imageFile)
//                               : user.profilePic || defaultSalonImg
//                           }
//                           className="w-full h-full rounded-md object-cover border border-gray-300 "
//                           alt="Salon logo"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => logoRef.current.click()}
//                           className="absolute bottom-[-6px] right-[-6px] w-[32px] h-[32px] rounded-full bg-[#FF92A5] flex items-center justify-center shadow cursor-pointer"
//                         >
//                           <IoCamera className="text-white text-[18px]" />
//                         </button>
//                         <input
//                           ref={logoRef}
//                           type="file"
//                           className="hidden"
//                           accept="image/*"
//                           onChange={(e) =>
//                             e.target.files[0] && setImageFile(e.target.files[0])
//                           }
//                         />
//                       </div>
//                       <div>
//                         <p className="text-[#581838] text-[16px] font-medium">
//                           {salonName || "Bella Beauty Salon"}
//                         </p>
//                         <button
//                           className="text-[#737373] text-[14px] cursor-pointer"
//                           onClick={() => logoRef.current.click()}
//                         >
//                           Change Logo
//                         </button>
//                       </div>
//                     </div>

//                     <div>
//                       <label className="text-[#404040] text-[14px] font-medium">
//                         Salon Name
//                       </label>
//                       <input
//                         value={salonName}
//                         onChange={(e) => setSalonName(e.target.value)}
//                         className="w-full border border-[#E5E5E5] bg-white p-3 rounded-[8px] mt-1 text-[14px]"
//                       />
//                     </div>

//                     <div>
//                       <label className="text-[#404040] text-[14px] font-medium">
//                         Address
//                       </label>
//                       <input
//                         value={address}
//                         onChange={(e) => setAddress(e.target.value)}
//                         className="w-full border border-[#E5E5E5] bg-white p-3 rounded-[8px] mt-1 text-[14px]"
//                       />
//                     </div>

//                     <div>
//                       <label className="text-[#404040] text-[14px] font-medium">
//                         Phone
//                       </label>
//                       <input
//                         value={phone}
//                         onChange={(e) => setPhone(e.target.value)}
//                         className="w-full border border-[#E5E5E5] bg-white p-3 rounded-[8px] mt-1 text-[14px]"
//                       />
//                     </div>

//                     <div className="pt-6 flex flex-col gap-6">
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="relative">
//                           <label className="block text-[#374151] text-[14px] font-semibold mb-1">
//                             Start Time
//                           </label>

//                           <div className="relative">
//                             <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF92A5] pointer-events-none z-10" />

//                             <input
//                               type="time"
//                               value={startTime}
//                               onChange={(e) => setStartTime(e.target.value)}
//                               className="w-full bg-white border border-gray-300 rounded-md py-3 pl-10 pr-4 text-gray-700
//                    focus:outline-none focus:ring-2 focus:ring-[#FF92A5] focus:border-[#FF92A5]
//                    transition-all cursor-pointer
//                    [&::-webkit-calendar-picker-indicator]:opacity-0
//                    [&::-webkit-calendar-picker-indicator]:absolute
//                    [&::-webkit-calendar-picker-indicator]:right-0
//                    [&::-webkit-calendar-picker-indicator]:w-full
//                    [&::-webkit-calendar-picker-indicator]:h-full"
//                               style={{ appearance: "none" }}
//                             />
//                           </div>
//                         </div>
//                         <div className="relative">
//                           <label className="block text-[#374151] text-[14px] font-semibold mb-1">
//                             End Time
//                           </label>

//                           <div className="relative">
//                             <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF92A5] pointer-events-none z-10" />

//                             <input
//                               type="time"
//                               value={endTime}
//                               onChange={(e) => setEndTime(e.target.value)}
//                               className="w-full bg-white border border-gray-300 rounded-md py-3 pl-10 pr-4 text-gray-700
//                    focus:outline-none focus:ring-2 focus:ring-[#FF92A5] focus:border-[#FF92A5]
//                    transition-all cursor-pointer
//                    [&::-webkit-calendar-picker-indicator]:opacity-0
//                    [&::-webkit-calendar-picker-indicator]:absolute
//                    [&::-webkit-calendar-picker-indicator]:right-0
//                    [&::-webkit-calendar-picker-indicator]:w-full
//                    [&::-webkit-calendar-picker-indicator]:h-full"
//                               style={{ appearance: "none" }}
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-[#374151] text-[14px] font-semibold mb-1">
//                           Working Days
//                         </label>
//                         <div className="relative" ref={wrapperRef}>
//                           <div
//                             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                             className="bg-white border border-gray-300 rounded-md py-3  px-4 text-left text-[14px] text-gray-600 cursor-pointer flex items-center justify-between"
//                           >
//                             <span>
//                               {selectedDays.length > 0
//                                 ? selectedDays
//                                     .map((d) => d.slice(0, 3))
//                                     .join(", ")
//                                 : "Select Days"}
//                             </span>
//                             <RiArrowDropDownLine className="text-[24px]" />
//                           </div>
//                           {isDropdownOpen && (
//                             <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50 max-h-60 overflow-y-auto">
//                               {days.map((day) => (
//                                 <CustomCheckbox
//                                   key={day}
//                                   label={day}
//                                   checked={selectedDays.includes(day)}
//                                   onChange={() => toggleDay(day)}
//                                 />
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <div>
//                         <div className="flex justify-between items-start mb-2">
//                           <div>
//                             <label className="block text-[#374151] text-[16px] font-semibold">
//                               Upload Licensed Document
//                             </label>
//                             <span className="text-[12px] italic text-[#00000080]">
//                               (png, jpeg, pdf)
//                             </span>
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => docRef.current.click()}
//                             className="flex items-center gap-2 bg-[#FF92A54D] text-[#FF92A5] font-medium rounded-xl px-4 py-3 hover:bg-[#FF92A580]"
//                           >
//                             <FaFileAlt /> Upload
//                           </button>
//                         </div>
//                         <input
//                           ref={docRef}
//                           type="file"
//                           className="hidden"
//                           accept=".png,.jpg,.jpeg,.pdf"
//                           onChange={(e) =>
//                             e.target.files[0] &&
//                             setLicenseFile(e.target.files[0])
//                           }
//                         />
//                         {licenseFile && (
//                           <p className="mt-2 text-sm italic text-[#581838]">
//                             Selected: {licenseFile.name}
//                           </p>
//                         )}
//                       </div>

//                       <div>
//                         <label className="block text-[#404040] font-medium mb-2">
//                           Description
//                         </label>
//                         <textarea
//                           rows={4}
//                           value={description}
//                           onChange={(e) => setDescription(e.target.value)}
//                           className="w-full border border-[#E5E5E5] bg-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF92A5]"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-[#374151] font-semibold mb-2">
//                           Salon Photos
//                         </label>
//                         <div className="flex flex-wrap items-start gap-3">
//                           <button
//                             type="button"
//                             onClick={() => photosRef.current.click()}
//                             className="flex-shrink-0 flex flex-col items-center justify-center w-[94px] h-[82px] border border-[#C0C0C0] bg-white rounded-md hover:bg-[#FFF4F6]"
//                           >
//                             <img
//                               src={uploadIcon}
//                               alt="Upload"
//                               className="w-6 h-6 mb-1"
//                             />
//                             <span className="text-[9px] font-medium text-center">
//                               Upload Salon
//                               <br />
//                               Photos
//                             </span>
//                           </button>
//                           <input
//                             ref={photosRef}
//                             type="file"
//                             multiple
//                             className="hidden"
//                             accept="image/*"
//                             onChange={(e) =>
//                               setSalonPhotos((prev) => [
//                                 ...prev,
//                                 ...Array.from(e.target.files),
//                               ])
//                             }
//                           />

//                           {salonPhotos.map((photo, i) => (
//                             <div key={i} className="relative">
//                               <img
//                                 src={
//                                   typeof photo === "string"
//                                     ? photo
//                                     : URL.createObjectURL(photo)
//                                 }
//                                 className="w-[80px] h-[74px] object-cover rounded-md"
//                                 alt={`photo ${i}`}
//                               />
//                               <button
//                                 onClick={() =>
//                                   setSalonPhotos((prev) =>
//                                     prev.filter((_, idx) => idx !== i)
//                                   )
//                                 }
//                                 className="absolute top-0 right-0 bg-[#FF92A5] text-white rounded-full w-5 h-5 text-xs cursor-pointer "
//                               >
//                                 ×
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <AppButton
//                   variant="primary"
//                   className="w-full py-3 text-[16px] font-medium"
//                   onClick={() => {
//                     console.log("Updated salon:", {
//                       name: salonName,
//                       address,
//                       phone,
//                       description,
//                       workingHours: { start: startTime, end: endTime },
//                       workingDays: selectedDays,
//                       logo: imageFile,
//                       licenseDocument: licenseFile,
//                       salonPhotos,
//                     });
//                     // closeModal();
//                   }}
//                 >
//                   Update Profile
//                 </AppButton>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState, useEffect } from "react";
import { IoClose, IoCamera } from "react-icons/io5";
import { FaClock, FaFileAlt } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";

import defaultSalonImg from "../../../../assets/salon-1.png";
import uploadIcon from "../../../../assets/upload_photos.png";
import AppButton from "../../../common/site/AppButton";
import CustomCheckbox from "../../../common/site/CustomCheckbox";
import { useUser } from "../../../../hooks/useUser";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";
import { useUpdateMeMutation } from "../../../../store/api";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const salonProfileSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    salonName: z.string().min(2, "Salon name is required"),
    address: z.string().min(5, "Address is required"),
    phone: z
      .string()
      .regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number")
      .optional()
      .or(z.literal("")),
    description: z.string().optional(),
    startTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    endTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    selectedDays: z.array(z.string()).min(1, "Select at least one working day"),
    logo: z.instanceof(File).optional(),
    licenseDocument: z.instanceof(File).optional(),
    salonPhotos: z.array(z.instanceof(File)).optional(),
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true;
      return data.endTime > data.startTime;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

export default function SalonProfileSettingsModal({ isOpen, closeModal }) {
  const { user, loading: userLoading } = useUser();
  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();

  const logoRef = useRef();
  const docRef = useRef();
  const photosRef = useRef();

  const [previewLogo, setPreviewLogo] = useState(null);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(salonProfileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      salonName: "",
      address: "",
      phone: "",
      description: "",
      startTime: "",
      endTime: "",
      selectedDays: [],
      logo: undefined,
      licenseDocument: undefined,
      salonPhotos: [],
    },
  });

  useEffect(() => {
    if (isOpen && user) {
      const formData = {
        fullName: user.name || "",
        email: user.email || "",
        salonName: user.salonName || "",
        address: user.salonAddress || "",
        phone: user.phoneNumber || "",
        description: user.description || "",
        startTime: user.startTime || "",
        endTime: user.endTime || "",
        selectedDays: user.workingDays || [],
        logo: undefined,
        licenseDocument: undefined,
        salonPhotos: [],
      };

      reset(formData);
      setPreviewLogo(user.profilePic || defaultSalonImg);
      setExistingPhotos(user.salonPhotos || []);
    }
  }, [isOpen, user, reset]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDay = (day) => {
    const current = watch("selectedDays") || [];
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    setValue("selectedDays", updated, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    console.log("Data Recieved==>", data);
    try {
      const payload = {
        name: data.fullName,
        email: data.email,
        phoneNumber: data.phone || null,
        salonName: data.salonName,
        salonAddress: data.address,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        workingDays: data.selectedDays,
        // profilePic: data.logo,
        // licenseDocument: data.licenseDocument,
        // salonPhotos: data.salonPhotos,
        licenseDocument: "https://pdfobject.com/pdf/sample.pdf",
        profilePic:
          "https://static.wixstatic.com/media/e3c477_ea6d7ddfe1a04ed5b93e47155be95f0a~mv2.png",
        salonPhotos: [
          "https://static.wixstatic.com/media/e3c477_ea6d7ddfe1a04ed5b93e47155be95f0a~mv2.png",
        ],
      };

      const res = await updateMe(payload).unwrap();
      console.log("Updated Response==>", res);
      toast.success(res?.message || "Profile updated successfully!");
      closeModal();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile.");
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center min-h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (!user) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 font-[Poppins]"
        onClose={closeModal}
      >
        <div className="fixed inset-0 overflow-y-auto bg-black/30">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-[900px] rounded-[10px] bg-[#E8E8E8] p-[30px] shadow-lg flex flex-col gap-[32px] max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                  <h2 className="text-[#581838] font-bold text-[24px]">
                    Profile Settings
                  </h2>
                  <IoClose
                    onClick={closeModal}
                    className="text-[#581838] text-[28px] cursor-pointer"
                  />
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div className="flex flex-col gap-5">
                    <h3 className="text-[#581838] font-semibold text-[18px]">
                      Personal Information
                    </h3>

                    <div>
                      <label className="text-[#404040] text-[14px] font-medium">
                        Full Name
                      </label>
                      <input
                        {...register("fullName")}
                        className="w-full border border-[#E5E5E5] bg-white p-3 rounded-[8px] mt-1 text-[14px]"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-[#404040] text-[14px] font-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full border border-[#E5E5E5] bg-white p-3 rounded-[8px] mt-1 text-[14px]"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-[#404040] text-[14px] font-medium">
                        Phone
                      </label>
                      <input
                        {...register("phone")}
                        className="w-full border border-[#E5E5E5] bg-white p-3 rounded-[8px] mt-1 text-[14px]"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <h3 className="text-[#581838] font-semibold text-[18px]">
                      Salon Information
                    </h3>

                    <div className="flex items-center gap-4">
                      <div className="relative w-[80px] h-[80px]">
                        <img
                          src={previewLogo || defaultSalonImg}
                          alt="Salon logo"
                          className="w-full h-full rounded-md object-cover border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => logoRef.current.click()}
                          className="absolute bottom-[-6px] right-[-6px] w-[32px] h-[32px] rounded-full bg-[#FF92A5] flex justify-center items-center shadow"
                        >
                          <IoCamera className="text-white text-[18px] cursor-pointer" />
                        </button>
                        <input
                          ref={logoRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setValue("logo", file);
                              setPreviewLogo(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-[#581838] font-medium">
                          {watch("salonName") || "Salon Name"}
                        </p>
                        <button
                          type="button"
                          onClick={() => logoRef.current.click()}
                          className="text-[#737373] text-sm cursor-pointer"
                        >
                          Change Logo
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[#404040] text-[14px] font-medium">
                        Salon Name
                      </label>
                      <input
                        {...register("salonName")}
                        className="w-full border border-[#E5E5E5] bg-white p-3 rounded-[8px] mt-1"
                      />
                      {errors.salonName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.salonName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-[#404040] text-[14px] font-medium">
                        Address
                      </label>
                      <input
                        {...register("address")}
                        className="w-full border border-[#E5E5E5] bg-white p-3 rounded-[8px] mt-1"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#374151] text-[14px] font-semibold mb-1">
                          Start Time
                        </label>
                        <div className="relative">
                          <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF92A5] z-10" />
                          <input
                            type="time"
                            {...register("startTime")}
                            className="w-full bg-white border border-gray-300 rounded-md py-3 pl-10 pr-4
                            transition-all cursor-pointer
                   [&::-webkit-calendar-picker-indicator]:opacity-0
                   [&::-webkit-calendar-picker-indicator]:absolute
                   [&::-webkit-calendar-picker-indicator]:right-0
                   [&::-webkit-calendar-picker-indicator]:w-full
                   [&::-webkit-calendar-picker-indicator]:h-full"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[#374151] text-[14px] font-semibold mb-1">
                          End Time
                        </label>
                        <div className="relative">
                          <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF92A5] z-10" />
                          <input
                            type="time"
                            {...register("endTime")}
                            className="w-full bg-white border border-gray-300 rounded-md py-3 pl-10 pr-4 
                            transition-all cursor-pointer
                   [&::-webkit-calendar-picker-indicator]:opacity-0
                   [&::-webkit-calendar-picker-indicator]:absolute
                   [&::-webkit-calendar-picker-indicator]:right-0
                   [&::-webkit-calendar-picker-indicator]:w-full
                   [&::-webkit-calendar-picker-indicator]:h-full
                            "
                          />
                        </div>
                        {errors.endTime && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.endTime.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#374151] text-[14px] font-semibold mb-1">
                        Working Days
                      </label>
                      <div className="relative" ref={wrapperRef}>
                        <div
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="bg-white border border-gray-300 rounded-md py-3 px-4 flex justify-between cursor-pointer"
                        >
                          <span className="text-[14px] text-gray-600">
                            {watch("selectedDays").length > 0
                              ? watch("selectedDays")
                                  .map((d) => d.slice(0, 3))
                                  .join(", ")
                              : "Select Days"}
                          </span>
                          <RiArrowDropDownLine className="text-[24px]" />
                        </div>
                        {isDropdownOpen && (
                          <div className="absolute w-full mt-2 bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                            {days.map((day) => (
                              <CustomCheckbox
                                key={day}
                                label={day}
                                checked={watch("selectedDays")?.includes(day)}
                                onChange={() => toggleDay(day)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      {errors.selectedDays && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.selectedDays.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-col sm:flex-row justify-between mb-2 gap-2">
                        <div>
                          <label className="block text-[#374151] text-[16px] font-semibold">
                            Upload Licensed Document
                          </label>
                          <span className="text-xs italic text-[#00000080]">
                            (png, jpeg, pdf)
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => docRef.current.click()}
                          className="bg-[#FF92A54D] text-[#FF92A5] px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-[#FF92A580]"
                        >
                          <FaFileAlt /> Upload
                        </button>
                      </div>
                      <input
                        ref={docRef}
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) setValue("licenseDocument", file);
                        }}
                      />
                      {watch("licenseDocument") && (
                        <p className="text-sm text-[#581838] mt-1">
                          Selected: {watch("licenseDocument").name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#404040] font-medium mb-2">
                        Description
                      </label>
                      <textarea
                        {...register("description")}
                        rows={4}
                        className="w-full border border-[#E5E5E5] bg-white rounded-lg p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-[#374151] font-semibold mb-2">
                        Salon Photos
                      </label>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => photosRef.current.click()}
                          className="w-[94px] h-[82px] border border-[#C0C0C0] bg-white rounded-md flex flex-col items-center justify-center hover:bg-[#FFF4F6] cursor-pointer"
                        >
                          <img
                            src={uploadIcon}
                            alt="upload"
                            className="w-6 h-6 mb-1"
                          />
                          <span className="text-[9px] text-center ">
                            Upload Salon
                            <br />
                            Photos
                          </span>
                        </button>

                        <input
                          ref={photosRef}
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            if (files.length > 0) {
                              setValue("salonPhotos", files);
                            }
                          }}
                        />

                        {existingPhotos.map((url, i) => (
                          <div key={`existing-${i}`} className="relative">
                            <img
                              src={url}
                              alt="salon"
                              className="w-[80px] h-[74px] object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setExistingPhotos((prev) =>
                                  prev.filter((_, idx) => idx !== i)
                                )
                              }
                              className="absolute top-0 right-0 bg-[#FF92A5] text-white w-5 h-5 rounded-full text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        {watch("salonPhotos")?.map((file, i) => (
                          <div key={`new-${i}`} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt="preview"
                              className="w-[80px] h-[74px] object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = watch("salonPhotos").filter(
                                  (_, idx) => idx !== i
                                );
                                setValue(
                                  "salonPhotos",
                                  updated.length > 0 ? updated : []
                                );
                              }}
                              className="absolute top-0 right-0 bg-[#FF92A5] text-white w-5 h-5 rounded-full text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </form>

                <AppButton
                  type="submit"
                  variant="primary"
                  className="w-full py-3 text-[16px] font-medium"
                  isLoading={isUpdating}
                  onClick={handleSubmit(onSubmit)}
                >
                  Update Profile
                </AppButton>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
