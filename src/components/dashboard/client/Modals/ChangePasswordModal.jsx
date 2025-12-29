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
  const PasswordInput = ({ label, name, register, errors, show, setShow }) => {
    let autoCompleteValue = "new-password";

    if (label.includes("Current")) {
      autoCompleteValue = "current-password";
    }

    return (
      <div className="flex flex-col gap-1">
        <label className="text-[#404040] text-[14px] font-medium">
          {label}
        </label>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            autoComplete={autoCompleteValue}
            {...register(name, {
              required: label.includes("Current")
                ? "Current password is required"
                : label.includes("New")
                ? "New password is required"
                : "Please confirm your new password",
              minLength:
                name === "newPassword"
                  ? {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    }
                  : undefined,
              validate:
                name === "confirmPassword"
                  ? (value) =>
                      value === watch("newPassword") || "Passwords do not match"
                  : undefined,
            })}
            onChange={(e) => {
              let value = e.target.value;
              if (value.startsWith(" ")) {
                value = value.trimStart();
                e.target.value = value;
              }
              const event = {
                ...e,
                target: { ...e.target, value },
              };
              register(name).onChange(event);
            }}
            className="w-full border border-[#E5E5E5] rounded-[8px] py-[10px] pl-2 pr-12 text-sm focus:outline-none focus:border-[#581838] transition"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-[#FF92A5] hover:text-[#ff7a8a] transition"
          >
            {show ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
          </button>
        </div>
        {errors[name] && (
          <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
        )}
      </div>
    );
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
                    <PasswordInput
                      label="Current Password"
                      name="currentPassword"
                      register={register}
                      errors={errors}
                      show={showCurrent}
                      setShow={setShowCurrent}
                    />

                    <PasswordInput
                      label="New Password"
                      name="newPassword"
                      register={register}
                      errors={errors}
                      show={showNew}
                      setShow={setShowNew}
                    />

                    <PasswordInput
                      label="Re-type New Password"
                      name="confirmPassword"
                      register={register}
                      errors={errors}
                      show={showConfirm}
                      setShow={setShowConfirm}
                    />
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
