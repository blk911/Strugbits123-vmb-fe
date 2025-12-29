import { IoCalendarOutline, IoTimeOutline } from "react-icons/io5";

export default function AppointmentDetailsSection({ data }) {
  const total = data.services.reduce((s, it) => s + it.price, 0);
  const type = data?.appointment?.type;
  const status = data?.appointment?.status;
  let finalTotal;

  if (type === "invite") {
    finalTotal = total;
  } else if (type === "booking") {
    finalTotal = total + 2.5;
  } else if (type === "gift") {
    finalTotal = total + total * 0.1;
  } else {
    finalTotal = total;
  }
  return (
    <div className="bg-white border border-[#0000001A] rounded-[10px] p-5 flex flex-col gap-4">
      <div className="border border-[#0000001A] rounded-[10px] p-3 flex items-center gap-3">
        <img
          src={data.salon.image}
          alt={data.salon.name}
          className="w-[40px] h-[40px] rounded-md object-cover"
        />
        <div>
          <p className="text-[#4B5563] font-semibold text-[14px]">
            {data.salon.name}
          </p>
          <p className="text-[#4B5563] text-[12px]">{data.salon.description}</p>
        </div>
      </div>

      <div className="border border-[#9CA3AF4D] rounded-[10px] p-[10px] flex flex-col gap-[10px]">
        <h3 className="text-[#581838] text-[14px] font-medium">Services:</h3>
        <div className="border border-[#9CA3AF4D] rounded-[10px] p-[10px] flex flex-col gap-[12px]  max-h-32 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between text-[12px] font-medium text-black">
            <span>Service</span>
            <div className="flex gap-8">
              <span>Duration</span>
              <span>Price</span>
            </div>
          </div>
          {data.services.map((srv, i) => (
            <div
              key={i}
              className={`flex justify-between text-[12px] text-[#581838] ${
                i === data?.services?.length - 1
                  ? ""
                  : "border-b border-[#D9D9D9]"
              }`}
            >
              <span>{srv.name}</span>
              <div className="flex gap-8">
                <span>{srv.duration}</span>
                <span>${srv.price}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <p className="text-[#FF92A5] font-bold text-[13px]">
            Amount Paid: ${finalTotal.toFixed(2)}
          </p>
        </div>
      </div>
      {status !== "declined" && (
        <div className="border border-[#0000001A] bg-[#F0F0F0] rounded-[10px] p-[10px] flex flex-col gap-[20px]">
          <p className="text-[#581838] font-medium text-[14px]">
            Appointment Details
          </p>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1">
              <p className="text-[#404040] text-[14px] font-medium mb-1">
                Date
              </p>
              <div className="flex items-center gap-2 text-[#00000080] text-[14px]">
                <IoCalendarOutline />
                <span>{data?.appointment?.date}</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[#404040] text-[14px] font-medium mb-1">
                Time
              </p>
              <div className="flex items-center gap-2 text-[#00000080] text-[14px]">
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
