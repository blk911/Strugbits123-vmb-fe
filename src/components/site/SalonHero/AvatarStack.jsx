import React from "react";

const AVATARS = [
  "https://i.pravatar.cc/120?img=45",
  "https://i.pravatar.cc/120?img=32",
  "https://i.pravatar.cc/120?img=12",
  "https://i.pravatar.cc/120?img=27",
];

export default function AvatarStack({ className = "" }) {
  return (
    <div className={`flex items-center ${className}`}>
      {AVATARS.map((src, i) => (
        <div
          key={src}
          className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-full border-2 border-[#0d1528] shadow-[0_4px_20px_rgba(0,0,0,0.25)] first:ml-0 sm:first:ml-0"
          style={{ marginLeft: i === 0 ? 0 : -14 }}
        >
          <img
            src={src}
            alt=""
            className="h-full w-full rounded-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
