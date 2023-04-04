import { useEffect } from "react";
import { toast } from "react-toastify";

const useError = (message, deps) => {
  useEffect(() => {
    if (message) {
      const toastId = toast.error(message.toString(), {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });

      return () => {
        toast.dismiss(toastId);
      };
    }
  }, deps);
};

export default useError;