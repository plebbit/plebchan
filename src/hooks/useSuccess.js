import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const useSuccess = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    if (successMessage && successMessage.length > 0) {
      const showSuccessToast = () => {
        const toastId = toast.success(successMessage.toString(), {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: 'dark',
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
  }, [successMessage, renderCount]);

  const setNewSuccessMessage = (message) => {
    setSuccessMessage(message);
    setRenderCount((prevCount) => prevCount + 1);
  };

  return [successMessage, setNewSuccessMessage];
};

export default useSuccess;
