import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLock,
  FaPhoneAlt,
  FaFileImage,
} from "react-icons/fa";
import { useFormContext } from "react-hook-form";
import InputWithIcon from "../../../components/common/site/InputWithIcon";
import AuthButton from "../../../components/common/site/AuthButton";
import { useRef } from "react";
import { useGetUploadUrlMutation } from "../../../store/api";
import {
  toastLoading,
  toastSuccess,
  toastError,
  toastDismiss,
} from "../../../utils/toast";
export default function SignupStep1({ userType, setUserType, onNext }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    trigger,
  } = useFormContext();
  const picRef = useRef();
  const [getUploadUrl, { isLoading: uploading }] = useGetUploadUrlMutation();
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const originalFileName = file.name;
    const toastId = toastLoading("Uploading image...");
    try {
      const { data } = await getUploadUrl({
        fileName: `profiles/${Date.now()}_${file.name}`,
        fileType: file.type,
      }).unwrap();

      await fetch(data, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      const publicUrl = data.split("?")[0];
      setValue("userProfile", publicUrl, { shouldValidate: true });
      setValue("uploadedFileName", originalFileName);
      toastDismiss(toastId);
      toastSuccess("Image uploaded successfully!");
    } catch (err) {
      toastDismiss(toastId);
      toastError("Failed to upload image");
      console.error(err);
    }
  };
  const handleNext = async () => {
    const valid = await trigger();
    if (valid) onNext?.();
  };

  return (
    <div className="w-full space-y-4">
      <label className="block text-[#581838] font-medium">I am</label>
      <div className="flex gap-6 mb-2">
        <label className="flex items-center gap-2 text-[#581838] font-medium cursor-pointer">
          <input
            type="radio"
            checked={userType === "customer"}
            onChange={() => setUserType("customer")}
            className="accent-[#581838] w-4 h-4"
          />
          Customer
        </label>
        <label className="flex items-center gap-2 text-[#581838] font-medium cursor-pointer">
          <input
            type="radio"
            checked={userType === "salon"}
            onChange={() => setUserType("salon")}
            className="accent-[#581838] w-4 h-4"
          />
          Salon Owner
        </label>
      </div>

      <InputWithIcon
        label="Full Name"
        icon={FaUser}
        name="fullName"
        register={register}
        error={errors.fullName}
      />
      <InputWithIcon
        label="Email"
        icon={FaEnvelope}
        type="email"
        name="email"
        register={register}
        error={errors.email}
      />
      <InputWithIcon
        label="Phone Number"
        icon={FaPhoneAlt}
        name="phone"
        register={register}
        error={errors.phone}
      />
      <div className="flex gap-3">
        <div className="w-[68%]">
          <InputWithIcon
            label="Address"
            icon={FaMapMarkerAlt}
            name="address"
            register={register}
            error={errors.address}
          />
        </div>
        <div className="w-[32%]">
          <InputWithIcon
            label="Zipcode"
            name="zipcode"
            register={register}
            error={errors.zipcode}
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between items-start">
          <div className="w-[69%]">
            <label className="block text-[#374151] text-[16px] font-semibold">
              Upload Picture
            </label>
          </div>
          <button
            type="button"
            onClick={() => picRef.current.click()}
            disabled={uploading}
            className={`flex items-center cursor-pointer gap-2 px-4 py-3 rounded-xl font-medium transition ${
              uploading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-[#FF92A54D] text-[#FF92A5] hover:bg-[#FF92A580]"
            }`}
          >
            <FaFileImage /> {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        <input
          type="file"
          ref={picRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        {watch("userProfile") && (
          <p className="mt-2 text-sm italic">
            Selected: {watch("uploadedFileName")}
          </p>
        )}

        {errors.userProfile && (
          <p className="text-xs text-red-600 mt-1">
            {errors.userProfile.message}
          </p>
        )}
      </div>
      <InputWithIcon
        label="Password"
        icon={FaLock}
        type="password"
        name="password"
        register={register}
        error={errors.password}
      />
      <InputWithIcon
        label="Confirm Password"
        icon={FaLock}
        type="password"
        name="confirmPassword"
        register={register}
        error={errors.confirmPassword}
      />

      {userType === "salon" ? (
        <AuthButton text="Next" onClick={handleNext} disabled={isSubmitting} />
      ) : (
        <AuthButton text="Sign Up" disabled={isSubmitting} />
      )}
    </div>
  );
}
