import { useNavigate, useLocation } from "react-router-dom";
import useGeneralStore from "./stores/useGeneralStore";

const useClickForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowPostForm, setShowPostFormLink } = useGeneralStore.getState();

  const handleClickForm = () => {
    setShowPostForm(true);
    setShowPostFormLink(false);
    const pathComponents = location.pathname.split("/");
    const subplebbitAddress = pathComponents[2];
    const threadCid = pathComponents[4];

    if (pathComponents[1] === "p") {
      if (pathComponents[3] === "c") {
        navigate(`/p/${subplebbitAddress}/c/${threadCid}/post`);
      } else if (pathComponents[3] === "catalog") {
        navigate(`/p/${subplebbitAddress}/catalog/post`);
      } else {
        navigate(`/p/${subplebbitAddress}/post`);
      }
    }
  };

  return handleClickForm;
};

export default useClickForm;