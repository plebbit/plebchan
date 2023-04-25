import { useEffect } from "react";
import { toast } from "react-toastify";

const useSuccess = (message) => {
  useEffect(() => {
    if (message) {
      const toastId = toast.success(message.toString(), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });

      return () => {
        toast.dismiss(toastId);
      };
    }
  }, [message]);
};

export default useSuccess;