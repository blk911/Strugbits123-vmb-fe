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
import { useGetUploadUrlMutation } from "../../../store/api";
import {
  toastLoading,
  toastSuccess,
  toastError,
  toastDismiss,
} from "../../../utils/toast";
import TimePicker from "../../../components/common/site/TimePicker";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [getUploadUrl, { isLoading: uploading }] = useGetUploadUrlMutation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (detailsRef.current && !detailsRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
        detailsRef.current.removeAttribute("open");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleDayToggle = (day) => {
    const updated =
      selectedDays.includes(day) ?
        selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(updated);
    setValue("workingDays", updated, { shouldValidate: true });
  };

  const uploadFile = async (file, folder = "salon") => {
    if (!file) return null;

    try {
      const fileName = `${folder}/${Date.now()}_${file.name.replace(
        /[^a-zA-Z0-9.-]/g,
        "_",
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
      return { url: publicUrl, name: file.name };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleLicenseUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toastLoading("Uploading license...");
    const result = await uploadFile(file, "licenses");
    toastDismiss(toastId);

    if (result) {
      setValue("licenseDoc", result.url, { shouldValidate: true });
      setValue("licenseDocName", result.name);
      toastSuccess("License uploaded!");
    } else {
      toastError("Failed to upload license");
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toastLoading("Uploading profile picture...");
    const result = await uploadFile(file, "profiles");
    toastDismiss(toastId);

    if (result) {
      setValue("profilePic", result.url, { shouldValidate: true });
      setValue("profilePicName", result.name);
      toastSuccess("Profile picture uploaded!");
    } else {
      toastError("Failed to upload profile picture");
    }
  };

  const handleSalonPhotosUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const toastId = toastLoading(`Uploading ${files.length} salon photo(s)...`);
    const uploaded = [];

    for (const file of files) {
      const result = await uploadFile(file, "salon-photos");
      if (result) uploaded.push(result);
    }

    const current = watch("salonPhotos") || [];
    setValue("salonPhotos", [...current, ...uploaded], {
      shouldValidate: true,
    });

    toastDismiss(toastId);
    if (uploaded.length === files.length) {
      toastSuccess(`All ${files.length} photos uploaded!`);
    } else {
      toastError("Some photos failed to upload");
    }
  };

  const removeSalonPhoto = (index) => {
    const current = watch("salonPhotos") || [];
    const updated = current.filter((_, i) => i !== index);
    setValue("salonPhotos", updated, { shouldValidate: true });
  };

  return (
    <div className="w-full space-y-4 font-poppins">
      <InputWithIcon
        label="Salon Name"
        icon={FaUser}
        name="saloonName"
        register={register}
        error={errors.saloonName}
        placeholder={"Enter your salon name"}
      />
      <div className="flex gap-3">
        <div className="w-[68%]">
          <InputWithIcon
            label="Salon Address"
            icon={FaMapMarkerAlt}
            name="saloonAddress"
            register={register}
            error={errors.saloonAddress}
            placeholder={"Enter your complete address"}
          />
        </div>
        <div className="w-[32%]">
          <InputWithIcon
            label="Zipcode"
            name="saloonZipcode"
            register={register}
            error={errors.saloonZipcode}
            placeholder={"Zipcode"}
          />
        </div>
      </div>
      <InputWithIcon
        type="tel"
        label="Phone Number"
        icon={FaPhoneAlt}
        name="salonPhone"
        register={register}
        error={errors.salonPhone}
        placeholder={"Enter your phone number"}
      />

      <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
        <TimePicker label="Start Time" name="startTime" />
        <TimePicker label="End Time" name="endTime" />

        <div className="relative" ref={detailsRef}>
          <label className="block text-vmb-text-main text-[14px] font-semibold mb-1">
            Working Days
          </label>

          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-vmb-secondary z-10" />

            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white border border-vmb-primary/10 rounded-md py-3 pl-10 pr-1 cursor-pointer flex justify-between items-center"
            >
              <span className="text-vmb-text-muted text-[14px]">
                {selectedDays.length > 0 ?
                  // ? selectedDays.map((d) => d.slice(0, 3)).join(", ")
                  `0${selectedDays.length} Days`
                : "Select Days"}
              </span>

              <RiArrowDropDownLine
                className={`text-vmb-text-muted text-[24px] transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {isDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-vmb-primary/10 rounded-lg shadow-md z-50 p-3 max-h-60 overflow-y-auto custom-scrollbar">
                {days.map((day) => (
                  <CustomCheckbox
                    key={day}
                    label={day}
                    checked={selectedDays.includes(day)}
                    onChange={() => handleDayToggle(day)}
                  />
                ))}
              </div>
            )}
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
              <label className="block text-vmb-text-main text-[16px] font-semibold">
                Upload Licensed Document
              </label>
              <span className="text-[12px] italic text-vmb-text-muted/50">
                (png, jpeg, pdf)
              </span>
            </div>
            <button
              type="button"
              onClick={() => docRef.current.click()}
              className={`cursor-pointer flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition
    
                   bg-vmb-secondary/30 text-vmb-secondary hover:bg-vmb-secondary/50
              `}
            >
              <FaFileAlt /> Upload
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
          {/* <label className="block text-vmb-text-main font-medium mb-2">
            Description
          </label> */}
          <textarea
            {...register("description")}
            rows={3}
            onChange={(e) => {
              let value = e.target.value;

              if (value.startsWith(" ")) {
                value = value.trimStart();
                e.target.value = value;
              }

              register("description").onChange(e);
            }}
            placeholder="Write short description (Premium beauty salon offering cutting-edge hair, nail, and beauty services in a luxurious environment.)"
            className="w-full border border-vmb-primary/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-vmb-secondary"
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
              <label className="block text-vmb-text-main text-[16px] font-semibold">
                Choose Profile Picture
              </label>
            </div>
            <button
              type="button"
              onClick={() => picRef.current.click()}
              // disabled={uploading}
              className={`cursor-pointer flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition 
        \
                  bg-vmb-secondary/30 text-vmb-secondary hover:bg-vmb-secondary/50
              `}
            >
              <FaFileImage /> Upload
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
          <label className="block text-vmb-text-main font-semibold mb-2">
            Upload Salon Photos
          </label>

          <div className="flex  items-center gap-3">
            <button
              type="button"
              onClick={() => photosRef.current.click()}
              disabled={uploading}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-[74px] h-[70px] md:w-[94px] md:h-[82px] border border-vmb-primary/10 bg-white rounded-md hover:bg-vmb-secondary/10 transition-all cursor-pointer ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <img
                src={uploadIcon}
                alt="Upload"
                className="w-5 h-5 sm:w-6 sm:h-6 mb-1 cursor-pointer"
              />
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
              onChange={handleSalonPhotosUpload}
            />
            <div className="w-full overflow-x-auto custom-scrollbar">
              <div className="flex  pt-3 gap-2 sm:gap-3">
                {watch("salonPhotos")?.map((photo, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    <img
                      src={photo.url}
                      alt={`Salon photo ${index + 1}`}
                      className="w-[60px] h-[54px] md:w-[80px] md:h-[74px] object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removeSalonPhoto(index)}
                      className="absolute cursor-pointer top-[-2px] right-[15px] md:right-[-3px] bg-vmb-secondary text-white rounded-full w-6 h-6 text-sm flex items-center justify-center shadow-md hover:brightness-90"
                    >
                      ×
                    </button>
                    <p className="text-xs text-vmb-text-muted mt-1 truncate w-[80px]">
                      {photo.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {errors.salonPhotos && (
            <p className="text-xs text-red-600 mt-2">
              {errors.salonPhotos.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 gap-3">
        <button type="button" onClick={onBack} className="flex items-center">
          <span className="flex items-center justify-center min-w-8 h-8 rounded-xl bg-vmb-primary">
            <FaArrowLeftLong className="text-vmb-secondary" />
          </span>
        </button>
        <AuthButton text="Sign Up" />
      </div>
    </div>
  );
}
