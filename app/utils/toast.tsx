import { toast } from "react-toastify";
// import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

const spawnNativeToast = (message, type = "info") => {
  // Lista de posibles IDs de contenedores
  const ids = [
    "modal-toast-root",
    "modal-toast-root-2",
    "modal-toast-root-3",
    "modal-toast-root-4",
  ];

  ids.forEach((id) => {
    const container = document.getElementById(id);
    if (!container) return;

    const div = document.createElement("div");
    div.innerText = message;

    Object.assign(div.style, {
      marginBottom: "10px",
      padding: "12px 16px",
      borderRadius: "8px",
      color: "#fff",
      fontSize: "14px",
      background:
        type === "success"
          ? "green"
          : type === "error"
          ? "crimson"
          : "dodgerblue",
      boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
      opacity: "1",
      transition: "opacity 0.5s",
    });

    container.appendChild(div);

    setTimeout(() => {
      div.style.opacity = "0";
      setTimeout(() => div.remove(), 500);
    }, 3000);
  });
};

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
  spawnNativeToast(message || "Operation Successful!", "success");
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
  spawnNativeToast(message || "Something went wrong!", "error");

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

  spawnNativeToast(message || "Heads up!", "info");
};
