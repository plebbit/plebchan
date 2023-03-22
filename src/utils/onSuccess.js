import { toast } from 'react-toastify';

const onSuccess = (success) => {
  return toast.success(success.toString(), {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "dark",
  });
};

export default onSuccess;