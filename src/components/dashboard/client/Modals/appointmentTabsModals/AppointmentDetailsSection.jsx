import { IoCalendarOutline, IoTimeOutline } from "react-icons/io5";
import ServicesTable from "../../../../common/dashboard/ServicesTable";

export default function AppointmentDetailsSection({ data }) {
  const total = data.services.reduce((s, it) => s + it.price, 0);
  const type = data?.appointment?.type;
  const status = data?.appointment?.status;

  let finalTotal;

  if (type === "invite") {
    // const discount=data?.services[0]?.discount;
    // finalTotal = (total-((total * discount)/100));
    finalTotal = data?.appointment?.amountPaid;
  } else if (type === "booking") {
    finalTotal = total + 2.5;
  } else if (type === "gift") {
    finalTotal = total + total * 0.1;
  } else {
    finalTotal = total;
  }
  return (
    <div className="bg-white/50 border border-vmb-primary/10 rounded-[10px] p-5 flex flex-col gap-4">
      <div className="border border-vmb-primary/10 rounded-[10px] p-3 flex items-center gap-3">
        <img
          src={data.salon.image}
          alt={data.salon.name}
          className="w-[40px] h-[40px] rounded-md object-cover"
        />
        <div>
          <p className="text-vmb-text-main font-semibold text-[14px]">
            {data.salon.name}
          </p>
          <p className="text-vmb-text-main text-[12px]">{data.salon.description}</p>
        </div>
      </div>

      <div className="border border-vmb-primary/10 rounded-[10px] p-[10px] flex flex-col gap-[10px]">
        <h3 className="text-vmb-primary text-[14px] font-medium">Services:</h3>
        <ServicesTable
          services={data?.services}
          containerClass="border border-vmb-primary/10 rounded-[10px] p-2 sm:p-3 text-[11px] sm:text-[12px]"
          scrollbarClass="custom-scrollbar"
          maxHeightClass="max-h-32"
          headerClass="px-1"
          rowClass="border-t border-vmb-primary/10 pt-2 text-vmb-primary text-[11px] sm:text-[12px]"
        />

        <div className="flex justify-end">
          <p className="text-vmb-secondary font-bold text-[13px]">
            Amount Paid: ${finalTotal.toFixed(2)}
          </p>
        </div>
      </div>
      {status !== "declined" && (
        <div className="border border-vmb-primary/10 bg-vmb-bg-soft rounded-[10px] p-[10px] flex flex-col gap-[20px]">
          <p className="text-vmb-primary font-medium text-[14px]">
            Appointment Details
          </p>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1">
              <p className="text-vmb-text-main text-[14px] font-medium mb-1">
                Date
              </p>
              <div className="flex items-center gap-2 text-vmb-text-muted text-[14px]">
                <IoCalendarOutline />
                <span>{data?.appointment?.date}</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-vmb-text-main text-[14px] font-medium mb-1">
                Time
              </p>
              <div className="flex items-center gap-2 text-vmb-text-muted text-[14px]">
                <IoTimeOutline />
                <span>{data?.appointment?.time}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
