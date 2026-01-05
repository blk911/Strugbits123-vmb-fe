import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import FormHeader from "./FormHeader";
import bgImage from "../../../assets/register.png";
import LoginForm from "./LoginForm";
import SignupStep1 from "./SignupStep1";
import SalonStep2 from "./SalonStep2";

import {
  loginSchema,
  customerSignupSchema,
  salonStep1Schema,
  salonStep2Schema,
} from "../../../utils/authSchemas";

import {
  useSignInMutation,
  useSignUpCustomerMutation,
  useSignUpSaloonOwnerMutation,
} from "../../../store/api/authApi";

import { setAuthMode } from "../../../store/features/authSlice";
import { setRole } from "../../../store/features/roleSlice";

import {
  toastSuccess,
  toastError,
  toastLoading,
  toastDismiss,
} from "../../../utils/toast";
import { setToken, setUser } from "../../../store/features/userSlice";
import { useLazyGetMeQuery } from "../../../store/api";
import { ConfirmConfirmation } from "../../../components/dashboard/client/Modals/appointmentTabsModals/ConfirmationModals";

export default function AuthForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mode = useSelector((s) => s.auth.mode);
  const type = useSelector((s) => s.auth.type);
  const [step, setStep] = useState("step1");
  const [userType, setUserType] = useState(type || "customer");
  const [triggerGetMe, { isLoading: isFetchingMe }] = useLazyGetMeQuery();
  const [signIn] = useSignInMutation();
  const [signUpCustomer] = useSignUpCustomerMutation();
  const [signUpSaloonOwner] = useSignUpSaloonOwnerMutation();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isConfirmationModalData, setIsConfirmationModalData] = useState({});
  const getCurrentSchema = () => {
    if (mode === "login") return loginSchema;
    if (mode === "signup" && step === "step1") {
      return userType === "customer" ? customerSignupSchema : salonStep1Schema;
    }
    if (mode === "signup" && step === "step2") {
      return salonStep2Schema;
    }
    return loginSchema;
  };

  const methods = useForm({
    mode: "onTouched",
    shouldUnregister: false,
    defaultValues: {
      licenseDoc: "",
      profilePic: "",
      salonPhotos: [],
      workingDays: [],
      userProfile: "",
      uploadedFileName: "",
      licenseDocName: "",
      profilePicName: "",
    },
    resolver: zodResolver(getCurrentSchema()),
  });

  const { reset, handleSubmit, trigger, setValue, watch } = methods;

  useEffect(() => {
    const schema = getCurrentSchema();
    methods.setSchema?.(zodResolver(schema));
    methods.clearErrors();
    methods.reset(methods.getValues(), {
      keepValues: true,
      keepDirty: false,
      keepErrors: false,
    });
  }, [mode, step, userType, methods]);

  useEffect(() => {
    reset(
      {
        email: "",
        password: "",
        fullName: "",
        phone: "",
        address: "",
        zipcode: "",
        userProfile: "",
        uploadedFileName: "",
        confirmPassword: "",
        saloonName: "",
        saloonAddress: "",
        saloonZipcode: "",
        startTime: "",
        endTime: "",
        workingDays: [],
        licenseDoc: "",
        licenseDocName: "",
        profilePic: "",
        profilePicName: "",
        description: "",
        salonPhotos: [],
      },
      {
        keepErrors: false,
        keepDirty: false,
        keepTouched: false,
        keepIsSubmitted: false,
        keepSubmitCount: false,
        keepValues: false,
      }
    );
    setStep("step1");
    // setUserType("customer");
  }, [mode, reset]);

  const goToStep2 = async () => {
    const isValid = await trigger();
    if (isValid) {
      setStep("step2");
    }
  };

  const handleSuccess = async (apiRole) => {
    dispatch(setRole(apiRole));
    try {
      const meRes = await triggerGetMe().unwrap();
      dispatch(setUser(meRes.data));

      const target =
        apiRole === "customer"
          ? "/client"
          : apiRole === "salon-owner"
          ? "/salon-owner"
          : apiRole === "admin"
          ? "/admin"
          : "/";

      navigate(target, { replace: true });
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      dispatch(setRole(null));
      dispatch(setUser(null));
      navigate("/register", { replace: true });
    }
  };

  const handleSignupSuccess = (role, message) => {
    reset();
    setStep("step1");
    setUserType("customer");
    dispatch(setAuthMode("login"));
    // toastSuccess(message || "Account created! Please log in.");
    setIsConfirmationModalData({ title: "Account created!", message });
    setIsConfirmationModalOpen(true);
  };

  const onSubmit = async (data) => {
    const full = methods.getValues();
    let loadingToastId;

    try {
      if (mode === "login") {
        loadingToastId = toastLoading("Signing in...");
        const res = await signIn({
          email: data.email,
          password: data.password,
        }).unwrap();

        toastDismiss(loadingToastId);
        toastSuccess("Welcome back!");
        dispatch(setToken(res?.data?.token));
        handleSuccess(res?.data?.user?.role);
      } else if (
        mode === "signup" &&
        step === "step1" &&
        userType === "customer"
      ) {
        loadingToastId = toastLoading("Creating account...");
        const res = await signUpCustomer(full).unwrap();
        toastDismiss(loadingToastId);
        toastSuccess(res?.message || "Account created! Please log in.");
        loadingToastId = toastLoading("Signing in...");
        const resSignin = await signIn({
          email: data.email,
          password: data.password,
        }).unwrap();

        toastDismiss(loadingToastId);
        dispatch(setToken(resSignin?.data?.token));
        handleSuccess(resSignin?.data?.user?.role);
      } else if (mode === "signup" && step === "step2") {
        loadingToastId = toastLoading("Registering salon...");

        const files = {
          licenseDocument: full.licenseDoc ? [full.licenseDoc] : [],
          profilePic: full.profilePic ? [full.profilePic] : [],
          saloonPhotos: full.salonPhotos?.map((p) => p.url) || [],
        };

        const formData = { ...full };

        const res = await signUpSaloonOwner({ formData, files }).unwrap();
        toastDismiss(loadingToastId);
        handleSignupSuccess("salon-owner", res?.message);
      }
    } catch (err) {
      if (loadingToastId) toastDismiss(loadingToastId);
      const message = err?.data?.message || "Something went wrong";
      toastError(message);
      console.error(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && mode === "signup") {
      e.preventDefault();
      return false;
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
      <FormProvider {...methods}>
        <div className="max-w-[582px] w-full flex-flex-col bg-white rounded-[20px] p-6 shadow-lg">
          <FormHeader mode={mode} />
          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={handleKeyDown}
            className=" space-y-4 rounded-[20px] bg-white p-6 "
          >
            {mode === "login" && <LoginForm />}

            {mode === "signup" && step === "step1" && (
              <SignupStep1
                userType={userType}
                setUserType={setUserType}
                onNext={
                  userType === "salon" ? goToStep2 : handleSubmit(onSubmit)
                }
              />
            )}

            {mode === "signup" && step === "step2" && (
              <SalonStep2 onBack={() => setStep("step1")} />
            )}
          </form>
        </div>
      </FormProvider>
      <ConfirmConfirmation
        open={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        title={isConfirmationModalData?.title}
        subtitle={isConfirmationModalData?.message}
      />
    </div>
  );
}
