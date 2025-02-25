import { toast } from "react-toastify";
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
};

// Info Toast
export const showInfoToast = (message) => {
  toast.info(message || "Heads up!", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
