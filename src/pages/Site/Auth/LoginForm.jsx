import { FaEnvelope, FaLock } from "react-icons/fa";
import { useFormContext } from "react-hook-form";
import InputWithIcon from "../../../components/common/site/InputWithIcon";
import AuthButton from "../../../components/common/site/AuthButton";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();
  const navigate = useNavigate();
  return (
    <div className="w-full space-y-4">
      <InputWithIcon
        label="Email Address"
        icon={FaEnvelope}
        type="email"
        placeholder="Enter your email"
        name="email"
        register={register}
        error={errors.email}
      />
      <InputWithIcon
        label="Password"
        icon={FaLock}
        type="password"
        placeholder="Enter your password"
        name="password"
        register={register}
        error={errors.password}
      />

      <div className="w-full text-left">
        <p
          className="text-[14px] text-[#FF92A5] cursor-pointer font-medium"
          onClick={() => navigate("/forget-password")}
        >
          Forgot Password?
        </p>
      </div>

      <AuthButton text="Sign In" />
    </div>
  );
}
