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
            background: "#FF92A5",
            color: "#fff",
            fontFamily: "Poppins, sans-serif",
          },
          success: { icon: "Success" },
          error: { icon: "Error" },
        }}
      />
    </Provider>
  </StrictMode>
);
