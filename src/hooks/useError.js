import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const useError = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    if (errorMessage && errorMessage.length > 0) {
      const showErrorToast = () => {
        const toastId = toast.error(errorMessage.toString(), {
          position: 'top-right',
          autoClose: false,
          hideProgressBar: true,
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

      const timeoutId = setTimeout(showErrorToast, 500);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [errorMessage, renderCount]);

  const setNewErrorMessage = (error) => {
    let message;
    if (typeof error === 'string') {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = JSON.stringify(error);
    }

    setErrorMessage(message);
    setRenderCount((prevCount) => prevCount + 1);
  };

  return [errorMessage, setNewErrorMessage];
};

export default useError;
