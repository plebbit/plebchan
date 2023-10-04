import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAccount, usePublishComment } from '@plebbit/plebbit-react-hooks';
import Modal from 'react-modal';
import Draggable from 'react-draggable';
import { StyledModal } from '../styled/modals/ReplyModal.styled';
import useAnonMode from '../../hooks/useAnonMode';
import useError from '../../hooks/useError';
import useAnonModeStore from '../../hooks/stores/useAnonModeStore';
import useGeneralStore from '../../hooks/stores/useGeneralStore';

const ReplyModal = ({ isOpen, closeModal }) => {
  const {
    captchaResponse,
    setCaptchaResponse,
    setChallengesArray,
    setIsCaptchaOpen,
    setPendingComment,
    setPendingCommentIndex,
    replyQuoteCid,
    setResolveCaptchaPromise,
    selectedAddress,
    selectedParentCid,
    selectedShortCid,
    selectedStyle,
    selectedText,
    setSelectedText,
    triggerInsertion,
  } = useGeneralStore((state) => state);

  const { anonymousMode } = useAnonModeStore();

  const account = useAccount();

  const [, setNewErrorMessage] = useError();

  const nodeRef = useRef(null);
  const nameRef = useRef();
  const commentRef = useRef();
  const linkRef = useRef();

  const [triggerPublishComment, setTriggerPublishComment] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const [executeAnonMode, setExecuteAnonMode] = useState(false);

  useAnonMode(selectedParentCid, anonymousMode && executeAnonMode);

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
      if (selectedText) {
        commentRef.current.value += '\n';
      }
      commentRef.current.focus();
      const len = commentRef.current.value.length;
      commentRef.current.setSelectionRange(len, len);
    }
  };

  const insertAtCursor = (inputElement, valueToInsert) => {
    const startPos = inputElement.selectionStart || inputElement.value.length;
    const endPos = startPos + valueToInsert.length;
    inputElement.setRangeText(valueToInsert, startPos, startPos, 'end');
    inputElement.setSelectionRange(endPos, endPos);
  };

  useEffect(() => {
    if (replyQuoteCid && commentRef.current) {
      const prefixedReplyQuoteCid = `c/${replyQuoteCid}\n`;
      insertAtCursor(commentRef.current, prefixedReplyQuoteCid);
    }
  }, [triggerInsertion, replyQuoteCid]);

  const getSelectedText = useCallback(() => {
    const text = document.getSelection().toString();
    setSelectedText(text ? `>${text}\n` : '');
  }, [setSelectedText]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(getSelectedText, 0);
    } else {
      setSelectedText('');
    }
  }, [isOpen, getSelectedText, setSelectedText]);

  const onChallengeVerification = (challengeVerification) => {
    if (challengeVerification.challengeSuccess === true) {
      return;
    } else if (challengeVerification.challengeSuccess === false) {
      setNewErrorMessage(`Challenge Failed, reason: ${challengeVerification.reason}. Errors: ${challengeVerification.errors}`);
      console.log('challenge failed', challengeVerification);
    }
  };

  const onChallenge = async (challenges, comment) => {
    setPendingComment(comment);
    let challengeAnswers = [];

    try {
      challengeAnswers = await getChallengeAnswersFromUser(challenges);
    } catch (error) {
      setNewErrorMessage(error.message);
      console.log(error);
    }
    if (challengeAnswers) {
      await comment.publishChallengeAnswers(challengeAnswers);
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
      setNewErrorMessage(error.message);
      console.log(error);
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

    if (commentRef.current.value === '' && linkRef.current.value === '') {
      setNewErrorMessage('Please enter a comment or link.');
      return;
    }

    setPublishCommentOptions((prevPublishCommentOptions) => ({
      ...prevPublishCommentOptions,
      author: {
        displayName: nameRef.current.value || undefined,
        ...(anonymousMode ? {} : { address: account?.author.address }),
      },
      content: commentRef.current.value || undefined,
      link: linkRef.current.value || undefined,
      parentCid: selectedParentCid,
    }));

    setTriggerPublishComment(true);
  };

  const updateSigner = useCallback(async () => {
    if (anonymousMode) {
      setExecuteAnonMode(true);

      let storedSigners = JSON.parse(localStorage.getItem('storedSigners')) || {};
      let signer;

      if (!storedSigners[selectedParentCid]) {
        signer = await account?.plebbit.createSigner();
        storedSigners[selectedParentCid] = { privateKey: signer?.privateKey, address: signer?.address };
        localStorage.setItem('storedSigners', JSON.stringify(storedSigners));
      } else {
        const signerPrivateKey = storedSigners[selectedParentCid].privateKey;

        try {
          signer = await account?.plebbit.createSigner({ type: 'ed25519', privateKey: signerPrivateKey });
        } catch (error) {
          console.log(error);
        }
      }

      setPublishCommentOptions((prevPublishCommentOptions) => {
        const newPublishCommentOptions = {
          ...prevPublishCommentOptions,
          signer,
          author: {
            ...prevPublishCommentOptions.author,
            address: signer?.address,
          },
        };

        if (JSON.stringify(prevPublishCommentOptions) !== JSON.stringify(newPublishCommentOptions)) {
          return newPublishCommentOptions;
        }

        return prevPublishCommentOptions;
      });
    }
  }, [selectedParentCid, anonymousMode, account]);

  useEffect(() => {
    if (anonymousMode) {
      updateSigner();
    }
  }, [updateSigner, anonymousMode]);

  useEffect(() => {
    if (publishCommentOptions && triggerPublishComment) {
      (async () => {
        await publishComment();
        resetFields();
        closeModal();
      })();
      setTriggerPublishComment(false);
      setExecuteAnonMode(false);
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
      contentLabel='Reply Modal'
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={isMobile}
      selectedStyle={selectedStyle}
      overlayClassName='overlay'
      style={isMobile ? { overlay: { backgroundColor: 'rgba(0,0,0,.25)' } } : { overlay: { backgroundColor: 'rgba(0,0,0,0)' } }}
    >
      <Draggable handle='.modal-header' nodeRef={nodeRef} disabled={isMobile}>
        <div className='modal-content' ref={nodeRef}>
          <div className='modal-header'>
            Reply to c/{selectedShortCid}
            <button className='icon' onClick={() => closeModal()} title='close' />
          </div>
          <div id='form'>
            <div>
              {account?.author.displayName ? (
                <input id='name' type='text' defaultValue={account?.author?.displayName} ref={nameRef} />
              ) : (
                <input id='name' type='text' placeholder='Anonymous' ref={nameRef} />
              )}
            </div>
            <div>
              <input id='name' type='text' placeholder='Link' ref={linkRef} />
            </div>
            <div className='textarea-wrapper'>
              <span className='fixed-text'>{`c/${selectedShortCid}`}</span>
              <textarea className='textarea' rows='4' placeholder='Comment' defaultValue={selectedText} wrap='soft' ref={commentRef} />
            </div>
            <div>
              <button id='next' onClick={handleSubmit}>
                Post
              </button>
            </div>
          </div>
        </div>
      </Draggable>
    </StyledModal>
  );
};

Modal.setAppElement('#root');

export default ReplyModal;
