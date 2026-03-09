import React from "react";

function Card({ photo, title, desc }) {
  return (
    <div
      className="
        w-full
        max-w-[308px]
        rounded-[20px]
        bg-white
        flex flex-col
        p-[10px] pb-[30px]
        gap-4
     shadow-2xl
        transition-transform duration-300
        hover:-translate-y-1
      "
    >
      <div className="w-full aspect-[288/133] overflow-hidden rounded-[12px]">
        <img
          src={photo}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>

      <span
        className="
          text-center
          font-lato
          font-semibold
          text-lg sm:text-[20px]
          text-vmb-primary
        "
      >
        {title}
      </span>

      <span
        className="
          text-center
          font-inter
          text-sm sm:text-[14px]
          text-vmb-secondary
          leading-relaxed
          px-2
        "
      >
        {desc}
      </span>
    </div>
  );
}
function PlatformBenefits({ heading, subheading, cards }) {
  return (
    <section className="w-full ">
      <div className="w-full max-w-[1024px]  mx-auto text-center flex flex-col gap-[30px]">
        <div>
          <h3 className="text-[30px] sm:text-[40px] font-lato text-vmb-primary capitalize font-semibold">
            {heading}
          </h3>
          <p className="mt-2 text-sm font-inter sm:text-[18px] text-vmb-secondary ">
            {subheading}
          </p>
        </div>
        <div className=" sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 justify-items-center items-stretch">
          {cards.map((card, index) => (
            <Card
              key={index}
              photo={card.photo}
              title={card.title}
              desc={card.desc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PlatformBenefits;
