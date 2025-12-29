import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useEffect } from "react";
import { IoClose, IoCamera } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import AppButton from "../../../common/site/AppButton";
import defaultImg from "../../../../assets/salon-1.png";
import { useForm, Controller } from "react-hook-form";
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
} from "../../../../store/api/salonApi";
import {
  toastLoading,
  toastSuccess,
  toastError,
  toastDismiss,
} from "../../../../utils/toast";
import { useGetUploadUrlMutation } from "../../../../store/api";

const durations = [
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "1 hr", value: 60 },
  { label: "1.5 hr", value: 90 },
  { label: "1.75 hr", value: 105 },
  { label: "2 hr", value: 120 },
  { label: "2.5 hr", value: 150 },
  { label: "2.75 hr", value: 165 },
  { label: "3 hr", value: 180 },
];

export default function AddServiceModal({
  isOpen,
  closeModal,
  initialData = null,
}) {
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [getUploadUrl, { isLoading: uploading }] = useGetUploadUrlMutation();
  const isLoading = isCreating || isUpdating;
  const isEditMode = !!initialData;
  const imgRef = useRef();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const watchedImage = watch("serviceImage");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          serviceName: initialData.serviceName || "",
          servicePrice: initialData.servicePrice || "",
          serviceDuration:
            durations.find((d) => d.value === initialData.serviceDuration)
              ?.label || "",
          description: initialData.description || "",
          serviceDiscount: initialData.serviceDiscount ?? "",
          isDefault: initialData.isDefault || false,
          serviceImage: null,
        });
      } else {
        reset({
          serviceName: "",
          servicePrice: "",
          serviceDuration: "",
          description: "",
          serviceDiscount: "",
          isDefault: false,
          serviceImage: null,
        });
      }
    }
  }, [isOpen, initialData, reset]);
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toastLoading("Uploading image...");

    try {
      const fileName = `services/${Date.now()}_${file.name.replace(
        /[^a-zA-Z0-9.-]/g,
        "_"
      )}`;
      const { data } = await getUploadUrl({
        fileName,
        fileType: file.type || "application/octet-stream",
      }).unwrap();

      await fetch(data.uploadUrl || data, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      const publicUrl = (data.uploadUrl || data).split("?")[0];

      setValue("serviceImage", [{ url: publicUrl, name: file.name }], {
        shouldValidate: true,
      });
      toastDismiss(toastId);
      toastSuccess("Image uploaded!");
    } catch (err) {
      toastDismiss(toastId);
      toastError("Failed to upload image");
      console.error(err);
    }
  };
  const onSubmit = async (data) => {
    try {
      const valuesForBackend = {
        ...data,
        serviceDuration:
          durations.find((d) => d.label === data.serviceDuration)?.value || 60,
        serviceImage:
          data.serviceImage?.[0]?.url || initialData?.serviceImage || null,
      };

      if (isEditMode) {
        await updateService({
          id: initialData._id,
          data: valuesForBackend,
        }).unwrap();
        toastSuccess("Service updated successfully!");
      } else {
        await createService(valuesForBackend).unwrap();
        toastSuccess("Service added successfully!");
      }
      closeModal();
    } catch (err) {
      console.error(err);
      toastError(err?.data?.message || "Failed to add service");
    }
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 font-[Poppins]"
        onClose={closeModal}
      >
        <div className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
            >
              <Dialog.Panel className="w-full max-w-[480px] rounded-[12px] bg-[#e8e8e8] p-[30px] shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[24px] font-bold text-[#581838]">
                    {initialData ? "Edit Service" : "Add Service"}
                  </h2>
                  <IoClose
                    onClick={closeModal}
                    className="text-[#581838] text-3xl cursor-pointer hover:opacity-70"
                  />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <Controller
                    name="serviceImage"
                    control={control}
                    rules={{
                      required: isEditMode
                        ? false
                        : "Service image is required",
                    }}
                    render={({ field }) => (
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          <img
                            src={
                              watchedImage?.[0]?.url ||
                              (watchedImage?.[0]
                                ? URL.createObjectURL(watchedImage[0])
                                : initialData?.serviceImage || defaultImg)
                            }
                            alt="Service"
                            className="w-24 h-24 rounded-lg object-cover border-2 border-dashed border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => imgRef.current?.click()}
                            disabled={uploading}
                            className={`absolute bottom-0 right-0 cursor-pointer w-9 h-9 bg-[#FF92A5] rounded-full flex items-center justify-center shadow-lg ${
                              uploading ? "opacity-50" : ""
                            }`}
                          >
                            <IoCamera className="text-white text-xl" />
                          </button>
                          <input
                            type="file"
                            accept="image/*"
                            ref={imgRef}
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-[#581838]">
                            Service Picture
                          </p>
                          <p className="text-sm text-gray-600">
                            {watchedImage?.[0]?.name ||
                              (watchedImage?.[0] ? "Image selected" : "Upload")}
                          </p>
                        </div>
                      </div>
                    )}
                  />
                  {errors.serviceImage && (
                    <p className="text-red-500 text-xs mt-2 ml-1">
                      {errors.serviceImage.message}
                    </p>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Service Name *
                    </label>
                    <input
                      {...register("serviceName", {
                        required: "Service name is required",
                        pattern: {
                          value: /^[A-Za-z\s]+$/i,
                          message: "Service name must contain only letters",
                        },
                      })}
                      onChange={(e) => {
                        let value = e.target.value;

                        if (value.startsWith(" ")) {
                          value = value.trimStart();
                          e.target.value = value;
                        }

                        register("serviceName").onChange(e);
                      }}
                      className="mt-1 w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF92A5] focus:border-none"
                      placeholder="e.g. Classic Haircut"
                    />
                    {errors.serviceName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.serviceName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Price ($)*
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register("servicePrice", {
                          required: "Price is required",
                          min: {
                            value: 0.01,
                            message: "Price must be greater than 0",
                          },
                        })}
                        className="mt-1 w-full bg-white px-4 py-3  rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF92A5] focus:border-none"
                        placeholder="50.00"
                      />
                      {errors.servicePrice && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.servicePrice.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Duration *
                      </label>
                      <Controller
                        name="serviceDuration"
                        control={control}
                        rules={{ required: "Please select a duration" }}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="mt-1 bg-white w-full px-4 py-3  rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF92A5] focus:border-none"
                          >
                            <option value="">Select duration</option>
                            {durations.map((d) => (
                              <option key={d.value} value={d.label}>
                                {d.label}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                      {errors.serviceDuration && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.serviceDuration.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-[10px] p-[10px] flex flex-col gap-[20px] ">
                    <Controller
                      name="isDefault"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center gap-3 ">
                          <div
                            onClick={() => setValue("isDefault", !field.value)}
                            className="w-4 h-4 rounded border-2 border-[#FF92A5] flex items-center justify-center"
                          >
                            {field.value && (
                              <FaCheck className="text-[#FF92A5] text-sm cursor-pointer" />
                            )}
                          </div>
                          <span
                            className="text-gray-700 cursor-pointer"
                            onClick={() => setValue("isDefault", !field.value)}
                          >
                            Set as default service
                          </span>
                        </label>
                      )}
                    />
                    <label className="block text-sm font-medium text-gray-700">
                      Service Discount (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      {...register("serviceDiscount")}
                      className="mt-1 w-full bg-[#9CA3AF4D] px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF92A5] focus:border-none rounded-lg"
                      placeholder="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      {...register("description")}
                      onChange={(e) => {
                        let value = e.target.value;

                        if (value.startsWith(" ")) {
                          value = value.trimStart();
                          e.target.value = value;
                        }

                        register("description").onChange(e);
                      }}
                      className="mt-1 bg-white w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF92A5] focus:border-none rounded-lg"
                      placeholder="Describe your service..."
                    />
                  </div>

                  <AppButton
                    type="submit"
                    variant="primary"
                    className="w-full py-4 text-lg font-medium"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Saving Service..."
                      : initialData
                      ? "Update Service"
                      : "Add Service"}
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
