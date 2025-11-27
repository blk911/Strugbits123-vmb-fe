import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useRef, useEffect } from "react";
import { IoClose, IoCamera } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import AppButton from "../../../common/site/AppButton";
import defaultImg from "../../../../assets/salon-1.png";

const durations = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "1 hr", value: 60 },
  { label: "1.5 hr", value: 90 },
  { label: "2 hr", value: 120 },
  { label: "3 hr", value: 180 },
];

export default function AddServiceModal({
  isOpen,
  closeModal,
  initialData = null,
}) {
  const imgRef = useRef();
  const [imageFile, setImageFile] = useState(null);
  const [durationOpen, setDurationOpen] = useState(false);

  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("10");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setServiceName(initialData.name || "");
      setPrice(initialData.price || "");
      setDescription(initialData.description || "");
      setDiscount(initialData.discount ?? "10");
      setIsDefault(initialData.isDefault || false);
      setImageFile(null);

      const dur = durations.find((d) => d.value === initialData.duration);
      setSelectedDuration(dur ? dur.label : "");
    } else if (isOpen && !initialData) {
      setServiceName("");
      setPrice("");
      setDescription("");
      setDiscount("10");
      setIsDefault(false);
      setSelectedDuration("");
      setImageFile(null);
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    const durationInMinutes =
      durations.find((d) => d.label === selectedDuration)?.value || 60;

    const serviceData = {
      id: initialData?.id || Date.now().toString(),
      name: serviceName,
      price: Number(price),
      duration: durationInMinutes,
      description,
      discount: Number(discount),
      isDefault,
      image: imageFile
        ? URL.createObjectURL(imageFile)
        : initialData?.image || defaultImg,
    };

    closeModal();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 font-[Poppins]"
        onClose={closeModal}
      >
        <div className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
            >
              <Dialog.Panel className="w-full max-w-[460px] rounded-[10px] bg-[#e8e8e8] p-[26px] shadow-lg flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-[#581838] font-bold text-[24px]">
                    {initialData ? "Edit Service" : "Add Service"}
                  </h2>
                  <IoClose
                    className="text-[#581838] text-[26px] cursor-pointer"
                    onClick={closeModal}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative w-[80px] h-[80px]">
                    <img
                      src={
                        imageFile
                          ? URL.createObjectURL(imageFile)
                          : initialData?.image || defaultImg
                      }
                      alt="Service"
                      className="w-full h-full rounded-md object-cover border"
                    />
                    <button
                      onClick={() => imgRef.current.click()}
                      className="absolute bottom-[-6px] right-[-6px] w-[32px] h-[32px] rounded-full bg-[#FF92A5] flex items-center justify-center shadow"
                    >
                      <IoCamera className="text-white text-[18px]" />
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={imgRef}
                      className="hidden"
                      onChange={(e) =>
                        e.target.files[0] && setImageFile(e.target.files[0])
                      }
                    />
                  </div>
                  <div>
                    <p className="text-[#581838] text-[16px] font-medium">
                      Service Picture
                    </p>
                    <button
                      className="text-[#737373] text-[14px]"
                      onClick={() => imgRef.current.click()}
                    >
                      {imageFile || initialData?.image ? "Change" : "Upload"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[#404040] text-[14px] font-medium">
                    Service Name
                  </label>
                  <input
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full border border-[#E5E5E5] bg-white mt-1 p-3 rounded-[8px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#FF92A5]"
                    placeholder="Enter service name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#404040] text-[14px] font-medium">
                      Price
                    </label>
                    <input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      type="number"
                      className="w-full border border-[#E5E5E5] bg-white mt-1 p-3 rounded-[8px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#FF92A5]"
                      placeholder="Enter price"
                    />
                  </div>

                  <div className="relative">
                    <label className="text-[#404040] text-[14px] font-medium">
                      Duration
                    </label>
                    <div
                      onClick={() => setDurationOpen(!durationOpen)}
                      className="w-full border border-[#E5E5E5] bg-white mt-1 p-3 rounded-[8px] text-[14px] cursor-pointer flex justify-between items-center"
                    >
                      {selectedDuration || "Select Duration"}
                      <span className="text-gray-400">▼</span>
                    </div>

                    {durationOpen && (
                      <div className="absolute z-50 bg-white left-0 right-0 mt-1 border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {durations.map((d) => (
                          <div
                            key={d.value}
                            onClick={() => {
                              setSelectedDuration(d.label);
                              setDurationOpen(false);
                            }}
                            className="p-3 hover:bg-gray-100 cursor-pointer text-[14px]"
                          >
                            {d.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="border border-[#E5E5E5] bg-white rounded-[8px] p-4 flex gap-3 items-center">
                  <div
                    onClick={() => setIsDefault(!isDefault)}
                    className="w-[20px] h-[20px] border-2 border-[#FF92A5] rounded flex items-center justify-center cursor-pointer"
                  >
                    {isDefault && (
                      <FaCheck className="text-[#FF92A5] text-[14px]" />
                    )}
                  </div>
                  <p className="text-[#404040] text-[14px] font-medium">
                    Set as Default Service
                  </p>
                </div>

                <div>
                  <label className="text-[#404040] text-[14px] font-medium">
                    Service Discount (%)
                  </label>
                  <input
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    type="number"
                    min="0"
                    max="100"
                    className="w-full border border-[#E5E5E5] bg-white mt-1 p-3 rounded-[8px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#FF92A5]"
                  />
                </div>

                <div>
                  <label className="text-[#404040] text-[14px] font-medium">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter service description"
                    className="w-full border border-[#E5E5E5] bg-white rounded-lg p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-[#FF92A5]"
                  />
                </div>

                <AppButton
                  variant="primary"
                  className="py-3 text-[16px] font-medium"
                  onClick={handleSave}
                >
                  {initialData ? "Update Service" : "Add Service"}
                </AppButton>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
