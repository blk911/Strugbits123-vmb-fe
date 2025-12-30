import React, { Fragment, useRef, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose, IoCamera } from "react-icons/io5";
import AppButton from "../../../common/site/AppButton";
import { useForm } from "react-hook-form";
import {
  useUpdateMeMutation,
  useGetUploadUrlMutation,
} from "../../../../store/api";
import {
  toastLoading,
  toastSuccess,
  toastError,
  toastDismiss,
} from "../../../../utils/toast";
import { setUser } from "../../../../store/features/userSlice";
import { useDispatch } from "react-redux";

export default function ProfileSettingsModal({ isOpen, closeModal, user }) {
  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();
  const [getUploadUrl, { isLoading: uploading }] = useGetUploadUrlMutation();
  const [previewImage, setPreviewImage] = useState(user?.userProfile || "");
  const dispatch = useDispatch();
  const imgRef = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    if (isOpen && user) {
      reset({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
      });
      setPreviewImage(user.userProfile || user?.profilePic || "");
    }
  }, [isOpen, user, reset]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toastLoading("Uploading image...");

    try {
      const fileName = `profiles/${Date.now()}_${file.name.replace(
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
      setPreviewImage(publicUrl);
      setValue("userProfile", publicUrl);

      toastDismiss(toastId);
      toastSuccess("Profile picture updated!");
    } catch (err) {
      toastDismiss(toastId);
      toastError("Failed to upload image");
      console.error(err);
    }
  };
  const preventLeadingSpace = (originalOnChange) => (e) => {
    let value = e.target.value;
    if (value.startsWith(" ")) {
      value = value.trimStart();
      e.target.value = value;
    }
    originalOnChange(e);
  };
  const onSubmit = async (data) => {
    try {
      const payload = {
        ...user,
        name: data.fullName,
        email: data.email,
        phoneNumber: data.phone || null,
        userProfile: previewImage,
      };

      const res = await updateMe(payload).unwrap();
      dispatch(setUser(res?.data));
      toastSuccess(res?.message || "Profile updated successfully!");
      closeModal();
    } catch (err) {
      toastError(err?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 font-[Poppins]"
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
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
              <Dialog.Panel className="w-full max-w-[480px] bg-white rounded-[10px] p-[30px] shadow-xl flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-[24px] font-bold text-[#581838]">
                    Profile Settings
                  </h2>
                  <IoClose
                    onClick={closeModal}
                    className="text-[#581838] text-3xl cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-6"
                >
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-[126px] h-[126px] rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <img
                          src={
                            previewImage || "https://via.placeholder.com/126"
                          }
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => imgRef.current?.click()}
                        disabled={uploading}
                        className={`absolute cursor-pointer bottom-0 right-0 w-10 h-10 bg-[#FF92A5] rounded-full flex items-center justify-center shadow-lg border-4 border-white transition ${
                          uploading
                            ? "opacity-70 cursor-not-allowed"
                            : "hover:bg-[#e07a8c]"
                        }`}
                      >
                        <IoCamera className="text-white text-xl" />
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={imgRef}
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[18px] font-semibold text-[#581838] mb-4">
                      Personal Information
                    </h3>
                    <div className="space-y-5">
                      <div className="flex flex-col gap-1">
                        <label className="text-[#404040] text-[14px] font-medium">
                          Full Name
                        </label>
                        <input
                          type="text"
                          {...register("fullName", {
                            required: "Full name is required",
                            pattern: {
                              value: /^[a-zA-Z\s'-]+$/,
                              message: "Invalid name",
                            },
                          })}
                          onChange={preventLeadingSpace(
                            register("fullName").onChange
                          )}
                          className="border border-[#E5E5E5] rounded-[8px] px-4 py-3 text-sm focus:outline-none focus:border-[#FF92A5] transition-colors"
                          placeholder="Enter full name"
                        />
                        {errors.fullName && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[#404040] text-[14px] font-medium">
                          Email
                        </label>
                        <input
                          type="text"
                          readOnly
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value:
                                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                              message: "Please enter a valid email address",
                            },
                          })}
                          onChange={preventLeadingSpace(
                            register("email").onChange
                          )}
                          className="border border-[#E5E5E5] rounded-[8px] px-4 py-3 text-sm focus:outline-none focus:border-[#FF92A5] transition-colors"
                          placeholder="Enter email"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[#404040] text-[14px] font-medium">
                          Phone
                        </label>
                        <input
                          type="tel"
                          {...register("phone", {
                            required: "Phone number is required",
                            pattern: {
                             value: /^\d{10,15}$/,
                              message: "Please enter a valid phone number",
                            },
                          })}
                          onChange={preventLeadingSpace(
                            register("phone").onChange
                          )}
                          className="border border-[#E5E5E5] rounded-[8px] px-4 py-3 text-sm focus:outline-none focus:border-[#FF92A5] transition-colors"
                          placeholder="Enter phone number"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <AppButton
                    type="submit"
                    variant="primary"
                    size="custom"
                    className="text-[16px] font-medium py-3 w-full"
                    disabled={isUpdating || uploading}
                  >
                    {isUpdating || uploading ? "Updating..." : "Update Profile"}
                  </AppButton>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
