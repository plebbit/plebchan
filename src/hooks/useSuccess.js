import { useEffect } from "react";
import { toast } from "react-toastify";

const useSuccess = (message) => {
  useEffect(() => {
    if (message && message.length > 0) {
      const showSuccessToast = () => {
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
      };

      const timeoutId = setTimeout(showSuccessToast, 500);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [message]);
};

export default useSuccess;