import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { usePublishCommentEdit } from "@plebbit/plebbit-react-hooks";
import { StyledModal } from "./styled/ModerationModal.styled";
import useGeneralStore from "../hooks/stores/useGeneralStore";
import useError from "../hooks/useError";
import useSuccess from "../hooks/useSuccess";


const ModerationModal = ({ isOpen, closeModal }) => {
  const {
    selectedAddress,
    selectedStyle,
    setCaptchaResponse,
    setChallengesArray,
    setIsCaptchaOpen,
    moderatingCommentCid,
    setResolveCaptchaPromise,
  } = useGeneralStore(state => state);

  const [pin, setPin] = useState(false);
  const [deleteThread, setDeleteThread] = useState(false);
  const [close, setClose] = useState(false);
  const [reason, setReason] = useState('');
  const [triggerPublishCommentEdit, setTriggerPublishCommentEdit] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  useError(errorMessage, [errorMessage]);
  useSuccess(successMessage, [successMessage]);

  const handleCloseModal = () => {
    closeModal();
  };


  const onChallengeVerification = (challengeVerification) => {
    if (challengeVerification.challengeSuccess === true) {
        setSuccessMessage('Challenge Success');
    } else if (challengeVerification.challengeSuccess === false) {
      setErrorMessage('Challenge Failed', {reason: challengeVerification.reason, errors: challengeVerification.errors});
    }
  };


  const onChallenge = async (challenges, comment) => {

    let challengeAnswers = [];
    
    try {
      challengeAnswers = await getChallengeAnswersFromUser(challenges)
    }
    catch (error) {
      setErrorMessage(error);
    }
    if (challengeAnswers) {
      await comment.publishChallengeAnswers(challengeAnswers)
    }
  };


  const getChallengeAnswersFromUser = async (challenges) => {
    setChallengesArray(challenges);
    
    return new Promise((resolve, reject) => {
      const imageString = challenges?.challenges[0].challenge;
      const imageSource = `data:image/png;base64,${imageString}`;
      const challengeImg = new Image();
      challengeImg.src = imageSource;
  
      challengeImg.onload = () => {
        setIsCaptchaOpen(true);
  
        const handleKeyDown = async (event) => {
          if (event.key === 'Enter') {
            const currentCaptchaResponse = useGeneralStore.getState().captchaResponse;
            resolve(currentCaptchaResponse);
            setIsCaptchaOpen(false);
            document.removeEventListener('keydown', handleKeyDown);
            event.preventDefault();
          }
        };

        setCaptchaResponse('');
        document.addEventListener('keydown', handleKeyDown);

        setResolveCaptchaPromise(resolve);
      };
  
      challengeImg.onerror = () => {
        reject(setErrorMessage('Could not load challenges'));
      };
    });
  };



  const [publishCommentEditOptions, setPublishCommentEditOptions] = useState({
    commentCid: moderatingCommentCid,
    subplebbitAddress: selectedAddress,
    onChallenge,
    onChallengeVerification,
    onError: (error) => {
      setErrorMessage(error);
    },
  });
  
  
  const {error, publishCommentEdit } = usePublishCommentEdit(publishCommentEditOptions);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  
  useEffect(() => {
    setPublishCommentEditOptions((prevOptions) => ({
      ...prevOptions,
      commentCid: moderatingCommentCid,
    }));
  }, [moderatingCommentCid]);


  useEffect(() => {
    if (publishCommentEditOptions && triggerPublishCommentEdit) {
      (async () => {
        await publishCommentEdit();
        setTriggerPublishCommentEdit(false);
      })();
    }
  }, [publishCommentEditOptions, triggerPublishCommentEdit, publishCommentEdit]);



  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel="Moderator Tools"
      style={{ overlay: { backgroundColor: "rgba(0,0,0,.25)" }}}
      selectedStyle={selectedStyle}
    >
      <div className="panel">
        <div className="panel-header">
          Moderator Tools
          <Link to="" onClick={handleCloseModal}>
            <span className="icon" title="close" />
          </Link>
        </div>
        <ul className="settings-cat">
          <li className="settings-cat-lbl"> 
            <input type="checkbox" style={{marginRight: "10px"}}
            checked={pin} onChange={() => setPin(!pin)} />
            Pin thread
          </li>
          <li className="settings-tip">
            Pin the thread to make it a sticky, showed at the top of the board even as new posts are submitted.
          </li>
        </ul>
        <ul className="settings-cat">
          <li className="settings-cat-lbl"> 
            <input type="checkbox" style={{marginRight: "10px"}}
            checked={deleteThread} onChange={() => setDeleteThread(!deleteThread)} />
            Delete thread
          </li>
          <li className="settings-tip">
            The post will no longer visible to other users, but the person who posted it can still see it in their own account.
          </li>
        </ul>
        <ul className="settings-cat">
        <li className="settings-cat-lbl"> 
          <input type="checkbox" style={{marginRight: "10px"}}
          checked={close} onChange={() => setClose(!close)} />
            Close thread
          </li>
          <li className="settings-tip">
            Closing a thread allows users to still see the content, but they cannot add any new replies to it.
          </li>
        </ul>
        <ul className="settings-cat">
          <li className="settings-option disc">
            Reason
          </li>
          <li className="settings-tip">
            Help people become better posters by giving a short reason why their post was removed.
          </li>
          <li className="settings-input" style={{marginTop: "-10px"}}>
            <textarea value={reason} placeholder="Enter reason here..." 
            onChange={e => setReason(e.target.value)}/>
          </li>
        </ul>
        <button
          className="save-button"
          onClick={async () => {
            setPublishCommentEditOptions(prevOptions => ({
              ...prevOptions,
              pinned: pin,
              removed: deleteThread,
              locked: close,
              reason: reason
            }));
            setTriggerPublishCommentEdit(true);
            handleCloseModal();
          }}
        >
          Save
        </button>
      </div>
    </StyledModal>
  );
}

Modal.setAppElement("#root");

export default ModerationModal;