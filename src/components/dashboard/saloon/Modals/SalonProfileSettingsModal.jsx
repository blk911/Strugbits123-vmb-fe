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
  useUpdateSalonApplicationStatusMutation,
  useLogoutMutation,
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
import { clearUser, setUser } from "../../../../store/features/userSlice";
import { useNavigate } from "react-router-dom";
import { clearRole } from "../../../../store/features/roleSlice";
import { setAuthMode } from "../../../../store/features/authSlice";
import TimePicker from "../../../common/site/TimePicker";
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const salonProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Invalid name"),
  email: z.string().email("Invalid email address"),
  salonName: z
    .string()
    .min(2, "Salon name is required")
    .regex(/^[a-zA-Z\s]+$/, "Invalid salon name"),
  address: z.string().min(5, "Address is required"),
  // .regex(/^[a-zA-Z0-9\s,.'\-!&()/:]+$/, "Invalid address"),
  zipcode: z.string().regex(/^\d{5}$/, "Invalid zip code"),
  phone: z
    .string()
    .regex(/^\d{10,15}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  description: z.string().min(10, "Description must be at least 10 characters"),
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
});
// .refine(
//   (data) => {
//     if (!data.startTime || !data.endTime) return true;
//     return data.endTime > data.startTime;
//   },
//   {
//     message: "End time must be after start time",
//     path: ["endTime"],
//   }
// );

export default function SalonProfileSettingsModal({ isOpen, closeModal }) {
  const { user, loading: userLoading } = useUser();
  const [updateMe, { isLoading: isUpdatingProfile }] =
    useUpdateSalonProfileMutation();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const [updateApplicationStatus, { isLoading: isResubmitting }] =
    useUpdateSalonApplicationStatusMutation();
  const [getUploadUrl, { isLoading: uploading }] = useGetUploadUrlMutation();
  const logoRef = useRef();
  const docRef = useRef();
  const photosRef = useRef();
  const dispatch = useDispatch();
  const [previewLogo, setPreviewLogo] = useState(null);
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
    const updated =
      current.includes(day) ?
        current.filter((d) => d !== day)
      : [...current, day];
    setValue("selectedDays", updated, { shouldValidate: true });
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
      toastError("Upload failed");
      console.error(err);
      return null;
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toastLoading("Uploading logo...");
    const result = await uploadFile(file, "profiles");
    toastDismiss(toastId);

    if (result) {
      setValue("logo", result.url, { shouldValidate: true });
      setPreviewLogo(result.url);
      toastSuccess("Logo uploaded!");
    }
  };

  const handleLicenseUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toastLoading("Uploading document...");
    const result = await uploadFile(file, "licenses");
    toastDismiss(toastId);

    if (result) {
      setValue("licenseDocument", result.url, { shouldValidate: true });
      setValue("licenseDocName", result.name);
      toastSuccess("Document uploaded!");
    }
  };

  const handleSalonPhotosUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const toastId = toastLoading(`Uploading ${files.length} photo(s)...`);

    const uploaded = [];
    let successCount = 0;

    for (const file of files) {
      const result = await uploadFile(file, "salon-photos");
      if (result) {
        uploaded.push(result);
        successCount++;
      }
    }

    if (uploaded.length > 0) {
      const current = watch("salonPhotos") || [];
      setValue("salonPhotos", [...current, ...uploaded], {
        shouldValidate: true,
      });
    }

    toastDismiss(toastId);
    if (successCount > 0) {
      toastSuccess(`${successCount} photo(s) uploaded successfully!`);
    } else {
      toastError("Failed to upload photos");
    }
  };

  const removeSalonPhoto = (index) => {
    const current = watch("salonPhotos") || [];
    const updated = current.filter((_, i) => i !== index);
    setValue("salonPhotos", updated.length > 0 ? updated : [], {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data) => {
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

    try {
      if (user?.status === "hold") {
        const res = await updateApplicationStatus(user._id).unwrap();
        await updateMe(payload).unwrap();

        dispatch(setUser({ ...user, status: "pending" }));

        toast.success(
          res?.message ||
            "Application resubmitted successfully! Awaiting approval.",
        );
        await logout().unwrap();
        dispatch(clearRole());
        dispatch(clearUser());
        dispatch(setAuthMode("login"));
        navigate("/register");
      } else {
        const res = await updateMe(payload).unwrap();
        dispatch(setUser(res.data));
        toast.success(res?.message || "Profile updated successfully!");
      }
      closeModal();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit. Please try again.");
      console.error(err);
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
  const isHold = user?.status === "hold";
  const isSubmitting = isHold ? isResubmitting : isUpdatingProfile;
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 font-poppins"
        onClose={closeModal}
      >
        <div className="fixed inset-0 overflow-y-auto custom-scrollbar  bg-vmb-overlay-bg">
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
              <Dialog.Panel className="relative w-full max-w-[900px] rounded-[10px] backdrop-blur-[1px]  bg-vmb-modals-bg p-[30px] shadow-lg flex flex-col gap-[32px] max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center">
                  <h2 className="text-vmb-primary font-bold text-[24px]">
                    Profile Settings
                  </h2>
                  <IoClose
                    onClick={closeModal}
                    className="text-vmb-primary text-[28px] cursor-pointer"
                  />
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div className="flex flex-col gap-5">
                    <h3 className="text-vmb-primary font-semibold text-[18px]">
                      Personal Information
                    </h3>

                    <div>
                      {/* <label className="text-vmb-text-main text-[14px] font-medium">
                        Full Name
                      </label> */}
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
                        className="w-full border border-vmb-primary/10 bg-white/50 p-3 rounded-[8px] mt-1 text-[14px]"
                        placeholder="Full Name"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      {/* <label className="text-vmb-text-main text-[14px] font-medium">
                        Email
                      </label> */}
                      <input
                        type="text"
                        readOnly
                        {...register("email")}
                        onChange={(e) => {
                          let value = e.target.value;
                          if (value.startsWith(" ")) {
                            value = value.trimStart();
                            e.target.value = value;
                          }
                          register("email").onChange(e);
                        }}
                        className="w-full border border-vmb-primary/10 bg-white/50 p-3 rounded-[8px] mt-1 text-[14px]"
                        placeholder="Email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      {/* <label className="text-vmb-text-main text-[14px] font-medium">
                        Phone
                      </label> */}
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
                        className="w-full border border-vmb-primary/10 bg-white/50 p-3 rounded-[8px] mt-1 text-[14px]"
                        placeholder="Phone"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <h3 className="text-vmb-primary font-semibold text-[18px]">
                      Salon Information
                    </h3>

                    <div className="flex items-center gap-4">
                      <div className="relative w-[80px] h-[80px]">
                        <img
                          src={previewLogo || defaultSalonImg}
                          alt="Salon logo"
                          className="w-full h-full rounded-md object-cover border border-vmb-primary/10"
                        />
                        <button
                          type="button"
                          onClick={() => logoRef.current.click()}
                          disabled={uploading}
                          className={`absolute bottom-[-6px] right-[-6px] w-[32px] h-[32px] rounded-full bg-vmb-secondary flex justify-center items-center shadow ${
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
                        <p className="text-vmb-primary font-medium">
                          {watch("salonName") || "Salon Name"}
                        </p>
                        <button
                          type="button"
                          onClick={() => logoRef.current.click()}
                          className="text-vmb-text-muted text-sm cursor-pointer"
                        >
                          Upload Logo
                        </button>
                      </div>
                    </div>

                    <div>
                      {/* <label className="text-vmb-text-main text-[14px] font-medium">
                        Salon Name
                      </label> */}
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
                        className="w-full border border-vmb-primary/10 bg-white/50 p-3 rounded-[8px] mt-1"
                        placeholder="Salon Name"
                      />
                      {errors.salonName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.salonName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      {/* <label className="text-vmb-text-main text-[14px] font-medium">
                        Address
                      </label> */}
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
                        className="w-full border border-vmb-primary/10 bg-white/50 p-3 rounded-[8px] mt-1"
                        placeholder="Address"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                    <div>
                      {/* <label className="text-vmb-text-main text-[14px] font-medium">
                        Zip Code
                      </label> */}
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
                        className="w-full border border-vmb-primary/10 bg-white/50 p-3 rounded-[8px] mt-1"
                        placeholder="Zip Code"
                      />
                      {errors.zipcode && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.zipcode.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <TimePicker
                        label="Start Time"
                        name="startTime"
                        control={control}
                      />

                      <TimePicker
                        label="End Time"
                        name="endTime"
                        control={control}
                      />
                    </div>

                    <div>
                      <label className="block text-vmb-text-main text-[14px] font-semibold mb-1">
                        Working Days
                      </label>
                      <div className="relative" ref={wrapperRef}>
                        <div
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="bg-white/50 border border-vmb-primary/10 rounded-md py-3 px-4 flex justify-between cursor-pointer"
                        >
                          <span className="text-[14px] text-vmb-text-muted">
                            {(() => {
                              const selected = watch("selectedDays") || [];
                              if (selected.length === 0) return "Select Days";

                              return days
                                .filter((day) => selected.includes(day))
                                .map((day) => day.slice(0, 3))
                                .join(", ");
                            })()}
                          </span>
                          <RiArrowDropDownLine className="text-[24px]" />
                        </div>
                        {isDropdownOpen && (
                          <div className="absolute w-full  mt-1 bg-white/50 border border-vmb-primary/10 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto custom-scrollbar p-3">
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
                    <div className="flex flex-col sm:flex-row justify-between mb-2 gap-2">
                      <div>
                        <label className="block text-vmb-text-main text-[16px] font-semibold">
                          View License Document
                        </label>
                        {watch("licenseDocument") && (
                          <p className="text-sm text-vmb-primary mt-1 break-all">
                            Uploaded:{" "}
                            {decodeURIComponent(
                              watch("licenseDocument")
                                .split("/")
                                .pop()
                                .split("?")[0]
                                .replace(/^\d+_/, ""),
                            )}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          watch("licenseDocument") &&
                          window.open(watch("licenseDocument"), "_blank")
                        }
                        disabled={!watch("licenseDocument")}
                        className="bg-vmb-secondary/30 text-vmb-secondary px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-vmb-secondary/50"
                      >
                        <FaFileAlt /> View
                      </button>
                    </div>
                    {isHold && (
                      <div>
                        <div className="flex flex-col sm:flex-row justify-between mb-2 gap-2">
                          <div>
                            <label className="block text-vmb-text-main text-[16px] font-semibold">
                              Upload Licensed Document
                            </label>
                            <span className="text-xs italic text-vmb-text-muted">
                              (png, jpeg, pdf)
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => docRef.current.click()}
                            className="bg-vmb-secondary/30 text-vmb-secondary px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-vmb-secondary/50"
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
                          <p className="text-sm text-vmb-primary mt-1">
                            Selected: {watch("licenseDocName")}
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      {/* <label className="block text-vmb-text-main font-medium mb-2">
                        Description
                      </label> */}
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
                        className="w-full border border-vmb-primary/10 bg-white/50 rounded-lg p-3"
                        placeholder="Description"
                      />
                      {errors.description && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-vmb-text-main font-semibold mb-2">
                        Salon Photos
                      </label>
                      <div className="flex  items-center gap-3">
                        <button
                          type="button"
                          onClick={() => photosRef.current.click()}
                          className="flex-shrink-0 w-[94px] h-[90px] border border-vmb-primary/10 bg-white rounded-md flex flex-col items-center justify-center hover:bg-vmb-bg-soft cursor-pointer"
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
                        <div className="w-full overflow-x-auto custom-scrollbar">
                          <div className="flex  pt-2 gap-2 sm:gap-3">
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
                                  className="absolute top-0 right-0 bg-vmb-secondary text-white w-5 h-5 rounded-full text-xs cursor-pointer"
                                >
                                  ×
                                </button>
                                <p className="text-xs text-gray-600 mt-1 truncate w-[80px]">
                                  {decodeURIComponent(
                                    photo.name
                                      .split("/")
                                      .pop()
                                      .split("?")[0]
                                      .replace(/^\d+_/, ""),
                                  )}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {errors.salonPhotos && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.salonPhotos.message}
                        </p>
                      )}
                    </div>
                  </div>
                </form>
                <AppButton
                  type="submit"
                  variant="primary"
                  className="w-full py-3 text-[16px] font-medium"
                  disabled={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                >
                  {isSubmitting ?
                    "Submitting..."
                  : isHold ?
                    "Resubmit Application"
                  : "Update Profile"}
                </AppButton>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
