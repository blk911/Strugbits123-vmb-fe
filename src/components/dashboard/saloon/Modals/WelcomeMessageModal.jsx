import React, { Fragment, useRef, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { FaVideo, FaRedo } from "react-icons/fa";

/**
 * Onboarding-style welcome video recorder (client-side preview until publish API exists).
 */
export default function WelcomeMessageModal({ isOpen, closeModal }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [isOpen]);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("video/")) return;
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#2a2420]/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#e8ddd4] bg-[#fffdfb] shadow-[0_28px_80px_-40px_rgba(164,95,118,0.45)]">
                <div className="flex items-start justify-between gap-4 border-b border-[#f0e8e2] px-6 py-4">
                  <div>
                    <Dialog.Title className="font-studio-serif text-xl text-[#333232]">
                      Record welcome message
                    </Dialog.Title>
                    <p className="mt-1 text-sm leading-relaxed text-[#6b6262]">
                      A short, selfie-style hello is often what clients connect
                      with first. Record or upload a clip to preview what
                      they&apos;ll see.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full p-2 text-[#6b5654] transition hover:bg-[#f5eee9]"
                    aria-label="Close"
                  >
                    <IoClose className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4 px-6 py-5">
                  <input
                    ref={inputRef}
                    type="file"
                    accept="video/*"
                    capture="user"
                    className="hidden"
                    onChange={onFile}
                  />

                  <div className="overflow-hidden rounded-xl bg-[#f5eee9] ring-1 ring-[#e2d6cf]">
                    {previewUrl ?
                      <video
                        src={previewUrl}
                        controls
                        playsInline
                        className="aspect-video w-full object-cover"
                      />
                    : <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="flex aspect-video w-full flex-col items-center justify-center gap-3 px-4 text-center transition hover:bg-[#efe6df]"
                      >
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/80 text-[#b88f45] shadow-sm ring-1 ring-[#e2d6cf]">
                          <FaVideo className="text-xl" aria-hidden />
                        </span>
                        <span className="text-sm font-semibold text-[#333232]">
                          Upload or record a short video
                        </span>
                        <span className="text-xs text-[#6b6262]">
                          Tip: 15–30 seconds, natural light, say your name and
                          welcome them in.
                        </span>
                      </button>
                    }
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {previewUrl ?
                      <>
                        <button
                          type="button"
                          onClick={() => inputRef.current?.click()}
                          className="inline-flex items-center gap-2 rounded-full border border-[#333232]/15 bg-white px-4 py-2 text-sm font-semibold text-[#333232] transition hover:bg-[#f9f5f2]"
                        >
                          <FaRedo className="text-xs" aria-hidden />
                          Choose different clip
                        </button>
                        <button
                          type="button"
                          onClick={closeModal}
                          className="rounded-full bg-[#b88f45] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#c0a05a]"
                        >
                          Save for now
                        </button>
                      </>
                    : null}
                  </div>

                  <p className="text-xs leading-relaxed text-[#8a7f7c]">
                    This preview stays on your device until a publish flow is
                    connected. You can refine your profile anytime in settings.
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
