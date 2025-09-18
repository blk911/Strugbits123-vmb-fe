import { createContext, useContext } from "react";

const RoleContext = createContext();


export const RoleProvider = ({ children }) => {
  // 🔥 Hardcode role here ("admin" | "salonOwner" | "client")
  const role = "admin";  

  return (
    <RoleContext.Provider value={{ role }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
