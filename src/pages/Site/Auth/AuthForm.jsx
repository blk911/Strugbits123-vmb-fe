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
  useGetPresignedUrlsMutation,
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

export default function AuthForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mode = useSelector((s) => s.auth.mode);
  const [step, setStep] = useState("step1");
  const [userType, setUserType] = useState("customer");

  const [signIn] = useSignInMutation();
  const [signUpCustomer] = useSignUpCustomerMutation();
  const [signUpSaloonOwner] = useSignUpSaloonOwnerMutation();
  const [getPresignedUrls] = useGetPresignedUrlsMutation();
  const methods = useForm({
    mode: "onTouched",
    shouldUnregister: false,
    defaultValues: {
      salonPhotos: [],
      workingDays: [],
    },
    resolver: zodResolver(
      mode === "login"
        ? loginSchema
        : step === "step1"
        ? userType === "customer"
          ? customerSignupSchema
          : salonStep1Schema
        : salonStep2Schema
    ),
  });

  useEffect(() => {
    methods.reset();
    setStep("step1");
    setUserType("customer");
  }, [mode, methods]);

  const goToStep2 = async () => {
    const ok = await methods.trigger();
    if (ok) setStep("step2");
  };

  const handleSuccess = (apiRole) => {
    dispatch(setRole(apiRole));
    const target =
      apiRole === "customer"
        ? "/client"
        : apiRole === "salon-owner"
        ? "/salon-owner"
        : apiRole === "admin"
        ? "/admin"
        : "/";
    navigate(target, { replace: true });
  };

  const handleSignupSuccess = (role, message) => {
    methods.reset();
    dispatch(setAuthMode("login"));
    toastSuccess(message || "Account created! Please log in.");
  };

  const onSubmit = async (data) => {
    const full = methods.getValues();
    let loadingToastId;

    try {
      if (mode === "login") {
        loadingToastId = toastLoading("Signing in...");
        const res = await signIn({
          email: full.email,
          password: full.password,
        }).unwrap();
        toastDismiss(loadingToastId);
        toastSuccess("Welcome back!");
        dispatch(setUser(res?.data?.user));
        dispatch(setToken(res?.data?.token));
        handleSuccess(res?.data?.user?.role);
      } else if (step === "step1" && userType === "customer") {
        loadingToastId = toastLoading("Creating account...");
        const res = await signUpCustomer(full).unwrap();
        toastDismiss(loadingToastId);
        handleSignupSuccess("customer", res?.message);
      } else if (step === "step2") {
        loadingToastId = toastLoading("Registering salon...");
        // const licenseDoc = methods.getValues("licenseDoc");
        // const profilePic = methods.getValues("profilePic");
        // const salonPhotos = methods.getValues("salonPhotos") || [];
        // const filesToUpload = [];
        // if (licenseDoc) {
        //   filesToUpload.push({
        //     fileName: licenseDoc.name,
        //     fileType: licenseDoc.type || "application/octet-stream",
        //   });
        // }
        // if (profilePic) {
        //   filesToUpload.push({
        //     fileName: profilePic.name,
        //     fileType: profilePic.type,
        //   });
        // }
        // salonPhotos.forEach((photo) => {
        //   filesToUpload.push({
        //     fileName: photo.name,
        //     fileType: photo.type,
        //   });
        // });

        // let urlsMap = {};

        // if (filesToUpload.length > 0) {
        //   const res = await getPresignedUrls({ files: filesToUpload }).unwrap();

        //   urlsMap = res.urls.reduce((acc, item) => {
        //     acc[item.fileName] = {
        //       presignedUrl: item.presignedUrl,
        //       finalUrl: item.finalUrl,
        //     };
        //     return acc;
        //   }, {});
        // }

        // const uploadPromises = [];

        // if (licenseDoc && urlsMap[licenseDoc.name]) {
        //   uploadPromises.push(
        //     fetch(urlsMap[licenseDoc.name].presignedUrl, {
        //       method: "PUT",
        //       body: licenseDoc,
        //       headers: { "Content-Type": licenseDoc.type },
        //     })
        //   );
        // }
        // if (profilePic && urlsMap[profilePic.name]) {
        //   uploadPromises.push(
        //     fetch(urlsMap[profilePic.name].presignedUrl, {
        //       method: "PUT",
        //       body: profilePic,
        //       headers: { "Content-Type": profilePic.type },
        //     })
        //   );
        // }
        // salonPhotos.forEach((photo) => {
        //   if (urlsMap[photo.name]) {
        //     uploadPromises.push(
        //       fetch(urlsMap[photo.name].presignedUrl, {
        //         method: "PUT",
        //         body: photo,
        //         headers: { "Content-Type": photo.type },
        //       })
        //     );
        //   }
        // });

        // await Promise.all(uploadPromises);

        // toastDismiss(loadingToastId);
        // toastLoading("Creating your salon account...");

        // const finalFormData = {
        //   ...data,
        //   licenseDocument: licenseDoc
        //     ? urlsMap[licenseDoc.name].finalUrl
        //     : null,
        //   profilePic: profilePic ? urlsMap[profilePic.name].finalUrl : null,
        //   saloonPhotos: salonPhotos
        //     .map((p) => urlsMap[p.name]?.finalUrl)
        //     .filter(Boolean),
        //   workingDays: data.workingDays || [],
        // };

        // await signUpSaloonOwner(finalFormData).unwrap();

        // toastDismiss(loadingToastId);
        // handleSignupSuccess("salonOwner");
        const files = {
          licenseDocument: full.licenseDoc ? [full.licenseDoc] : [],
          profilePic: full.profilePic ? [full.profilePic] : [],
          saloonPhotos: full.salonPhotos || [],
        };

        const formData = { ...full };
        delete formData.licenseDoc;
        delete formData.profilePic;
        delete formData.salonPhotos;

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
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="w-[582px] space-y-4 rounded-[20px] bg-white p-6 shadow-lg"
        >
          <FormHeader mode={mode} />

          {mode === "login" && <LoginForm />}

          {mode === "signup" && step === "step1" && (
            <SignupStep1
              userType={userType}
              setUserType={setUserType}
              onNext={userType === "salon" ? goToStep2 : null}
            />
          )}

          {mode === "signup" && step === "step2" && (
            <SalonStep2 onBack={() => setStep("step1")} />
          )}
        </form>
      </FormProvider>
    </div>
  );
}
