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
            fontSize: "14px",
            background: "#fffdfb",
            color: "#23272c",
            fontFamily: "Libre Franklin, Inter, sans-serif",
            padding: "16px 20px",
            borderRadius: "6px",
            maxWidth: "420px",
            width: "100%",
            boxShadow:
              "0 10px 28px rgba(66, 55, 50, 0.10)",
          },

          success: {
            duration: 3000,
            theme: {
              primary: "#4FCF00",
              secondary: "#fff",
            },
            style: {
              background: "#f4f1ec",
              color: "#333232",
              border: "1px solid #d6c9b8",
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
              background: "#fbf7f4",
              color: "#333232",
              border: "1px solid #ded3cc",
            },
          },
        }}
      />
    </Provider>
  </StrictMode>
);
