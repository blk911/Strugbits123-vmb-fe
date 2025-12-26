import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function GalleryModal({
  isOpen,
  closeModal,
  images = [],
  startIndex = 0,
}) {
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    if (isOpen) setCurrent(startIndex);
  }, [isOpen, startIndex]);

  const prev = () => setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));

  if (!images.length) return null;

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
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-6">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className="
                relative w-full
                max-w-[95vw]
                sm:max-w-[90vw]
                lg:max-w-[1120px]
                aspect-[4/3]
                bg-transparent
                overflow-hidden
              "
            >
              <img
                src={images[current]}
                alt={`gallery-${current}`}
                className="w-full h-full object-fit select-none"
              />

              <button
                onClick={prev}
                className="
                  absolute left-2 sm:left-4 top-1/2 -translate-y-1/2
                  w-[28px] h-[28px] sm:w-[32px] sm:h-[32px]
                  bg-white rounded-full flex items-center justify-center
                  shadow-md z-20
                "
              >
                <FaChevronLeft className="text-[#64748B] cursor-pointer text-xs sm:text-sm" />
              </button>

              <button
                onClick={next}
                className="
                  absolute right-2 sm:right-4 top-1/2 -translate-y-1/2
                  w-[28px] h-[28px] sm:w-[32px] sm:h-[32px]
                  bg-white rounded-full flex items-center justify-center
                  shadow-md z-20
                "
              >
                <FaChevronRight className="text-[#64748B] cursor-pointer text-xs sm:text-sm" />
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
