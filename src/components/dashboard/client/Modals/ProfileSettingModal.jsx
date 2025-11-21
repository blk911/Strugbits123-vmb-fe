import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import AppButton from "../../../common/site/AppButton";

export default function ProfileSettingsModal({ isOpen, closeModal, user }) {
  const mockUser = {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 555 123 4567",
  };

  const initialUserData = user || mockUser;

  const [form, setForm] = useState({
    fullName: initialUserData.fullName || "",
    email: initialUserData.email || "",
    phone: initialUserData.phone || "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    closeModal();
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

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                          name="fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          className="border border-[#E5E5E5] rounded-[8px] px-4 py-3 text-sm focus:outline-none focus:border-[#FF92A5] transition-colors"
                          placeholder="Enter full name"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[#404040] text-[14px] font-medium">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          className="border border-[#E5E5E5] rounded-[8px] px-4 py-3 text-sm focus:outline-none focus:border-[#FF92A5] transition-colors"
                          placeholder="Enter email"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[#404040] text-[14px] font-medium">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          className="border border-[#E5E5E5] rounded-[8px] px-4 py-3 text-sm focus:outline-none focus:border-[#FF92A5] transition-colors"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  </div>

                  <AppButton
                    type="submit"
                    variant="primary"
                    size="custom"
                    className="flex-1 text-[16px] font-medium py-3"
                  >
                    Update Profile
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
