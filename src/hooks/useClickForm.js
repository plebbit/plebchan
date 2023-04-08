import { useNavigate, useLocation } from "react-router-dom";
import useGeneralStore from "./stores/useGeneralStore";

const useClickForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowPostForm, setShowPostFormLink } = useGeneralStore.getState();

  const handleClickForm = () => {
    setShowPostForm(true);
    setShowPostFormLink(false);

    const subplebbitAddress = location.pathname.split("/")[1];
    const threadCid = location.pathname.split("/")[3];

    if (location.pathname === "/") {
      navigate("/post");
    } else if (location.pathname.endsWith("/catalog")) {
      navigate(`/${subplebbitAddress}/catalog/post`);
    } else if (location.pathname.endsWith("/thread")) {
      navigate(`/${subplebbitAddress}/thread/post`);
    } else if (threadCid) {
      navigate(`/${subplebbitAddress}/thread/${threadCid}/post`);
    } else {
      navigate(`/${subplebbitAddress}/post`);
    }
  };

  return handleClickForm;
};

export default useClickForm;