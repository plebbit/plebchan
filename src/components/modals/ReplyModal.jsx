import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAccount, usePublishComment } from '@plebbit/plebbit-react-hooks';
import { StyledModal } from '../styled/modals/ReplyModal.styled';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import Modal from 'react-modal';
import Draggable from 'react-draggable';
import useError from '../../hooks/useError';


const ReplyModal = ({ isOpen, closeModal }) => {
  const {
    captchaResponse, setCaptchaResponse,
    setChallengesArray,
    setIsCaptchaOpen,
    setPendingComment,
    setPendingCommentIndex,
    setResolveCaptchaPromise,
    selectedAddress,
    selectedParentCid,
    selectedShortCid,
    selectedStyle,
  } = useGeneralStore(state => state);

  const account = useAccount();

  const [, setNewErrorMessage] = useError();
  
  const nodeRef = useRef(null);
  const nameRef = useRef();
  const commentRef = useRef();
  const linkRef = useRef();

  const [triggerPublishComment, setTriggerPublishComment] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setIsMobile]);

  
  const onModalOpen = () => {
    if (commentRef.current) {
      commentRef.current.focus();
    }
  };
  

  const getSelectedText = useCallback(() => {
    const text = document.getSelection().toString();
    setSelectedText(text ? `>${text}\n` : '');
  }, []);


  useEffect(() => {
    if (isOpen) {
      getSelectedText();
    } else {
      setSelectedText('');
    }
  }, [isOpen, getSelectedText]);
  

  const onChallengeVerification = (challengeVerification) => {
    if (challengeVerification.challengeSuccess === true) {
      console.log('challenge success');
    }
    else if (challengeVerification.challengeSuccess === false) {
      setNewErrorMessage('challenge failed', {reason: challengeVerification.reason, errors: challengeVerification.errors});
    }
  };


  const onChallenge = async (challenges, comment) => {
    setPendingComment(comment);
    let challengeAnswers = [];
    
    try {
      challengeAnswers = await getChallengeAnswersFromUser(challenges)
    }
    catch (error) {
      setNewErrorMessage(error);
    }
    if (challengeAnswers) {
      await comment.publishChallengeAnswers(challengeAnswers)
    }
  };

  
  useEffect(() => {
    setPublishCommentOptions((prevPublishCommentOptions) => ({
      ...prevPublishCommentOptions,
      subplebbitAddress: selectedAddress,
    }));
  }, [selectedAddress]);
  
  
  const [publishCommentOptions, setPublishCommentOptions] = useState({
    subplebbitAddress: selectedAddress,
    onChallenge,
    onChallengeVerification,
    onError: (error) => {
      setNewErrorMessage(error);
    },
  });


  const { publishComment, index } = usePublishComment(publishCommentOptions);

  useEffect(() => {
    if (index !== undefined) {
      setPendingCommentIndex(index);
    }
  }, [index, setPendingCommentIndex]);

  
  const resetFields = useCallback(() => {
    if (nameRef.current) {
      nameRef.current.value = '';
    }
    if (commentRef.current) {
      commentRef.current.value = '';
    }
    if (linkRef.current) {
      linkRef.current.value = '';
    }
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      commentRef.current.value === "" &&
      linkRef.current.value === ""
    ) {
      setNewErrorMessage("Please enter a comment or link.");
      return;
    }

    setPublishCommentOptions((prevPublishCommentOptions) => ({
      ...prevPublishCommentOptions,
      author: {
        displayName: nameRef.current.value || undefined,
      },
      content: commentRef.current.value || undefined,
      link: linkRef.current.value || undefined,
      parentCid: selectedParentCid,
    }));
  
    setTriggerPublishComment(true);
  };
  
  
  useEffect(() => {
    if (publishCommentOptions && triggerPublishComment) {
      (async () => {
        await publishComment();
        resetFields();
        closeModal();
      })();
      setTriggerPublishComment(false);
    }
  }, [publishCommentOptions, triggerPublishComment, publishComment, resetFields, closeModal]);


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
        reject(setNewErrorMessage('Could not load challenges'));
      };
    });
  };


  return (
    <StyledModal
    isOpen={isOpen}
    onAfterOpen={onModalOpen}
    onRequestClose={closeModal}
    contentLabel="Reply Modal"
    shouldCloseOnEsc={true}
    shouldCloseOnOverlayClick={isMobile}
    selectedStyle={selectedStyle}
    overlayClassName="overlay"
    style={isMobile ? ({ overlay: { backgroundColor: "rgba(0,0,0,.25)" }}) : ({ overlay: { backgroundColor: "rgba(0,0,0,0)" }})
    }
  >
      <Draggable handle=".modal-header" nodeRef={nodeRef} disabled={isMobile}>
        <div className="modal-content" ref={nodeRef}>
          <div className="modal-header">
            Reply to c/{selectedShortCid}
            <button className="icon" onClick={() => closeModal()} title="close" />
          </div>
          <div id="form">
            <div>
              {account && account.author && account.author.displayName ? (
                <input id="name" type="text" value={account.author?.displayName} ref={nameRef} disabled />
              ) : (
                <input id="name" type="text" placeholder="Anonymous" ref={nameRef} />
              )}
            </div>
            <div>
              <input id="name" type="text" placeholder="Embed link" ref={linkRef} />
            </div>
            <div className="textarea-wrapper">
              <span className="fixed-text">{`c/${selectedShortCid}`}</span>
              <textarea className="textarea" 
                rows="4" 
                placeholder="Comment" 
                defaultValue={selectedText}
                wrap="soft" 
                ref={commentRef} 
              />
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