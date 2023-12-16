import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import { useComment, usePublishCommentEdit } from '@plebbit/plebbit-react-hooks';
import { StyledModal } from '../styled/modals/ModerationModal.styled';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import useError from '../../hooks/useError';
import useSuccess from '../../hooks/useSuccess';

const ModerationModal = ({ isOpen, closeModal, deletePost }) => {
  const { selectedAddress, selectedStyle, setCaptchaResponse, setChallengesArray, setIsCaptchaOpen, setIsModEdit, moderatingCommentCid, setResolveCaptchaPromise } =
    useGeneralStore((state) => state);

  const comment = useComment({ commentCid: moderatingCommentCid });

  const [pin, setPin] = useState(comment.pinned);
  const [deleteThread, setDeleteThread] = useState(deletePost);
  const [close, setClose] = useState(comment.locked);
  const [reason, setReason] = useState('');
  const [triggerPublishCommentEdit, setTriggerPublishCommentEdit] = useState(false);

  const [, setNewErrorMessage] = useError();
  const [, setNewSuccessMessage] = useSuccess();

  useEffect(() => {
    setPin(comment.pinned);
    setClose(comment.locked);
  }, [comment]);

  useEffect(() => {
    setDeleteThread(deletePost);
  }, [deletePost]);

  useEffect(() => {
    if (!isOpen) {
      setDeleteThread(deletePost);
    }
  }, [isOpen, deletePost]);

  const handleCloseModal = () => {
    setDeleteThread(false);
    closeModal();
  };

  const onChallengeVerification = (challengeVerification) => {
    if (challengeVerification.challengeSuccess === true) {
      setNewSuccessMessage('Challenge Success');
      console.log('challenge success', challengeVerification);
    } else if (challengeVerification.challengeSuccess === false) {
      setNewErrorMessage(`Challenge Failed, reason: ${challengeVerification.reason}. Errors: ${challengeVerification.errors}`);
      console.log('challenge failed', challengeVerification);
    }
  };

  const onChallenge = async (challenges, comment) => {
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
        reject(setNewErrorMessage('Could not load challenges'));
      };
    });
  };

  const [publishCommentEditOptions, setPublishCommentEditOptions] = useState({
    commentCid: moderatingCommentCid,
    subplebbitAddress: selectedAddress,
    onChallenge,
    onChallengeVerification,
    onError: (error) => {
      setNewErrorMessage(error.message);
      console.log(error);
    },
  });

  useEffect(() => {
    if (selectedAddress) {
      setPublishCommentEditOptions((prevOptions) => ({
        ...prevOptions,
        subplebbitAddress: selectedAddress,
      }));
    }
  }, [selectedAddress]);

  const { publishCommentEdit } = usePublishCommentEdit(publishCommentEditOptions);

  useEffect(() => {
    setPublishCommentEditOptions((prevOptions) => ({
      ...prevOptions,
      commentCid: moderatingCommentCid,
    }));
  }, [moderatingCommentCid]);

  useEffect(() => {
    let isActive = true;
    if (publishCommentEditOptions && triggerPublishCommentEdit) {
      (async () => {
        await publishCommentEdit();
        if (isActive) {
          setTriggerPublishCommentEdit(false);
        }
      })();
    }

    return () => {
      isActive = false;
    };
  }, [triggerPublishCommentEdit, publishCommentEdit, publishCommentEditOptions]);

  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel='Moderator Tools'
      style={{ overlay: { backgroundColor: 'rgba(0,0,0,.25)' } }}
      selectedStyle={selectedStyle}
    >
      <div className='panel'>
        <div className='panel-header'>
          Moderator Tools
          <Link to='' onClick={handleCloseModal}>
            <span className='icon' title='close' />
          </Link>
        </div>
        <ul className='settings-cat'>
          <li className='settings-cat-lbl'>
            <label>
              <input type='checkbox' style={{ marginRight: '10px' }} checked={pin} onChange={() => setPin(!pin)} />
              Pin post
            </label>
          </li>
          <li className='settings-tip'>Pin the post to make it a sticky, showed at the top of the board even as new posts are submitted.</li>
        </ul>
        <ul className='settings-cat'>
          <li className='settings-cat-lbl'>
            <label>
              <input type='checkbox' style={{ marginRight: '10px' }} checked={deleteThread} onChange={() => setDeleteThread(!deleteThread)} />
              Delete post
            </label>
          </li>
          <li className='settings-tip'>The post will no longer visible to other users, but the person who posted it can still see it in their own account.</li>
        </ul>
        <ul className='settings-cat'>
          <li className='settings-cat-lbl'>
            <label>
              <input type='checkbox' style={{ marginRight: '10px' }} checked={close} onChange={() => setClose(!close)} />
              Close post
            </label>
          </li>
          <li className='settings-tip'>Closing a post allows users to still see the content, but they cannot add any new replies to it.</li>
        </ul>
        <ul className='settings-cat'>
          <li className='settings-option disc'>Reason</li>
          <li className='settings-tip'>Help people become better posters by giving a short reason why their post was removed.</li>
          <li className='settings-input' style={{ marginTop: '-10px' }}>
            <textarea value={reason} placeholder='Enter reason here...' onChange={(e) => setReason(e.target.value)} />
          </li>
        </ul>
        <button
          className='save-button'
          onClick={async () => {
            setPublishCommentEditOptions((prevOptions) => ({
              ...prevOptions,
              pinned: pin,
              removed: deleteThread,
              locked: close,
              reason: reason,
            }));
            setTriggerPublishCommentEdit(true);
            setIsModEdit(true);
            handleCloseModal();
          }}
        >
          Save
        </button>
      </div>
    </StyledModal>
  );
};

Modal.setAppElement('#root');

export default ModerationModal;
