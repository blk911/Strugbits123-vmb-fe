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
import {
  useGetUploadUrlMutation,
  useUpdateSalonProfileMutation,
} from "../../../../store/api";
import {
  convert12HourTo24Hour,
  convertTo12Hour,
} from "../../../../utils/HelperFunctions";
import {
  toastLoading,
  toastSuccess,
  toastError,
  toastDismiss,
} from "../../../../utils/toast";
import { useDispatch } from "react-redux";
import { setUser } from "../../../../store/features/userSlice";
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
    zipcode: z.string().regex(/^\d{5}$/, "Invalid zip code"),
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
    logo: z.string().url().optional().or(z.literal("")),
    licenseDocument: z.string().url().optional().or(z.literal("")),
    salonPhotos: z
      .array(z.object({ url: z.string().url(), name: z.string() }))
      .min(1, "At least one salon photo is required"),
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
  const [updateMe, { isLoading: isUpdating }] = useUpdateSalonProfileMutation();
  const [getUploadUrl, { isLoading: uploading }] = useGetUploadUrlMutation();
  const logoRef = useRef();
  const docRef = useRef();
  const photosRef = useRef();
  const dispatch = useDispatch();
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
      zipcode: "",
      startTime: "",
      endTime: "",
      selectedDays: [],
      logo: "",
      licenseDocument: "",
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
        zipcode: user.zipcode || "",
        phone: user.phoneNumber || "",
        description: user.description || "",
        startTime: user.startTime ? convert12HourTo24Hour(user.startTime) : "",
        endTime: user.endTime ? convert12HourTo24Hour(user.endTime) : "",
        selectedDays: user.workingDays || [],
        logo: user.profilePic || "",
        licenseDocument: user.licenseDocument || "",
        salonPhotos: (user.salonPhotos || []).map((url) => ({
          url,
          name: url.split("/").pop() || "photo.jpg",
        })),
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
      toastSuccess("Uploaded!");
      return { url: publicUrl, name: file.name };
    } catch (err) {
      toastDismiss(toastId);
      toastError("Upload failed");
      console.error(err);
      return null;
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadFile(file, "profiles");
    if (result) {
      setValue("logo", result.url, { shouldValidate: true });
      setPreviewLogo(result.url);
    }
  };

  const handleLicenseUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadFile(file, "licenses");
    if (result) {
      setValue("licenseDocument", result.url, { shouldValidate: true });
      setValue("licenseDocName", result.name);
    }
  };

  const handleSalonPhotosUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const toastId = toastLoading(`Uploading ${files.length} photo(s)...`);
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
    toastSuccess("Photos uploaded!");
  };

  const removeSalonPhoto = (index) => {
    const current = watch("salonPhotos") || [];
    const updated = current.filter((_, i) => i !== index);
    setValue("salonPhotos", updated.length > 0 ? updated : [], {
      shouldValidate: true,
    });
  };
  const onSubmit = async (data) => {
    try {
      const startTime = convertTo12Hour(data.startTime);
      const endTime = convertTo12Hour(data.endTime);
      const payload = {
        name: data.fullName,
        email: data.email,
        phoneNumber: data.phone || null,
        salonName: data.salonName,
        salonAddress: data.address,
        zipcode: data.zipcode,
        description: data.description,
        startTime: startTime,
        endTime: endTime,
        workingDays: data.selectedDays,

        profilePic: data.logo || null,
        licenseDocument: data.licenseDocument || null,
        salonPhotos: data.salonPhotos?.map((p) => p.url) || [],
      };

      const res = await updateMe(payload).unwrap();
      dispatch(setUser(res.data));
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
                        onChange={(e) => {
                          let value = e.target.value;
                          if (value.startsWith(" ")) {
                            value = value.trimStart();
                            e.target.value = value;
                          }
                          register("fullName").onChange(e);
                        }}
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
                        type="text"
                        {...register("email")}
                        onChange={(e) => {
                          let value = e.target.value;
                          if (value.startsWith(" ")) {
                            value = value.trimStart();
                            e.target.value = value;
                          }
                          register("email").onChange(e);
                        }}
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
                        onChange={(e) => {
                          let value = e.target.value;
                          if (value.startsWith(" ")) {
                            value = value.trimStart();
                            e.target.value = value;
                          }
                          register("phone").onChange(e);
                        }}
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
                          disabled={uploading}
                          className={`absolute bottom-[-6px] right-[-6px] w-[32px] h-[32px] rounded-full bg-[#FF92A5] flex justify-center items-center shadow ${
                            uploading ? "opacity-50" : ""
                          }`}
                        >
                          <IoCamera className="text-white text-[18px] cursor-pointer" />
                        </button>
                        <input
                          ref={logoRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
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
                          Upload Logo
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[#404040] text-[14px] font-medium">
                        Salon Name
                      </label>
                      <input
                        {...register("salonName")}
                        onChange={(e) => {
                          let value = e.target.value;
                          if (value.startsWith(" ")) {
                            value = value.trimStart();
                            e.target.value = value;
                          }
                          register("salonName").onChange(e);
                        }}
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
                        onChange={(e) => {
                          let value = e.target.value;
                          if (value.startsWith(" ")) {
                            value = value.trimStart();
                            e.target.value = value;
                          }
                          register("address").onChange(e);
                        }}
                        className="w-full border border-[#E5E5E5] bg-white p-3 rounded-[8px] mt-1"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-[#404040] text-[14px] font-medium">
                        Zip Code
                      </label>
                      <input
                        {...register("zipcode")}
                        onChange={(e) => {
                          let value = e.target.value;
                          if (value.startsWith(" ")) {
                            value = value.trimStart();
                            e.target.value = value;
                          }
                          register("zipcode").onChange(e);
                        }}
                        className="w-full border border-[#E5E5E5] bg-white p-3 rounded-[8px] mt-1"
                      />
                      {errors.zipcode && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.zipcode.message}
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
                        onChange={handleLicenseUpload}
                      />
                      {watch("licenseDocument") && (
                        <p className="text-sm text-[#581838] mt-1">
                          Selected: {watch("licenseDocName")}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#404040] font-medium mb-2">
                        Description
                      </label>
                      <textarea
                        {...register("description")}
                        onChange={(e) => {
                          let value = e.target.value;
                          if (value.startsWith(" ")) {
                            value = value.trimStart();
                            e.target.value = value;
                          }
                          register("description").onChange(e);
                        }}
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
                          onChange={handleSalonPhotosUpload}
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
                        {watch("salonPhotos")?.map((photo, i) => (
                          <div key={i} className="relative">
                            <img
                              src={photo.url}
                              alt="salon"
                              className="w-[80px] h-[74px] object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeSalonPhoto(i)}
                              className="absolute top-0 right-0 bg-[#FF92A5] text-white w-5 h-5 rounded-full text-xs cursor-pointer"
                            >
                              ×
                            </button>
                            <p className="text-xs text-gray-600 mt-1 truncate w-[80px]">
                              {photo.name}
                            </p>
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
                  disabled={isUpdating || uploading}
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
