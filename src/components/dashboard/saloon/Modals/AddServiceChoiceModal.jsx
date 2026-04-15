import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FiClipboard, FiPlusCircle } from "react-icons/fi";
import ClipBoard from "../../../../assets/clipboard.png";
import ZoomIn from "../../../../assets/zoom-in.png";
export default function AddServiceChoiceModal({
  isOpen,
  onClose,
  onStartFromScratch,
}) {
  const navigate = useNavigate();

  const handleBrowsePresets = () => {
    onClose();
    navigate("/service-presets");
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[60] font-poppins"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <div className="fixed inset-0 bg-vmb-overlay-bg" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
            >
              <Dialog.Panel className="w-full max-w-[447px] min-h-[248px] transform overflow-hidden rounded-[10px] backdrop-blur-[1px]  bg-vmb-modals-bg p-[30px] flex flex-col gap-[12px] shadow-xl transition-all relative">
                {/* Close Button */}
                <div className="absolute top-[20px] right-[20px]">
                  <IoClose
                    onClick={onClose}
                    className="text-vmb-primary text-[24px] cursor-pointer hover:opacity-70"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col items-center text-center gap-[4px] mt-2">
                  <Dialog.Title className="text-[20px] font-bold text-vmb-primary">
                    Add a Service
                  </Dialog.Title>
                  <p className="text-[14px] text-[#404040] leading-[20px] max-w-[340px]">
                    Choose how you’d like to create your service. Start from
                    scratch or use a preset to save time.
                  </p>
                </div>

                {/* Options Grid */}
                <div className="w-full max-w-[387px] grid grid-cols-2 gap-[10px] mx-auto mt-2">
                  <button
                    onClick={onStartFromScratch}
                    className="h-[97px] bg-white cursor-pointer border border-vmb-primary/10 rounded-[10px] flex flex-col items-center justify-center gap-[6px] hover:border-vmb-secondary hover:bg-vmb-bg-soft transition-all group"
                  >
                    <div className="w-[44px] h-[44px] flex items-center justify-center text-vmb-secondary group-hover:scale-110 transition-transform">
                      {/* <FiClipboard size={28} /> */}
                      <img
                        src={ClipBoard}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[14px] font-medium text-vmb-primary">
                      Start from Scratch
                    </span>
                  </button>

                  <button
                    onClick={handleBrowsePresets}
                    className="h-[97px] bg-white cursor-pointer border border-vmb-primary/10 rounded-[10px] flex flex-col items-center justify-center gap-[6px] hover:border-vmb-secondary hover:bg-vmb-bg-soft transition-all group"
                  >
                    <div className="w-[44px] h-[44px] flex items-center justify-center text-vmb-secondary group-hover:scale-110 transition-transform">
                      {/* <FiPlusCircle size={28} /> */}
                      <img
                        src={ZoomIn}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[14px] font-medium text-vmb-primary">
                      Browse Presets
                    </span>
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
