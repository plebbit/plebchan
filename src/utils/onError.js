import { toast } from 'react-toastify';

const onError = (error) => {
  return toast.error(error.toString(), {
    position: "bottom-center",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "dark",
  });
};

export default onError;