import { createContext, useContext, useState } from "react";

const DashboardModalContext = createContext();

export function DashboardModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    activeModal: null,
    data: null,
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
