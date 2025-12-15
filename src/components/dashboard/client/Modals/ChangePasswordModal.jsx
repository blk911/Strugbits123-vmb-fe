import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import AppButton from "../../../common/site/AppButton";
import { useChangePasswordMutation } from "../../../../store/api";
import { toastError, toastSuccess } from "../../../../utils/toast";

export default function ChangePasswordModal({ isOpen, closeModal }) {
  const [changePassword, { isLoading, isError, error }] =
    useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const newPassword = watch("newPassword");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      reset();
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      toastSuccess(res?.data?.message || "Password changed successfully!");
      reset();
      closeModal();
    } catch (err) {
      toastError(err?.data?.message || "Failed to change password.");
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
              <Dialog.Panel className="w-full max-w-[460px] bg-[#E8E8E8] rounded-[10px] p-[20px] shadow-xl flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-[18px] font-semibold text-[#581838]">
                    Change Password
                  </h2>
                  <IoClose
                    onClick={closeModal}
                    className="text-[#581838] text-3xl cursor-pointer hover:opacity-80 transition ml-auto"
                  />
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-6"
                >
                  <div className="bg-white border border-[#0000001A] rounded-[20px] p-[20px] flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                      <label className="text-[#404040] text-[14px] font-medium">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrent ? "text" : "password"}
                          {...register("currentPassword", {
                            required: "Current password is required",
                          })}
                          className="w-full border border-[#E5E5E5] rounded-[8px] py-[10px] pl-2 pr-12 text-sm focus:outline-none focus:border-[#581838] transition"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FF92A5] hover:text-[#ff7a8a] transition"
                        >
                          {showCurrent ? (
                            <FaEyeSlash size={18} />
                          ) : (
                            <FaEye size={18} />
                          )}
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.currentPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[#404040] text-[14px] font-medium">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNew ? "text" : "password"}
                          {...register("newPassword", {
                            required: "New password is required",
                            minLength: {
                              value: 6,
                              message: "Password must be at least 6 characters",
                            },
                          })}
                          className="w-full border border-[#E5E5E5] rounded-[8px] py-[10px] pl-2  pr-12 text-sm focus:outline-none focus:border-[#581838] transition"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FF92A5] hover:text-[#ff7a8a] transition"
                        >
                          {showNew ? (
                            <FaEyeSlash size={18} />
                          ) : (
                            <FaEye size={18} />
                          )}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[#404040] text-[14px] font-medium">
                        Re-type New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirm ? "text" : "password"}
                          {...register("confirmPassword", {
                            required: "Please confirm your new password",
                            validate: (value) =>
                              value === newPassword || "Passwords do not match",
                          })}
                          className="w-full border border-[#E5E5E5] rounded-[8px] py-[10px] pl-2  pr-12 text-sm focus:outline-none focus:border-[#581838] transition"
                          placeholder="Re-type new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FF92A5] hover:text-[#ff7a8a] transition"
                        >
                          {showConfirm ? (
                            <FaEyeSlash size={18} />
                          ) : (
                            <FaEye size={18} />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {isError && (
                    <p className="text-red-600 text-center text-sm font-medium">
                      {error?.data?.message ||
                        "Failed to change password. Please try again."}
                    </p>
                  )}

                  <AppButton
                    type="submit"
                    variant="primary"
                    size="custom"
                    className="text-[16px] font-medium py-3 w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Changing Password..." : "Change Password"}
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
