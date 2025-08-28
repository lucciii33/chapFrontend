import { toast } from "react-toastify";
// import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

// Success Toast
export const showSuccessToast = (message) => {
  toast.success(message || "Operation Successful!", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
  // toast.success(message || "Operation Successful!"); // ✅ VERDE
};

// Error Toast
export const showErrorToast = (message) => {
  toast.error(message || "Something went wrong!", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
  // toast.error(message || "Something went wrong!"); // ❌ ROJO
};

// Info Toast
export const showInfoToast = (message) => {
  console.log("Showing info toast with message:", message);
  toast.info(message || "Heads up!", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
  // toast.success(message || "Heads up!"); // 💡 AZUL
};
