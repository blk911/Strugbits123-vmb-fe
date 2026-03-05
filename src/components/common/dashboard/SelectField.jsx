import { Fragment, useState } from "react";
import {
  Listbox,
  Transition,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";

export default function SelectField({
  option = ["Last 7 days", "Last 15 days", "Last 30 days"],
  label = "Service Name",
  name = "full_name",
  classes = "",
  icon,
  mainIcon = false,
}) {
  const [selected, setSelected] = useState(option[0]);

  const DefaultIcon = () => (
    <svg
      width="10"
      height="4"
      viewBox="0 0 10 4"
      xmlns="http://www.w3.org/2000/svg"
      className="text-vmb-muted"
    >
      <path
        d="M1.12478 0.00242486C1.33118 -0.0105214 1.48305 0.0903836 1.63055 0.205758C2.68394 1.03166 3.74317 1.85337 4.79023 2.68421C4.95914 2.81825 5.05115 2.80606 5.2113 2.67926C6.25933 1.8488 7.31759 1.02671 8.37147 0.201189C8.48732 0.110565 8.60512 0.0256521 8.77744 0.0062326C9.06123 -0.0257524 9.31144 0.0667756 9.43313 0.251451C9.55093 0.430034 9.51345 0.658117 9.31777 0.814234C8.87577 1.16759 8.4255 1.51524 7.97864 1.86517C7.1589 2.50639 6.34014 3.148 5.51894 3.78846C5.16164 4.06757 4.83745 4.07061 4.48648 3.79684C3.23643 2.82015 1.98784 1.84156 0.736821 0.865258C0.593221 0.75293 0.494404 0.632225 0.500246 0.465065C0.509981 0.193192 0.754831 0.00204409 1.12478 0.00242486Z"
        fill="currentColor"
      />
    </svg>
  );

  return (
    <div className="flex flex-col gap-y-[8px]">
      {label && (
        <label
          htmlFor={name}
          className="text-[14px] lg:text-[16px] font-poppins font-normal text-vmb-text-main"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
          }}
        >
          {label}
        </label>
      )}

      <div className="relative mt-1">
        <Listbox value={selected} onChange={setSelected}>
          <ListboxButton
            className={`relative ${
              mainIcon && "flex items-center gap-x-[10px]"
            } w-full cursor-default rounded-md border border-vmb-primary/10 bg-white/50 py-2 pl-3 pr-10 text-left text-sm text-vmb-text-main focus:outline-none ${classes}`}
          >
            {mainIcon}

            <span
              className="block truncate"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                lineHeight: "20px",
              }}
            >
              {selected}
            </span>

            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              {icon ? icon : <DefaultIcon />}
            </span>
          </ListboxButton>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-vmb-bg-soft border border-vmb-primary/10 text-sm shadow-lg focus:outline-none z-50 ${classes}`}
              style={{
                backgroundColor: "var(--vmb-bg-soft)",
              }}
            >
              {option.map((opt) => (
                <ListboxOption
                  key={opt}
                  value={opt}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-3 pr-4 
                    ${active ? "bg-vmb-secondary/10 text-vmb-primary" : "text-vmb-text-muted"} 
                    font-poppins font-semibold`
                  }
                >
                  {opt}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </Listbox>
      </div>
    </div>
  );
}
