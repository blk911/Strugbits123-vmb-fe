import React from "react";
import bgImage from "../../../assets/register.png";
import logo from "../../../assets/logo.png";
import InputWithIcon from "../../../components/common/site/InputWithIcon";
import { FaEnvelope } from "react-icons/fa6";
import AppButton from "../../../components/common/site/AppButton";
import { useForm } from "react-hook-form";
import { useForgotPasswordMutation } from "../../../store/api";
import { toastSuccess, toastError } from "../../../utils/toast";

const ForgetPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const email = data.email;
    try {
      const res = await forgotPassword(email).unwrap();
      toastSuccess(
        res?.message || "Password reset link sent! Check your email."
      );
      reset();
    } catch (err) {
      console.error("Forgot password error:", err);
      toastError(
        err?.data?.message || "Failed to send reset link. Please try again."
      );
    }
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center py-[80px] max-sm:px-5"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-[452px] max-w-full space-y-8 rounded-[20px] bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center gap-8">
          <div className="w-[162px] h-[104px]">
            <img
              src={logo}
              alt="logo"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#581838]">
              Forgot Password?
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            <InputWithIcon
              label="Email Address"
              icon={FaEnvelope}
              type="email"
              placeholder="Enter your email"
              name="email"
              register={register}
              error={errors.email}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email address",
                },
              })}
            />

            <AppButton
              type="submit"
              variant="primary"
              size="custom"
              className="w-full py-4 text-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Sending Link..." : "Send Reset Link"}
            </AppButton>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <a
                href="/register"
                className="text-[#581838] font-medium hover:underline"
              >
                Back to Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
