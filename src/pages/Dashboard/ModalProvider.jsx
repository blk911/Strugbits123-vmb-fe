import { createContext, useContext, useState } from "react";

const DashboardModalContext = createContext();

export function DashboardModalProvider({ children }) {
  const [activeModal, setActiveModal] = useState(null); 
  // e.g. "addService", "editService", "editSalon"

  const openModal = (name) => setActiveModal(name);
  const closeModal = () => setActiveModal(null);

  return (
    <DashboardModalContext.Provider
      value={{ activeModal, openModal, closeModal }}
    >
      {children}
    </DashboardModalContext.Provider>
  );
}

// custom hook
export function useDashboardModal() {
  return useContext(DashboardModalContext);
}
