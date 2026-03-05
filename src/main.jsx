import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: "15px",
            background: "white",
            color: "#333333", // vmb-text-main
            fontFamily: "Poppins, sans-serif",
            padding: "16px 20px",
            borderRadius: "12px",
            maxWidth: "420px",
            width: "100%",
            boxShadow:
              "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)",
          },

          success: {
            duration: 3000,
            theme: {
              primary: "#4FCF00",
              secondary: "#fff",
            },
            style: {
              background: "#F2FDF2", // Success soft
              color: "#0F3D3E", // vmb-primary
              border: "1px solid #4FCF004D",
            },
          },

          error: {
            duration: 4000,
            theme: {
              primary: "#DC2626",
              secondary: "#fff",
            },
            style: {
              background: "#FEF2F2", // Error soft
              color: "#DC2626", // vmb-error
              border: "1px solid #DC26264D",
            },
          },

          loading: {
            style: {
              background: "#FAFFFD", // vmb-bg-soft
              color: "#0F3D3E", // vmb-primary
              border: "1px solid #0F3D3E4D",
            },
          },
        }}
      />
    </Provider>
  </StrictMode>
);
