
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FaUser, FaMapMarkerAlt, FaPhoneAlt, FaClock, FaCalendarAlt,
  FaFileAlt, FaFileImage, 
} from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { RiArrowDropDownLine } from "react-icons/ri";
import InputWithIcon from "../../../components/common/site/InputWithIcon";
import AuthButton from "../../../components/common/site/AuthButton";
import CustomCheckbox from "../../../components/common/site/CustomCheckbox";
import uploadIcon from "../../../assets/upload_photos.png";

const timeOptions = ["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SalonStep2({ onBack }) {
  const { register, setValue, watch, formState: { errors, isSubmitting } } = useFormContext();
  const [selectedDays, setSelectedDays] = useState(watch("workingDays") || []);
 const detailsRef = useRef(null);
  const docRef = useRef();
  const picRef = useRef();
  const photosRef = useRef();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (detailsRef.current && !detailsRef.current.contains(e.target)) {
        detailsRef.current.removeAttribute("open");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  const handleDayToggle = (day) => {
    const updated = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    setSelectedDays(updated);
    setValue("workingDays", updated, { shouldValidate: true });
  };

  return (
    <div className="w-full space-y-4 font-[Poppins,sans-serif]">
      <InputWithIcon label="Saloon Name" icon={FaUser} name="saloonName" register={register} error={errors.saloonName} />
      <div className="flex gap-3">
        <div className="w-[68%]">
          <InputWithIcon label="Saloon Address" icon={FaMapMarkerAlt} name="saloonAddress" register={register} error={errors.saloonAddress} />
        </div>
        <div className="w-[32%]">
          <InputWithIcon label="Zipcode" name="saloonZipcode" register={register} error={errors.saloonZipcode} />
        </div>
      </div>
      <InputWithIcon label="Phone Number" icon={FaPhoneAlt} name="phone" register={register} error={errors.phone} />

      <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
        <div className="relative">
          <label className="block text-[#374151] text-[14px] font-semibold mb-1">Start Time</label>
          <div className="relative">
            <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF92A5]" />
            <select {...register("startTime")} className="w-full bg-white border border-gray-300 rounded-md py-3 pl-10 pr-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF92A5]">
              <option value="">Select</option>
              {timeOptions.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          {errors.startTime && <p className="text-xs text-red-600 mt-1">{errors.startTime.message}</p>}
        </div>

        <div className="relative">
          <label className="block text-[#374151] text-[14px] font-semibold mb-1">End Time</label>
          <div className="relative">
            <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF92A5]" />
            <select {...register("endTime")} className="w-full bg-white border border-gray-300 rounded-md py-3 pl-10 pr-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF92A5]">
              <option value="">Select</option>
              {timeOptions.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          {errors.endTime && <p className="text-xs text-red-600 mt-1">{errors.endTime.message}</p>}
        </div>

        <div className="relative">
          <label className="block text-[#374151] text-[14px] font-semibold mb-1">Working Days</label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF92A5]" />
            <RiArrowDropDownLine className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-[24px]" />
            <details  ref={detailsRef} className="group w-full bg-white border border-gray-300 rounded-md py-3 pl-10 pr-10 cursor-pointer">
              <summary className="list-none  text-gray-600 text-[14px]">
                {selectedDays.length ? `${selectedDays.length} Days` : "Select Days"}
              </summary>
              <div className="absolute left-0 mt-4 w-full bg-white border rounded-lg shadow-md p-3 z-10">
                {days.map(day => (
                  <CustomCheckbox
                    key={day}
                    label={day}
                    checked={selectedDays.includes(day)}
                    onChange={() => handleDayToggle(day)}
                  />
                ))}
              </div>
            </details>
          </div>
          {errors.workingDays && <p className="text-xs text-red-600 mt-1">{errors.workingDays.message}</p>}
        </div>
      </div>

      {/* Uploads */}
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-start">
            <div className="w-[69%]">
              <label className="block text-[#374151] text-[16px] font-semibold">Upload Licensed Document</label>
              <span className="text-[12px] italic text-[#00000080]">(png, jpeg, pdf)</span>
            </div>
            <button type="button" onClick={() => docRef.current.click()} className="flex items-center gap-2 bg-[#FF92A54D] text-[#FF92A5] font-medium rounded-xl px-4 py-3 hover:bg-[#FF92A580]">
              <FaFileAlt /> Upload
            </button>
          </div>
          <input type="file" ref={docRef} className="hidden" accept=".png,.jpg,.jpeg,.pdf"
            onChange={e => setValue("licenseDoc", e.target.files[0])} />
          {watch("licenseDoc")?.name && <p className="mt-2 text-sm italic">Selected: {watch("licenseDoc").name}</p>}
        </div>

        <div>
          <label className="block text-[#404040] font-medium mb-2">Description</label>
          <textarea {...register("description")} rows={3} placeholder="Enter description"
            className="w-full border border-[#E5E5E5] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF92A5]" />
        </div>

        <div>
          <div className="flex justify-between items-start">
            <div className="w-[69%]">
              <label className="block text-[#374151] text-[16px] font-semibold">Choose Profile Picture</label>
            </div>
            <button type="button" onClick={() => picRef.current.click()} className="flex items-center gap-2 bg-[#FF92A54D] text-[#FF92A5] font-medium rounded-xl px-4 py-3 hover:bg-[#FF92A580]">
              <FaFileImage /> Upload
            </button>
          </div>
          <input type="file" ref={picRef} className="hidden" accept="image/*"
            onChange={e => setValue("profilePic", e.target.files[0])} />
          {watch("profilePic")?.name && <p className="mt-2 text-sm italic">Selected: {watch("profilePic").name}</p>}
        </div>

<div>
  <label className="block text-[#374151] font-semibold mb-2">
    Upload Salon Photos
  </label>

  <div className="flex flex-wrap md:flex-nowrap items-start gap-2 sm:gap-3 w-full overflow-hidden">
    <button
      type="button"
      onClick={() => photosRef.current.click()}
      className="flex-shrink-0 flex flex-col items-center justify-center 
                 w-[70px] h-[64px] sm:w-[94px] sm:h-[82px] 
                 border border-[#C0C0C0] bg-white rounded-md 
                 hover:bg-[#FFF4F6] transition-all"
    >
      <img src={uploadIcon} alt="Upload" className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
      <span className="text-[8px] sm:text-[9px] leading-tight font-medium text-center">
        Upload Salon <br /> Photos
      </span>
    </button>

    <input
      type="file"
      multiple
      ref={photosRef}
      className="hidden"
      accept="image/*"
      onChange={(e) => setValue("salonPhotos", Array.from(e.target.files))}
    />

    <div
      className="
        flex flex-wrap md:flex-nowrap 
        gap-2 sm:gap-3 
        w-full md:max-w-[calc(100%-90px)] 
        md:overflow-x-auto md:overflow-y-hidden 
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
      "
    >
      {watch("salonPhotos")?.map((f, i) => (
        <img
          key={i}
          src={URL.createObjectURL(f)}
          alt=""
          className="flex-shrink-0 w-[70px] h-[64px] sm:w-[80px] sm:h-[74px] 
                     object-cover rounded-md"
        />
      ))}
    </div>
  </div>
</div>


      </div>

      <div className="flex justify-between items-center pt-2 gap-3">
        <button type="button" onClick={onBack} className="flex items-center">
          <span className="flex items-center justify-center min-w-8 h-8 rounded-xl bg-[#4b0d23]">
            <FaArrowLeftLong className="text-pink-400" />
          </span>
        </button>
        <AuthButton text="Sign Up"  />
      </div>
    </div>
  );
}