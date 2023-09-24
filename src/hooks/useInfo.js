import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const useInfo = () => {
  const [infoMessage, setInfoMessage] = useState('');
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    if (infoMessage && infoMessage.length > 0) {
      const showInfoToast = () => {
        const toastId = toast.info(infoMessage.toString(), {
          position: 'top-right',
          autoClose: false,
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

      const timeoutId = setTimeout(showInfoToast, 500);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [infoMessage, renderCount]);

  const setNewInfoMessage = (message) => {
    setInfoMessage(message);
    setRenderCount((prevCount) => prevCount + 1);
  };

  return [infoMessage, setNewInfoMessage];
};

export default useInfo;
