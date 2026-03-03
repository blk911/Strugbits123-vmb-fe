import { FaUser, FaEnvelope } from "react-icons/fa6";
import SectionWrapper from "./SectionWrapper";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const inviteSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export default function QuickInvitePanel() {
  const { openModal } = useDashboardModal();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(inviteSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data) => {
    openModal("sendTreat", { email: data.email });
    reset();
  };

  return (
    <SectionWrapper className="p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <FaUser className="text-vmb-secondary w-[20px] h-[20px] shrink-0" />
        <p className="text-[18px] font-semibold text-vmb-primary">
          Quick Invites
        </p>
      </div>

      <p className="text-[14px] text-vmb-text-main font-medium">
        Send Email Invite
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div>
          <input
            type="text"
            {...register("email")}
            onChange={(e) => {
              let value = e.target.value;

              if (value.startsWith(" ")) {
                value = value.trimStart();
                e.target.value = value;
              }

              register("email").onChange(e);
            }}
            className={`w-full border rounded-[8px] px-3 py-2 text-[14px] focus:outline-none transition-colors ${
              errors.email
                ? "border-red-500 focus:border-red-500"
                : "border-vmb-primary/10 focus:border-vmb-secondary"
            }`}
            placeholder="Enter email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 pl-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`flex items-center justify-center rounded-[8px] py-2 gap-2 transition-all duration-200 ${
            isValid
              ? "bg-vmb-secondary text-white cursor-pointer hover:brightness-110"
              : "bg-vmb-secondary/50 text-white/70 cursor-not-allowed"
          }`}
        >
          <FaEnvelope />
          <span className="text-[16px]">Send Invite</span>
        </button>
      </form>
    </SectionWrapper>
  );
}
