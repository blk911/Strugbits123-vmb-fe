import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FiPlusSquare, FiSearch } from "react-icons/fi";

export default function AddServiceChoiceModal({ isOpen, onClose, onStartFromScratch }) {
  const navigate = useNavigate();

  const handleBrowsePresets = () => {
    onClose();
    navigate("/service-presets");
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <div className="fixed inset-0 bg-black/80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
            >
              <Dialog.Panel className="w-full max-w-[450px] transform overflow-hidden rounded-[20px] bg-white p-6 shadow-xl transition-all font-poppins">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-[22px] font-bold text-vmb-primary">
                    Add New Service
                  </Dialog.Title>
                  <IoClose
                    onClick={onClose}
                    className="text-vmb-primary text-3xl cursor-pointer hover:opacity-70"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={onStartFromScratch}
                    className="group p-5 rounded-[15px] border-2 border-vmb-primary/5 hover:border-vmb-secondary/50 hover:bg-vmb-secondary/5 transition-all text-left flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-vmb-secondary/10 flex items-center justify-center text-vmb-secondary group-hover:scale-110 transition-transform">
                       <FiPlusSquare size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-vmb-primary text-[17px]">Start from scratch</h4>
                      <p className="text-[14px] text-vmb-text-muted mt-0.5">Create a completely new service manually</p>
                    </div>
                  </button>

                  <button
                    onClick={handleBrowsePresets}
                    className="group p-5 rounded-[15px] border-2 border-vmb-primary/5 hover:border-vmb-secondary/50 hover:bg-vmb-secondary/5 transition-all text-left flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-vmb-secondary/10 flex items-center justify-center text-vmb-secondary group-hover:scale-110 transition-transform">
                       <FiSearch size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-vmb-primary text-[17px]">Browse presets</h4>
                      <p className="text-[14px] text-vmb-text-muted mt-0.5">Choose from templates assigned by admin</p>
                    </div>
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
