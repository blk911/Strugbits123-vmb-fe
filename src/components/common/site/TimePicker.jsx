import { Fragment, useMemo } from "react";
import { Popover, Transition } from "@headlessui/react";
import { FaClock } from "react-icons/fa";
import { useFormContext, Controller } from "react-hook-form";

const HOURS = Array.from({ length: 12 }, (_, i) =>
  (i + 1).toString().padStart(2, "0"),
);
const MINUTES = ["00", "15", "30", "45"];
const MERIDIEM = ["AM", "PM"];

function to24Hour(hour, minute, meridiem) {
  let h = parseInt(hour, 10);
  if (meridiem === "PM" && h !== 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;
  return `${h.toString().padStart(2, "0")}:${minute}`;
}

function from24Hour(value) {
  if (!value) return { hour: "09", minute: "00", meridiem: "AM" };

  let [h, m] = value.split(":");
  h = parseInt(h, 10);

  return {
    hour:
      h === 0 ? "12"
      : h > 12 ? (h - 12).toString().padStart(2, "0")
      : h.toString().padStart(2, "0"),
    minute: m,
    meridiem: h >= 12 ? "PM" : "AM",
  };
}

function displayValue(value) {
  if (!value) return "";
  const { hour, minute, meridiem } = from24Hour(value);
  return `${hour}:${minute} ${meridiem}`;
}

function PickerUI({ label, value, onChange, error }) {
  const parsed = useMemo(() => from24Hour(value), [value]);

  const update = (next) => {
    const v = {
      hour: next.hour ?? parsed.hour,
      minute: next.minute ?? parsed.minute,
      meridiem: next.meridiem ?? parsed.meridiem,
    };
    onChange(to24Hour(v.hour, v.minute, v.meridiem));
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-vmb-text-main text-[14px] font-semibold mb-1">
          {label}
        </label>
      )}

      <Popover className="relative">
        <Popover.Button className="w-full">
          <div className="relative">
            <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-vmb-secondary pointer-events-none z-10" />

            <input
              readOnly
              value={displayValue(value)}
              className="w-full bg-white border border-vmb-primary/10 rounded-md py-3 pl-10 pr-4 text-vmb-text-main
                       focus:outline-none focus:ring-2 focus:ring-vmb-secondary focus:border-vmb-secondary
                       transition-all cursor-pointer"
            />
          </div>
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel className="absolute z-50 mt-2 w-full bg-white border rounded-md shadow-lg p-3">
            <div className="grid grid-cols-3 gap-2">
              <Column
                title="Hour"
                options={HOURS}
                value={parsed.hour}
                onChange={(hour) => update({ hour })}
              />

              <Column
                title="Min"
                options={MINUTES}
                value={parsed.minute}
                onChange={(minute) => update({ minute })}
              />

              <Column
                title="AM/PM"
                options={MERIDIEM}
                value={parsed.meridiem}
                onChange={(meridiem) => update({ meridiem })}
              />
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>

      {error && <p className="text-xs text-red-600 mt-1">{error.message}</p>}
    </div>
  );
}

function Column({ title, options, value, onChange }) {
  return (
    <div className="min-w-[40px] text-center">
      <p className="text-xs text-vmb-text-muted mb-1">{title}</p>
      <div className="max-h-40 overflow-y-auto custom-scrollbar border rounded-md">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`w-full px-2 py-2 text-sm text-center hover:bg-vmb-bg-soft
              ${opt === value ? "bg-vmb-secondary/30 font-medium" : ""}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TimePicker({ name, label, control }) {
  const methods = useFormContext?.();

  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <PickerUI
            label={label}
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error}
          />
        )}
      />
    );
  }

  return (
    <PickerUI
      label={label}
      value={methods.watch(name)}
      onChange={(v) => methods.setValue(name, v, { shouldValidate: true })}
      error={methods.formState.errors[name]}
    />
  );
}

export function TimePickerControlled({ value, onChange }) {
  return (
    <div className="relative">
      <PickerUI value={value} onChange={onChange} />
    </div>
  );
}
