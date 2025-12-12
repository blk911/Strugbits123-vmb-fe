import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FaUser,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaCalendarAlt,
  FaFileAlt,
  FaFileImage,
} from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { RiArrowDropDownLine } from "react-icons/ri";
import InputWithIcon from "../../../components/common/site/InputWithIcon";
import AuthButton from "../../../components/common/site/AuthButton";
import CustomCheckbox from "../../../components/common/site/CustomCheckbox";
import uploadIcon from "../../../assets/upload_photos.png";
import TimeInput from "../../../components/common/site/TimeInput";
import { useGetUploadUrlMutation } from "../../../store/api";
import {
  toastLoading,
  toastSuccess,
  toastError,
  toastDismiss,
} from "../../../utils/toast";
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function SalonStep2({ onBack }) {
  const {
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    trigger,
  } = useFormContext();
  const [selectedDays, setSelectedDays] = useState(watch("workingDays") || []);
  const detailsRef = useRef(null);
  const docRef = useRef();
  const picRef = useRef();
  const photosRef = useRef();

  const [getUploadUrl, { isLoading: uploading }] = useGetUploadUrlMutation();
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
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(updated);
    setValue("workingDays", updated, { shouldValidate: true });
  };
  const uploadFile = async (file, folder = "salon") => {
    if (!file) return null;

    const toastId = toastLoading("Uploading...");

    try {
      const fileName = `${folder}/${Date.now()}_${file.name.replace(
        /[^a-zA-Z0-9.-]/g,
        "_"
      )}`;
      const { data } = await getUploadUrl({
        fileName,
        fileType: file.type || "application/octet-stream",
      }).unwrap();

      await fetch(data.uploadUrl || data, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      const publicUrl = (data.uploadUrl || data).split("?")[0];
      toastDismiss(toastId);
      toastSuccess("Uploaded successfully!");
      return { url: publicUrl, name: file.name };
    } catch (err) {
      toastDismiss(toastId);
      toastError("Upload failed");
      console.error(err);
      return null;
    }
  };

  const handleLicenseUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadFile(file, "licenses");
    if (result) {
      setValue("licenseDoc", result.url, { shouldValidate: true });
      setValue("licenseDocName", result.name);
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadFile(file, "profiles");
    if (result) {
      setValue("profilePic", result.url, { shouldValidate: true });
      setValue("profilePicName", result.name);
    }
  };

  const handleSalonPhotosUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const toastId = toastLoading(`Uploading ${files.length} photo(s)...`);
    const uploaded = [];

    for (const file of files) {
      const result = await uploadFile(file, "salon-photos");
      if (result) uploaded.push({ url: result.url, name: result.name });
    }

    const current = watch("salonPhotos") || [];
    setValue("salonPhotos", [...current, ...uploaded], {
      shouldValidate: true,
    });
    toastDismiss(toastId);
    if (uploaded.length === files.length) toastSuccess("All photos uploaded!");
  };

  const removeSalonPhoto = (index) => {
    const current = watch("salonPhotos") || [];
    const updated = current.filter((_, i) => i !== index);
    setValue("salonPhotos", updated, { shouldValidate: true });
  };
  return (
    <div className="w-full space-y-4 font-[Poppins,sans-serif]">
      <InputWithIcon
        label="Saloon Name"
        icon={FaUser}
        name="saloonName"
        register={register}
        error={errors.saloonName}
      />
      <div className="flex gap-3">
        <div className="w-[68%]">
          <InputWithIcon
            label="Saloon Address"
            icon={FaMapMarkerAlt}
            name="saloonAddress"
            register={register}
            error={errors.saloonAddress}
          />
        </div>
        <div className="w-[32%]">
          <InputWithIcon
            label="Zipcode"
            name="saloonZipcode"
            register={register}
            error={errors.saloonZipcode}
          />
        </div>
      </div>
      <InputWithIcon
        label="Phone Number"
        icon={FaPhoneAlt}
        name="phone"
        register={register}
        error={errors.phone}
      />

      <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
        <TimeInput label="Start Time" name="startTime" />
        <TimeInput label="End Time" name="endTime" />

        <div className="relative">
          <label className="block text-[#374151] text-[14px] font-semibold mb-1">
            Working Days
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF92A5]" />
            <RiArrowDropDownLine className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-[24px]" />
            <details
              ref={detailsRef}
              className="group w-full bg-white border border-gray-300 rounded-md py-3 pl-10 pr-10 cursor-pointer"
            >
              <summary className="list-none  text-gray-600 text-[14px]">
                {selectedDays.length > 0
                  ? selectedDays.map((d) => d.slice(0, 3)).join(", ")
                  : "Select Days"}
              </summary>
              <div className="absolute left-0 mt-4 w-full bg-white border rounded-lg shadow-md p-3 z-10">
                {days.map((day) => (
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
          {errors.workingDays && (
            <p className="text-xs text-red-600 mt-1">
              {errors.workingDays.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-start">
            <div className="w-[69%]">
              <label className="block text-[#374151] text-[16px] font-semibold">
                Upload Licensed Document
              </label>
              <span className="text-[12px] italic text-[#00000080]">
                (png, jpeg, pdf)
              </span>
            </div>
            <button
              type="button"
              onClick={() => docRef.current.click()}
              disabled={uploading}
              className={`cursor-pointer flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition ${
                uploading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-[#FF92A54D] text-[#FF92A5] hover:bg-[#FF92A580]"
              }`}
            >
              <FaFileAlt /> {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <input
            type="file"
            ref={docRef}
            className="hidden"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleLicenseUpload}
          />
          {watch("licenseDoc") && (
            <p className="mt-2 text-sm italic">
              Selected: {watch("licenseDocName")}
            </p>
          )}
          {errors.licenseDoc && (
            <p className="text-xs text-red-600 mt-1">
              {errors.licenseDoc.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[#404040] font-medium mb-2">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={3}
            placeholder="Enter description"
            className="w-full border border-[#E5E5E5] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF92A5]"
          />
          {errors.description && (
            <p className="text-xs text-red-600 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-start">
            <div className="w-[69%]">
              <label className="block text-[#374151] text-[16px] font-semibold">
                Choose Profile Picture
              </label>
            </div>
            <button
              type="button"
              onClick={() => picRef.current.click()}
              disabled={uploading}
              className={` cursor-pointer flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition ${
                uploading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-[#FF92A54D] text-[#FF92A5] hover:bg-[#FF92A580]"
              }`}
            >
              <FaFileImage /> {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <input
            type="file"
            ref={picRef}
            className="hidden"
            accept="image/*"
            onChange={handleProfilePicUpload}
          />
          {watch("profilePic") && (
            <p className="mt-2 text-sm italic">
              Selected: {watch("profilePicName")}
            </p>
          )}
          {errors.profilePic && (
            <p className="text-xs text-red-600 mt-1">
              {errors.profilePic.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[#374151] font-semibold mb-2">
            Upload Salon Photos
          </label>

          <div className="flex flex-wrap md:flex-nowrap items-start gap-2 sm:gap-3 w-full">
            <button
              type="button"
              onClick={() => photosRef.current.click()}
              disabled={uploading}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-[94px] h-[82px] border border-[#C0C0C0] bg-white rounded-md hover:bg-[#FFF4F6] transition-all cursor-pointer ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <img
                src={uploadIcon}
                alt="Upload"
                className="w-5 h-5 sm:w-6 sm:h-6 mb-1 cursor-pointer"
              />
              <span className="text-[8px] sm:text-[9px] leading-tight font-medium text-center ">
                Upload Salon <br /> Photos
              </span>
            </button>

            <input
              type="file"
              multiple
              ref={photosRef}
              className="hidden"
              accept="image/*"
              onChange={handleSalonPhotosUpload}
            />

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {watch("salonPhotos")?.map((photo, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={photo.url}
                    alt={`Salon photo ${index + 1}`}
                    className="w-[80px] h-[74px] object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => removeSalonPhoto(index)}
                    className="absolute cursor-pointer top-[-2px] right-[-3px] bg-[#FF92A5] text-white rounded-full w-6 h-6 text-sm flex items-center justify-center shadow-md hover:bg-[#e07a8c]"
                  >
                    ×
                  </button>
                  <p className="text-xs text-gray-600 mt-1 truncate w-[80px]">
                    {photo.name}
                  </p>
                </div>
              ))}
            </div>
            {errors.salonPhotos && (
              <p className="text-xs text-red-600 mt-2">
                {errors.salonPhotos.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 gap-3">
        <button type="button" onClick={onBack} className="flex items-center">
          <span className="flex items-center justify-center min-w-8 h-8 rounded-xl bg-[#4b0d23]">
            <FaArrowLeftLong className="text-pink-400" />
          </span>
        </button>
        <AuthButton text="Sign Up" />
      </div>
    </div>
  );
}
