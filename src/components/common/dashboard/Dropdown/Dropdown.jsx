import React from "react";
import DropdownItem from "./DropdownItem";

function Dropdown({ items }) {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-vmb-bg-soft border border-vmb-primary/10 rounded-md shadow-lg z-50">
      <ul className="py-2 text-vmb-text-main">
        {items.map((item, idx) => (
          <DropdownItem key={idx} {...item} />
        ))}
      </ul>
    </div>
  );
}

export default Dropdown;
