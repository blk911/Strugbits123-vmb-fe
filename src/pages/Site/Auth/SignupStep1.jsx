import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLock,
  FaPhoneAlt,
} from "react-icons/fa";
import { useFormContext } from "react-hook-form";
import InputWithIcon from "../../../components/common/site/InputWithIcon";
import AuthButton from "../../../components/common/site/AuthButton";

export default function SignupStep1({ userType, setUserType, onNext }) {
  const {
    register,
    formState: { errors, isSubmitting },
    trigger,
  } = useFormContext();

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
