import { useEffect, useState } from "react";

export default function AutoCarousel({ images = [], heightClass = "h-[300px]" }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!images?.length) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % images.length), 2000);
    return () => clearInterval(id);
  }, [images]);

  return (
    <div className={`relative w-full overflow-hidden rounded-md ${heightClass}`}>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`banner-${i}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === idx ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}
    </div>
  );
}
