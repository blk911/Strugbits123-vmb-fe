import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bgImage from "../../../assets/register.png";
import logo from "../../../assets/logo.png";
import InputWithIcon from "../../../components/common/site/InputWithIcon";
import { FaLock } from "react-icons/fa6";
import AppButton from "../../../components/common/site/AppButton";
import { useForm } from "react-hook-form";
import { useResetPasswordMutation } from "../../../store/api";
import { toastSuccess, toastError } from "../../../utils/toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      await resetPassword({
        token,
        newPassword: data.password,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      toastSuccess("Password reset successfully! You can now log in.");
      reset();
      navigate("/register");
    } catch (err) {
      console.error("Reset password failed:", err);
      toastError(
        err?.data?.message || "Failed to reset password. Link may be expired."
      );
    }
  };

  useEffect(() => {
    if (!token) {
      toastError("Invalid or missing reset token.");
      navigate("/forget-password");
    }
  }, [token, navigate]);

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
            <h2 className="text-2xl font-bold text-vmb-primary">
              Reset Password
            </h2>
            <p className="text-vmb-text-muted text-sm mt-2">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            <InputWithIcon
              label="New Password"
              icon={FaLock}
              type="password"
              placeholder="Enter new password"
              name="password"
              register={register}
              error={errors.password}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 8 characters",
                },
              })}
            />

            <InputWithIcon
              label="Confirm New Password"
              icon={FaLock}
              type="password"
              placeholder="Confirm new password"
              name="confirmPassword"
              register={register}
              error={errors.confirmPassword}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />

            <AppButton
              type="submit"
              variant="primary"
              size="custom"
              className="w-full py-4 text-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </AppButton>
          </form>

          <div className="text-center">
            <p className="text-sm text-vmb-text-muted">
              Remember your password?{" "}
              <a
                href="/register"
                className="text-vmb-primary font-medium hover:underline"
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

export default ResetPassword;
