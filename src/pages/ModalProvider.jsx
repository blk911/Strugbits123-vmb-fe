// import { createContext, useContext, useState } from "react";

// const DashboardModalContext = createContext();

// export function DashboardModalProvider({ children }) {
//   const [activeModal, setActiveModal] = useState(null);
//   // e.g. "addService", "editService", "editSalon"

//   const openModal = (name) => setActiveModal(name);
//   const closeModal = () => setActiveModal(null);

//   return (
//     <DashboardModalContext.Provider
//       value={{ activeModal, openModal, closeModal }}
//     >
//       {children}
//     </DashboardModalContext.Provider>
//   );
// }

// // custom hook
// export function useDashboardModal() {
//   return useContext(DashboardModalContext);
// }

// pages/ModalProvider.jsx (or wherever it is)
import { createContext, useContext, useState } from "react";

const DashboardModalContext = createContext();

export function DashboardModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    activeModal: null,
    data: null, // <-- this will hold mock data
  });

  const openModal = (name, data = null) => {
    setModalState({ activeModal: name, data });
  };

  const closeModal = () => {
    setModalState({ activeModal: null, data: null });
  };

  return (
    <DashboardModalContext.Provider
      value={{
        activeModal: modalState.activeModal,
        modalData: modalState.data,
        openModal,
        closeModal,
      }}
    >
      {children}
    </DashboardModalContext.Provider>
  );
}

export function useDashboardModal() {
  return useContext(DashboardModalContext);
}
