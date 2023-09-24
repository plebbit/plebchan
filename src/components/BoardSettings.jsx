import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePublishSubplebbitEdit } from '@plebbit/plebbit-react-hooks';
import { StyledModal } from './styled/modals/ModerationModal.styled';
import useError from '../hooks/useError';
import useSuccess from '../hooks/useSuccess';
import useGeneralStore from '../hooks/stores/useGeneralStore';

const BoardSettings = ({ subplebbit }) => {
  const { setCaptchaResponse, setChallengesArray, setIsCaptchaOpen, setResolveCaptchaPromise, selectedAddress, selectedStyle } = useGeneralStore((state) => state);

  const allowedSettings = {
    address: subplebbit.address,
    apiUrl: subplebbit.apiUrl,
    description: subplebbit.description,
    pubsubTopic: subplebbit.pubsubTopic,
    settings: {
      fetchThumbnailUrls: subplebbit.settings?.fetchThumbnailUrls,
      fetchThumbnailUrlsProxyUrl: subplebbit.settings?.fetchThumbnailUrlsProxyUrl,
    },
    roles: subplebbit.roles,
    rules: subplebbit.rules,
    suggested: {
      avatarUrl: subplebbit.suggested?.avatarUrl,
      backgroundUrl: subplebbit.suggested?.backgroundUrl,
      bannerUrl: subplebbit.suggested?.bannerUrl,
      language: subplebbit.suggested?.language,
      primaryColor: subplebbit.suggested?.primaryColor,
      secondaryColor: subplebbit.suggested?.secondaryColor,
    },
    title: subplebbit.title,
  };

  const generateSettingsFromSubplebbit = (subplebbitData) => ({
    address: subplebbitData.address,
    apiUrl: subplebbitData.apiUrl,
    description: subplebbitData.description,
    pubsubTopic: subplebbitData.pubsubTopic,
    settings: {
      fetchThumbnailUrls: subplebbitData.settings?.fetchThumbnailUrls,
      fetchThumbnailUrlsProxyUrl: subplebbitData.settings?.fetchThumbnailUrlsProxyUrl,
    },
    roles: subplebbitData.roles,
    rules: subplebbitData.rules,
    suggested: {
      avatarUrl: subplebbitData.suggested?.avatarUrl,
      backgroundUrl: subplebbitData.suggested?.backgroundUrl,
      bannerUrl: subplebbitData.suggested?.bannerUrl,
      language: subplebbitData.suggested?.language,
      primaryColor: subplebbitData.suggested?.primaryColor,
      secondaryColor: subplebbitData.suggested?.secondaryColor,
    },
    title: subplebbitData.title,
  });

  const initialSettings = generateSettingsFromSubplebbit(subplebbit);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boardSettingsJson, setBoardSettingsJson] = useState(JSON.stringify(initialSettings, null, 2));
  const [triggerPublilshSubplebbitEdit, setTriggerPublishCommentEdit] = useState(false);

  const [, setNewErrorMessage] = useError();
  const [, setNewSuccessMessage] = useSuccess();

  const getDifferences = (oldObj, newObj) => {
    let differences = {};

    for (let key in oldObj) {
      if (typeof oldObj[key] === 'object' && oldObj[key] !== null) {
        const nestedDifferences = getDifferences(oldObj[key], newObj[key] || {});
        if (Object.keys(nestedDifferences).length > 0) {
          differences[key] = nestedDifferences;
        }
      } else if (oldObj[key] !== newObj[key]) {
        differences[key] = newObj[key];
      }
    }

    for (let key in newObj) {
      if (!oldObj.hasOwnProperty(key)) {
        differences[key] = newObj[key];
      }
    }

    return differences;
  };

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      setBoardSettingsJson(JSON.stringify(generateSettingsFromSubplebbit(subplebbit), null, 2));
      isInitialMount.current = false;
    }
  }, [subplebbit]);

  function validateSettings(updatedSettings, allowedSettings) {
    for (let key in updatedSettings) {
      if (!allowedSettings.hasOwnProperty(key) && !initialSettings.hasOwnProperty(key)) {
        throw new Error(`Unexpected setting: ${key}`);
      }

      if (typeof updatedSettings[key] === 'object' && updatedSettings[key] !== null && !Array.isArray(updatedSettings[key])) {
        if (typeof allowedSettings[key] !== 'object' || allowedSettings[key] === null || Array.isArray(allowedSettings[key])) {
          throw new Error(`Expected ${key} to be an object in allowedSettings`);
        }
        validateSettings(updatedSettings[key], allowedSettings[key]);
      }
    }
  }

  const onChallenge = async (challenges, subplebbitEdit) => {
    let challengeAnswers = [];

    try {
      challengeAnswers = await getChallengeAnswersFromUser(challenges);
    } catch (error) {
      setNewErrorMessage(error.message);
      console.log(error);
    }
    if (challengeAnswers) {
      await subplebbitEdit.publishChallengeAnswers(challengeAnswers);
    }
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

  const [editSubplebbitOptions, setEditSubplebbitOptions] = useState({
    subplebbitAddress: selectedAddress,
    onChallenge,
    onChallengeVerification,
    onError: (error) => {
      setNewErrorMessage(error.message);
      console.log(error);
    },
  });

  const { publishSubplebbitEdit } = usePublishSubplebbitEdit(editSubplebbitOptions);

  useEffect(() => {
    let isActive = true;
    if (editSubplebbitOptions && triggerPublilshSubplebbitEdit) {
      (async () => {
        await publishSubplebbitEdit(editSubplebbitOptions);
        if (isActive) {
          setTriggerPublishCommentEdit(false);
        }
      })();
    }

    return () => {
      isActive = false;
    };
  }, [editSubplebbitOptions, publishSubplebbitEdit, triggerPublilshSubplebbitEdit]);

  const handleSaveChanges = async () => {
    try {
      const updatedSettings = JSON.parse(boardSettingsJson);
      validateSettings(updatedSettings, allowedSettings);
      const changes = getDifferences(initialSettings, updatedSettings);
      if (Object.keys(changes).length > 0) {
        setEditSubplebbitOptions((prevOptions) => ({
          ...prevOptions,
          ...changes,
        }));
        setTriggerPublishCommentEdit(true);
      } else {
        setNewErrorMessage('No changes detected');
      }
    } catch (error) {
      setNewErrorMessage(`Error saving changes: ${error}`);
      console.log(error);
    }
  };

  const handleResetChanges = () => {
    setBoardSettingsJson(JSON.stringify(initialSettings, null, 2));
  };

  function generateSettingsList(settingsObj, parentKey = '') {
    let result = [];

    for (let key in settingsObj) {
      if (typeof settingsObj[key] === 'object' && settingsObj[key] !== null) {
        const nestedItems = generateSettingsList(settingsObj[key], `${parentKey}${key}.`);
        if (nestedItems.length > 1) {
          result.push(`${parentKey}${key}: { ${nestedItems.join(', ')} }`);
        } else {
          result.push(...nestedItems);
        }
      } else {
        result.push(`${parentKey}${key}`);
      }
    }

    return result;
  }

  const possibleSettingsList = generateSettingsList(initialSettings);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBoardSettingsJson(JSON.stringify(initialSettings, null, 2));
  };

  const openModal = () => {
    setIsModalOpen(true);
    setBoardSettingsJson(JSON.stringify(generateSettingsFromSubplebbit(subplebbit), null, 2));
  };

  return (
    <>
      <StyledModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel='Board Settings'
        style={{ overlay: { backgroundColor: 'rgba(0,0,0,.25)' } }}
        selectedStyle={selectedStyle}
      >
        <div className='panel-board'>
          <div className='panel-header'>
            Board Settings
            <Link to='' onClick={handleCloseModal}>
              <span className='icon' title='close' />
            </Link>
          </div>
          <div className='settings-info'>
            <div>
              <strong>Allowed settings: </strong>
              <span>{`{ ${possibleSettingsList.join(', ')} }`}</span>
            </div>
            <strong style={{ marginTop: '10px', display: 'inline-block' }}>API docs: </strong>
            <a style={{ color: 'inherit' }} href='https://github.com/plebbit/plebbit-js#readme' target='_blank' rel='noreferrer'>
              https://github.com/plebbit/plebbit-js#readme
            </a>
          </div>
          <textarea
            value={boardSettingsJson}
            onChange={(e) => setBoardSettingsJson(e.target.value)}
            className='board-settings'
            autoComplete='off'
            autoCorrect='off'
            spellCheck='false'
          />
          <div className='button-group'>
            <button id='reset-board-settings' onClick={handleResetChanges}>
              Reset
            </button>
            <button id='save-board-settings' onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>
        </div>
      </StyledModal>
       [
      <span id='subscribe' style={{ cursor: 'pointer' }}>
        <span
          onClick={() => {
            window.electron && window.electron.isElectron
              ? openModal()
              : alert(
                  'To edit this board you must be using the plebchan desktop app, which is a plebbit full node that seeds the board automatically.\n\nDownload plebchan here:\n\nhttps://github.com/plebbit/plebchan/releases/latest',
                );
          }}
        >
          Settings
        </span>
      </span>
      ]
    </>
  );
};

export default BoardSettings;
