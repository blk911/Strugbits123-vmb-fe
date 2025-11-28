import React, { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import AppButton from "../../../common/site/AppButton";
import { useUpdateMeMutation } from "../../../../store/api";
import { toastError, toastSuccess } from "../../../../utils/toast";

export default function ProfileSettingsModal({ isOpen, closeModal, user }) {
  const [updateMe, { isLoading, isSuccess, isError, error }] =
    useUpdateMeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (isOpen && user) {
      reset({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [isOpen, user, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await updateMe({
        name: data.fullName,
        email: data.email,
        phoneNumber: data.phone || null,
      }).unwrap();

      toastSuccess(res?.message || "Profile updated successfully!");
      closeModal();
    } catch (err) {
      toastError(err?.data?.message || "Failed to Update profile.");
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

        <div className="fixed inset-0 overflow-y-auto">
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
                          })}
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
                          type="email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value:
                                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                              message: "Please enter a valid email address",
                            },
                          })}
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
                          {...register("phone")}
                          className="border border-[#E5E5E5] rounded-[8px] px-4 py-3 text-sm focus:outline-none focus:border-[#FF92A5] transition-colors"
                          placeholder="Enter phone number (optional)"
                        />
                      </div>
                    </div>
                  </div>

                  <AppButton
                    type="submit"
                    variant="primary"
                    size="custom"
                    className="text-[16px] font-medium py-3 w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating Profile..." : "Update Profile"}
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
