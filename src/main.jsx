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
            color: "#1F2937",
            fontFamily: "Poppins, sans-serif",
            padding: "16px 20px",
            borderRadius: "12px",
            maxWidth: "420px",
            width: "100%",
            boxShadow:
              "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)",
          },

          success: {
            duration: 3500,
            iconTheme: {
              primary: "#16A34A",
              secondary: "#fff",
            },
            style: {
              background: "#ECFDF5",
              color: "#065F46",
              border: "1px solid #6EE7B7",
            },
          },

          error: {
            duration: 3500,
            iconTheme: {
              primary: "#DC2626",
              secondary: "#fff",
            },
            style: {
              background: "#FEF2F2",
              color: "#991B1B",
              border: "1px solid #FCA5A5",
            },
          },

          loading: {
            duration: Infinity,
            style: {
              background: "#F3F4F6",
              color: "#374151",
              border: "1px solid #D1D5DB",
            },
          },
        }}
      />
    </Provider>
  </StrictMode>
);
