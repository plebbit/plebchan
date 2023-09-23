import useGeneralStore from './stores/useGeneralStore';

const useClickForm = () => {
  const { setShowPostForm, setShowPostFormLink } = useGeneralStore.getState();

  const handleClickForm = () => {
    setShowPostForm(true);
    setShowPostFormLink(false);
  };

  return handleClickForm;
};

export default useClickForm;
