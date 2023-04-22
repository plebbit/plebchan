import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePublishComment } from '@plebbit/plebbit-react-hooks';
import { StyledModal } from './styled/ReplyModal.styled';
import useGeneralStore from '../hooks/stores/useGeneralStore';
import Modal from 'react-modal';
import Draggable from 'react-draggable';
import useError from '../hooks/useError';
import useSuccess from '../hooks/useSuccess';


const ReplyModal = ({ isOpen, closeModal }) => {
  const {
    captchaResponse, setCaptchaResponse,
    setChallengesArray,
    setIsCaptchaOpen,
    setPendingComment,
    setResolveCaptchaPromise,
    selectedAddress,
    selectedParentCid,
    selectedShortCid,
    selectedStyle,
    selectedThread,
  } = useGeneralStore(state => state);

  const navigate = useNavigate();

  const nodeRef = useRef(null);

  const nameRef = useRef();
  const commentRef = useRef();
  const linkRef = useRef();

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage] = useState(null);
  useError(errorMessage, [errorMessage]);
  useSuccess(successMessage, [successMessage]);


  const onChallengeVerification = (challengeVerification) => {
    if (challengeVerification.challengeSuccess === true) {
      console.log('challenge success');
    }
    else if (challengeVerification.challengeSuccess === false) {
      setErrorMessage('challenge failed', {reason: challengeVerification.reason, errors: challengeVerification.errors});
    }
  };


  const onChallenge = async (challenges, comment) => {
    setPendingComment(comment);
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

  
  const [publishCommentOptions, setPublishCommentOptions] = useState({
    subplebbitAddress: selectedAddress,
    onChallenge,
    onChallengeVerification,
    onError: (error) => {
      setErrorMessage(error);
    },
  });


  const { publishComment, index } = usePublishComment(publishCommentOptions);


  useEffect(() => {
    if (index !== undefined) {
      navigate(`/p/${selectedAddress}/c/${selectedParentCid}`)
      localStorage.setItem("toastMessage", `Comment pending with index ${index}.`);
    }
  }, [index]);

  
  const resetFields = () => {
    nameRef.current.value = '';
    commentRef.current.value = '';
    linkRef.current.value = '';
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setPublishCommentOptions((prevPublishCommentOptions) => ({
      ...prevPublishCommentOptions,
      author: {
        displayName: nameRef.current.value || undefined,
      },
      content: commentRef.current.value || undefined,
      link: linkRef.current.value || undefined,
      parentCid: selectedParentCid,
    }));
  };
  
  
  useEffect(() => {
    if (publishCommentOptions.content) {
      (async () => {
        await publishComment();
        resetFields();
        closeModal();
      })();
    }
  }, [publishCommentOptions]);


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
            const currentCaptchaResponse = captchaResponse;
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


  return (
    <StyledModal
    isOpen={isOpen}
    onRequestClose={closeModal}
    contentLabel="Reply Modal"
    shouldCloseOnEsc={false}
    shouldCloseOnOverlayClick={false}
    selectedStyle={selectedStyle}
    overlayClassName="hide-modal-overlay">
      <Draggable handle=".modal-header" nodeRef={nodeRef}>
        <div className="modal-content" ref={nodeRef}>
          <div className="modal-header">
            Reply to c/{selectedShortCid}
            <button className="icon" onClick={() => closeModal()} title="close" />
          </div>
          <div id="form">
            <div>
              <input id="name" type="text" placeholder="Name" ref={nameRef} />
            </div>
            <div>
              <input id="name" type="text" placeholder="Embed link" ref={linkRef} />
            </div>
            <div className="textarea-wrapper">
              <span className="fixed-text">{`c/${selectedShortCid}`}</span>
              <textarea className="textarea" rows="4" placeholder="Comment" wrap="soft" ref={commentRef} />
            </div>
            <div>
              <button id="next" onClick={handleSubmit}>Post</button>
            </div>
          </div>
        </div>
      </Draggable>
    </StyledModal>
  );
};

Modal.setAppElement('#root');

export default ReplyModal;