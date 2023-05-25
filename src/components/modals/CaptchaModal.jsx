import React, { useEffect, useState, useRef } from 'react';
import { StyledModal } from '../styled/modals/CaptchaModal.styled';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import Modal from 'react-modal';
import Draggable from 'react-draggable';


const CaptchaModal = () => {
  const { 
    challengesArray,
    pendingComment,
    selectedStyle,
    setCaptchaResponse,
    isCaptchaOpen, setIsCaptchaOpen,
    selectedShortCid,
   } = useGeneralStore(state => state);

  const [imageSources, setImageSources] = useState([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [totalChallenges, setTotalChallenges] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const responseRef = useRef();
  const nodeRef = useRef(null);


    useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setIsMobile]);


  useEffect(() => {
    if (challengesArray) {
      const challenges = challengesArray.challenges;
      const decryptedChallenges = [];

      for (let i = 0; i < challenges?.length; i++) {
        const imageString = challenges[i].challenge;
        const imageSource = `data:image/png;base64,${imageString}`;
        decryptedChallenges.push(imageSource);
      }

      setImageSources(decryptedChallenges);
      setTotalChallenges(decryptedChallenges.length);
    }
  }, [challengesArray]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitCaptcha();
    }
  };

  const handleReturnKeyDown = () => {
    submitCaptcha((response) => {
      useGeneralStore.getState().setCaptchaResponse(response);
      useGeneralStore.getState().resolveCaptchaPromise(response);
    });
  };

  
  const submitCaptcha = (callback) => {
    setCaptchaResponse(responseRef.current.value);
    setIsCaptchaOpen(false);

    if (callback) {
      callback(responseRef.current.value);
    }
};


  return (
    <StyledModal
    isOpen={isCaptchaOpen}
    onRequestClose={() => setIsCaptchaOpen(false)}
    contentLabel="Captcha Modal"
    shouldCloseOnEsc={false}
    shouldCloseOnOverlayClick={false}
    selectedStyle={selectedStyle}
    overlayClassName="hide-modal-overlay">
      <Draggable handle=".modal-header" nodeRef={nodeRef} disabled={isMobile}>
        <div className="modal-content" ref={nodeRef}>
          <div className="modal-header">
            {pendingComment.parentCid ? 
            ("Challenges for Reply to c/" + selectedShortCid) : 
            "Challenges for New Thread"}
            <button className="icon" onClick={() => setIsCaptchaOpen(false)} title="close" />
          </div>
          <div id="form">
            {pendingComment.author?.displayName ? (
              <div>
                <input id="field" type="text" placeholder={pendingComment.author?.displayName} disabled />
              </div>
            ) : null}
            {pendingComment.title ? (
              <div>
                <input id="field" type="text" placeholder={pendingComment.title} disabled />
              </div>
            ) : null}
            {pendingComment.content ? (
              <div>
                <textarea
                  rows="4"
                  placeholder={pendingComment.content || "Comment"}
                  wrap="soft"
                  disabled
                />
              </div>
            ) : null}
            {pendingComment.link ? (
              <div>
                <input id="field" type="text" placeholder={pendingComment.link} disabled />
              </div>
            ) : null}
            <div id="captcha-container">
              <input 
              id="response"
              type="text" 
              autoComplete='off'
              placeholder="TYPE THE CAPTCHA HERE AND PRESS ENTER" 
              ref={responseRef}
              onKeyDown={handleKeyDown}
              onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}
              autoFocus />
              <img src={imageSources[currentChallengeIndex]} alt="captcha" />
            </div>
            <div>
              <span style={{lineHeight: '1.7'}}>
                Challenge {currentChallengeIndex + 1} of {totalChallenges}
              </span>
              <button
                id="nav"
                onClick={() => {
                  if (currentChallengeIndex + 1 < totalChallenges) {
                    setCurrentChallengeIndex((currentChallengeIndex + 1) % totalChallenges);
                  } else {
                    handleReturnKeyDown();
                  }
                }}
              >
                {currentChallengeIndex + 1 < totalChallenges ? "Next" : "Post"}
              </button>
            </div>
          </div>
        </div>
      </Draggable>
    </StyledModal>
  );
};

Modal.setAppElement('#root');

export default CaptchaModal;