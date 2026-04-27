import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa6";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useJoinWaitlistMutation } from "../../../../store/api/waitlistApi";

import QuestionMark from "../../../../assets/dotted_QuestionMark.png";
import greenHeart from "../../../../assets/greenHeart.png";
import Technician from "../../../../assets/technicianIcon.png";

const waitlistSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(3, "Min 3 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[0-9+-\s()]*$/, "Invalid phone number")
    .min(7, "Too short"),
  zipcode: z
    .string()
    .min(1, "ZIP is required")
    .regex(/^\d{5}$/, "5 digits"),
  favoriteSalon: z.string().min(1, "Salon name is required"),
});

export default function WaitlistModal({ isOpen, closeModal }) {
  const {
    register,
    handleSubmit,
    reset: formReset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      zipcode: "",
      favoriteSalon: "",
    },
  });

  const [joinWaitlist, { isLoading, isSuccess, error, reset: apiReset }] =
    useJoinWaitlistMutation();

  const onSubmit = async (data) => {
    if (!data.fullName || !data.email) return;
    await joinWaitlist(data);
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        apiReset();
        formReset();
        closeModal();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, closeModal, apiReset, formReset]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[448px] bg-vmb-waitlist-bg rounded-[24px] py-[20px] px-[16px] sm:px-[24px] flex flex-col items-center font-inter shadow-xl">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="w-full flex flex-col items-center"
                >
                  <div className="w-full max-w-[400px] flex flex-col gap-[12px]">
                    <div className="relative flex justify-center">
                      <div className="w-[48px] h-[48px] bg-vmb-green/10 rounded-full flex items-center justify-center">
                        <img src={QuestionMark} alt="icon" />
                      </div>

                      <IoClose
                        onClick={closeModal}
                        size={24}
                        className="absolute right-0 text-vmb-text-gray cursor-pointer"
                      />
                    </div>

                    <h2 className="text-[20px] sm:text-[24px] font-bold text-vmb-text-dark text-center">
                      Join the Waitlist
                    </h2>

                    <p className="text-[13px] sm:text-[14px] text-vmb-text-light text-center mx-auto max-w-[320px]">
                      Be the first to bring your favorite salon on board
                    </p>
                  </div>

                  <div className="w-full max-w-[400px] flex flex-col gap-[16px] mt-[30px]">
                    <InputField
                      icon={<FiUser />}
                      placeholder="Full Name"
                      error={errors.fullName}
                      {...register("fullName")}
                    />

                    <InputField
                      icon={<FiMail />}
                      placeholder="Email Address"
                      error={errors.email}
                      {...register("email")}
                    />

                    <div className="flex flex-col sm:flex-row gap-[12px] items-start">
                      <div className="w-full sm:w-[276px]">
                        <InputField
                          icon={<FiPhone />}
                          placeholder="Phone Number"
                          error={errors.phoneNumber}
                          {...register("phoneNumber")}
                        />
                      </div>
                      <div className="w-full sm:w-[112px]">
                        <InputField
                          icon={<FiMail />}
                          placeholder="ZIP"
                          error={errors.zipcode}
                          {...register("zipcode")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-[400px] mt-[30px] bg-white border border-vmb-border-light rounded-[16px] p-[16px] sm:p-[20px] flex flex-col gap-[8px] shadow-sm">
                    <div className="flex items-center gap-[8px]">
                      <p className="text-[14px] sm:text-[16px] font-semibold text-vmb-text-dark">
                        Let’s add your favorite salon next
                      </p>
                      <img src={greenHeart} alt="icon" />
                    </div>

                    <p className="text-[12px] text-vmb-text-light">
                      What's the name of your favorite salon or technician?
                    </p>

                    <div className="flex items-center bg-vmb-waitlist-bg border border-black/10 rounded-[12px] px-3 h-[46px]">
                      <img
                        src={Technician}
                        className="mr-2 shrink-0"
                        alt="icon"
                      />
                      <input
                        type="text"
                        placeholder="Enter salon or technician name"
                        className="bg-transparent w-full outline-none text-sm placeholder:text-vmb-text-gray"
                        {...register("favoriteSalon")}
                      />
                    </div>
                    {errors.favoriteSalon && (
                      <p className="text-vmb-error text-[10px] mt-1 ml-1 font-medium">
                        {errors.favoriteSalon.message}
                      </p>
                    )}
                  </div>

                  {error && (
                    <p className="text-vmb-error text-sm text-center mt-4">
                      {error?.data?.message || "Something went wrong"}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || isSuccess}
                    className={`w-full max-w-[400px] h-[56px] mt-[30px] cursor-pointer rounded-[20px] flex items-center justify-center gap-2 text-white font-semibold text-[16px] transition-colors ${
                      isSuccess ? "bg-vmb-success" : (
                        "bg-vmb-green hover:brightness-95"
                      )
                    } disabled:opacity-70`}
                  >
                    {isLoading ?
                      "Submitting..."
                    : isSuccess ?
                      "You're on the list! 🎉"
                    : <>
                        Submit
                        <FaArrowRight />
                      </>
                    }
                  </button>

                  <button
                    type="button"
                    className="text-[14px] text-vmb-text-light font-medium cursor-pointer mt-[16px] hover:text-vmb-text-dark transition-colors"
                    onClick={closeModal}
                  >
                    Skip for now
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

function InputField({ icon, placeholder, error, className = "", ...props }) {
  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      <div
        className={`flex items-center bg-white border ${
          error ? "border-vmb-error/50" : "border-vmb-border-gray"
        } rounded-[14px] px-4 h-[50px] shadow-sm w-full transition-colors`}
      >
        <div
          className={`mr-2 shrink-0 ${
            error ? "text-vmb-error" : "text-vmb-green/60"
          }`}
        >
          {icon}
        </div>
        <input
          type="text"
          placeholder={placeholder}
          className="w-full outline-none text-sm placeholder:text-vmb-text-gray bg-transparent"
          {...props}
        />
      </div>
      {error && (
        <p className="text-vmb-error text-[10px] ml-1 font-medium">
          {error.message}
        </p>
      )}
    </div>
  );
}
