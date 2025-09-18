function CardsInfo({ title, value, icon, cardsClass}) {
  return (
    <div className={`flex bg-white p-[20px] gap-x-[10px] rounded-[10px] justify-between items-center ${cardsClass}`}>
      <div className="flex flex-col gap-y-[10px] ">
        <span
          className="max-xl:text-[14px] text-[#4B5563] xl:text-[16px] max-xl:leading-[20px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
          }}
        >
          {title}
        </span>

        <span
          className="max-xl:text-[30px] text-[#581838] xl:text-[30px] max-xl:leading-[20px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
          }}
        >
          {value}
        </span>
      </div>
      <div className="px-[16px] h-[52px] bg-[#FF92A54D] flex justify-center items-center rounded-[8px]">
        {icon}
      </div>
    </div>
  );
}

export default CardsInfo