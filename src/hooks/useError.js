import { useEffect } from "react";
import { toast } from "react-toastify";

const useError = (message) => {
  useEffect(() => {
    if (message && message.length > 0) {
      const showErrorToast = () => {
        const toastId = toast.error(message.toString(), {
          position: "top-right",
          autoClose: false,
          hideProgressBar: true,
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

      const timeoutId = setTimeout(showErrorToast, 500);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [message]);
};

export default useError;