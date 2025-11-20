import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState, useEffect } from "react";
import { IoClose, IoCamera } from "react-icons/io5";
import { FaClock, FaCalendarAlt, FaFileAlt, FaFileImage } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import defaultSalonImg from "../../../../assets/salon-1.png";
import uploadIcon from "../../../../assets/upload_photos.png";
import AppButton from "../../../common/site/AppButton";
import CustomCheckbox from "../../../common/site/CustomCheckbox";

const timeOptions = [
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
];
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function SalonProfileSettingsModal({ isOpen, closeModal }) {
  const logoRef = useRef();
  const docRef = useRef();
  const photosRef = useRef();
  const detailsRef = useRef(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [licenseFile, setLicenseFile] = useState(null);
  const [salonPhotos, setSalonPhotos] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
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
          <div className="fixed inset-0 bg-black/10 backdrop-blur-[5px]" />
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
              <Dialog.Panel className="relative w-full max-w-[900px] rounded-[10px] bg-[#FFFFFFE5] p-[30px] shadow-lg flex flex-col gap-[32px] max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                  <h2 className="text-[#581838] font-bold text-[24px]">
                    Profile Settings
                  </h2>
                  <IoClose
                    onClick={closeModal}
                    className="text-[#581838] text-[28px] cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-5">
                    <h3 className="text-[#581838] font-semibold text-[18px]">
                      Personal Information
                    </h3>
                    <div>
                      <label className="text-[#404040] text-[14px] font-medium">
                        Full Name
                      </label>
                      <input
                        className="w-full border border-[#E5E5E5] bg-white p-3 rounded-[8px] mt-1 text-[14px]"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="text-[#404040] text-[14px] font-medium">
                        Email
                      </label>
                      <input
                        className="w-full border border-[#E5E5E5] bg-white p-3 rounded-[8px] mt-1 text-[14px]"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <h3 className="text-[#581838] font-semibold text-[18px]">
                      Salon Information
                    </h3>

                    <div className="flex items-center gap-4">
                      <div className="relative w-[80px] h-[80px]">
                        <img
                          src={defaultSalonImg}
                          className="w-full h-full rounded-md object-cover border"
                          alt="Salon"
                        />
                        <button
                          type="button"
                          onClick={() => logoRef.current.click()}
                          className="absolute bottom-[-6px] right-[-6px] w-[32px] h-[32px] rounded-full bg-[#FF92A5] flex items-center justify-center shadow cursor-pointer"
                        >
                          <IoCamera className="text-white text-[18px]" />
                        </button>
                        <input
                          ref={logoRef}
                          type="file"
                          className="hidden"
                          accept="image/*"
                        />
                      </div>
                      <div>
                        <p className="text-[#581838] text-[16px] font-medium">
                          Bella Beauty Salon
                        </p>
                        <button
                          className="text-[#737373] text-[14px]  cursor-pointer"
                          onClick={() => logoRef.current.click()}
                        >
                          Upload Logo
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[#404040] text-[14px] font-medium">
                        Salon Name
                      </label>
                      <input
                        className="w-full border border-[#E5E5E5] bg-white p-3 rounded-[8px] mt-1 text-[14px]"
                        placeholder="Enter salon name"
                      />
                    </div>

                    <div>
                      <label className="text-[#404040] text-[14px] font-medium">
                        Address
                      </label>
                      <input
                        className="w-full border border-[#E5E5E5] bg-white p-3 rounded-[8px] mt-1 text-[14px]"
                        placeholder="Enter address"
                      />
                    </div>

                    <div>
                      <label className="text-[#404040] text-[14px] font-medium">
                        Phone
                      </label>
                      <input
                        className="w-full border border-[#E5E5E5] bg-white p-3 rounded-[8px] mt-1 text-[14px]"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="pt-6 flex flex-col gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#374151] text-[14px] font-semibold mb-1">
                            Start Time
                          </label>
                          <div className="relative">
                            <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF92A5]" />
                            <select
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              className="w-full bg-white border border-gray-300 rounded-md py-3 pl-10 pr-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF92A5]"
                            >
                              <option value="">Select</option>
                              {timeOptions.map((t) => (
                                <option key={t}>{t}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[#374151] text-[14px] font-semibold mb-1">
                            End Time
                          </label>
                          <div className="relative">
                            <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF92A5]" />
                            <select
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                              className="w-full bg-white border border-gray-300 rounded-md py-3 pl-10 pr-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF92A5]"
                            >
                              <option value="">Select</option>
                              {timeOptions.map((t) => (
                                <option key={t}>{t}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[#374151] text-[14px] font-semibold mb-1">
                            Working Days
                          </label>
                          <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF92A5] z-10" />
                            <RiArrowDropDownLine className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-[24px] pointer-events-none z-10" />

                            <div className="relative" ref={wrapperRef}>
                              <div
                                onClick={() =>
                                  setIsDropdownOpen(!isDropdownOpen)
                                }
                                className="bg-white border border-gray-300 rounded-md py-3 pl-10 pr-10 text-left text-[14px] text-gray-600 cursor-pointer"
                              >
                                {selectedDays.length > 0
                                  ? selectedDays
                                      .map((d) => d.slice(0, 3))
                                      .join(", ")
                                  : "Select Days"}
                              </div>

                              {isDropdownOpen && (
                                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50 max-h-60 overflow-y-auto">
                                  {days.map((day) => (
                                    <CustomCheckbox
                                      key={day}
                                      label={day}
                                      checked={selectedDays.includes(day)}
                                      onChange={() => toggleDay(day)}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <label className="block text-[#374151] text-[16px] font-semibold">
                              Upload Licensed Document
                            </label>
                            <span className="text-[12px] italic text-[#00000080]">
                              (png, jpeg, pdf)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => docRef.current.click()}
                            className="flex items-center gap-2 bg-[#FF92A54D] text-[#FF92A5] font-medium rounded-xl px-4 py-3 hover:bg-[#FF92A580] transition"
                          >
                            <FaFileAlt /> Upload
                          </button>
                        </div>
                        <input
                          ref={docRef}
                          type="file"
                          className="hidden"
                          accept=".png,.jpg,.jpeg,.pdf"
                          onChange={(e) =>
                            e.target.files[0] &&
                            setLicenseFile(e.target.files[0])
                          }
                        />
                        {licenseFile && (
                          <p className="mt-2 text-sm italic text-[#581838]">
                            Selected: {licenseFile.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[#404040] font-medium mb-2">
                          Description
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Enter salon description"
                          className="w-full border border-[#E5E5E5] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF92A5]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#374151] font-semibold mb-2">
                          Upload Salon Photos
                        </label>
                        <div className="flex flex-wrap items-start gap-3">
                          <button
                            type="button"
                            onClick={() => photosRef.current.click()}
                            className="flex-shrink-0 flex flex-col items-center justify-center w-[94px] h-[82px] border border-[#C0C0C0] bg-white rounded-md hover:bg-[#FFF4F6] transition"
                          >
                            <img
                              src={uploadIcon}
                              alt="Upload"
                              className="w-6 h-6 mb-1"
                            />
                            <span className="text-[9px] font-medium text-center">
                              Upload Salon
                              <br />
                              Photos
                            </span>
                          </button>

                          <input
                            ref={photosRef}
                            type="file"
                            multiple
                            className="hidden"
                            accept="image/*"
                            onChange={(e) =>
                              setSalonPhotos(Array.from(e.target.files))
                            }
                          />

                          <div className="flex flex-wrap gap-3">
                            {salonPhotos.map((file, i) => (
                              <img
                                key={i}
                                src={URL.createObjectURL(file)}
                                alt=""
                                className="w-[80px] h-[74px] object-cover rounded-md"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <AppButton
                  variant="primary"
                  size="custom"
                  className="text-[16px] font-medium  py-2 "
                  onClick={() => closeModal()}
                >
                  Update Profile
                </AppButton>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
