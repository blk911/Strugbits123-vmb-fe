// mockData.js
import saloon_icon from "../../../../assets/default_saloon.png";
import saloon_1 from "../../../../assets/salon-1.png";
import saloon_2 from "../../../../assets/salon-2.png";
import saloon_3 from "../../../../assets/salon-3.png";

const makeServices = (salonIndex) =>
  Array.from({ length: 12 }, (_, i) => ({
    id: `${salonIndex}-${i + 1}`,
    name:
      i % 3 === 0
        ? "Hair Cut & Style"
        : i % 3 === 1
        ? "Facial Treatment"
        : "Glow Treatment",
    duration: 60,
    price: 20 + (i % 4) * 5,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: saloon_1,
  }));

export const salons = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Bella Beauty Salon ${i + 1}`,
  distance: parseFloat((Math.random() * 5 + 0.5).toFixed(1)),
  distanceLabel: `${(Math.random() * 5 + 0.5).toFixed(1)} miles away`,
  address: "123 Main Street, Cityville",
  hours: "09:00 AM - 05:00 PM",
  image: saloon_icon,
  images: [saloon_1, saloon_2, saloon_3],
  phone: "(555) 123-4567",
  services: makeServices(i + 1),
}));
