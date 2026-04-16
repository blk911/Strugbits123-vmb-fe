import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa6";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";
import { useJoinWaitlistMutation } from "../../../../store/api/waitlistApi";

import QuestionMark from "../../../../assets/dotted_QuestionMark.png";
import greenHeart from "../../../../assets/greenHeart.png";
import Technician from "../../../../assets/technicianIcon.png";

const initialForm = {
  fullName: "",
  email: "",
  phoneNumber: "",
  zipcode: "",
  favoriteSalon: "",
};

export default function WaitlistModal({ isOpen, closeModal }) {
  const [form, setForm] = useState(initialForm);
  const [joinWaitlist, { isLoading, isSuccess, error, reset }] =
    useJoinWaitlistMutation();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.email) return;
    await joinWaitlist(form);
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        reset();
        setForm(initialForm);
        closeModal();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, closeModal, reset]);
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

        <div className="fixed inset-0 overflow-y-auto">
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
              <Dialog.Panel className="w-full max-w-[448px] bg-vmb-waitlist-bg rounded-[24px] py-[20px] px-[16px] sm:px-0 flex flex-col items-center font-inter shadow-xl">
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
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                  />

                  <InputField
                    icon={<FiMail />}
                    placeholder="Email Address"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />

                  <div className="flex flex-col sm:flex-row gap-[12px]">
                    <InputField
                      icon={<FiPhone />}
                      placeholder="Phone Number"
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      className="w-full sm:w-[276px]"
                    />
                    <InputField
                      icon={<FiMail />}
                      placeholder="ZIP"
                      name="zipcode"
                      value={form.zipcode}
                      onChange={handleChange}
                      className="w-full sm:w-[112px]"
                    />
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
                      name="favoriteSalon"
                      value={form.favoriteSalon}
                      onChange={handleChange}
                      placeholder="Enter salon or technician name"
                      className="bg-transparent w-full outline-none text-sm placeholder:text-vmb-text-gray"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-vmb-error text-sm text-center mt-2">
                    {error?.data?.message || "Something went wrong"}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={isLoading || isSuccess}
                  className={`w-full max-w-[400px] h-[56px] mt-[30px] rounded-[20px] flex items-center justify-center gap-2 text-white font-semibold text-[16px] cursor-pointer transition-colors ${
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
                  className="text-[14px] text-vmb-text-light font-medium cursor-pointer mt-[16px]"
                  onClick={closeModal}
                >
                  Skip for now
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

function InputField({
  icon,
  placeholder,
  name,
  value,
  onChange,
  className = "",
}) {
  return (
    <div
      className={`flex items-center bg-white border border-vmb-border-gray rounded-[14px] px-4 h-[50px] shadow-sm w-full ${className}`}
    >
      <div className="text-vmb-green/60 mr-2 shrink-0">{icon}</div>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full outline-none text-sm placeholder:text-vmb-text-gray"
      />
    </div>
  );
}
