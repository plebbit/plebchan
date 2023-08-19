import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StyledModal } from './styled/modals/ModerationModal.styled';
import useError from "../hooks/useError";
import useSuccess from "../hooks/useSuccess";
import useGeneralStore from '../hooks/stores/useGeneralStore';

const BoardSettings = ({ subplebbit }) => {
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
  const { selectedStyle } = useGeneralStore(state => state);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boardSettingsJson, setBoardSettingsJson] = useState(JSON.stringify(initialSettings, null, 2));

  const [, setNewErrorMessage] = useError();
  const [, setNewSuccessMessage] = useSuccess();
  

  useEffect(() => {
    setBoardSettingsJson(JSON.stringify(generateSettingsFromSubplebbit(subplebbit), null, 2));
  }, [subplebbit]);


  function validateSettings(updatedSettings, allowedSettings) {
    for (let key in updatedSettings) {
      if (!allowedSettings.hasOwnProperty(key)) {
        throw new Error(`Unexpected setting: ${key}`);
      }
  
      if (typeof updatedSettings[key] === 'object' && updatedSettings[key] !== null) {
        validateSettings(updatedSettings[key], allowedSettings[key]);
      }
    }
  }

  // TODO: add API logic
  const handleSaveChanges = async () => {
    try {
      const updatedSettings = JSON.parse(boardSettingsJson);
      validateSettings(updatedSettings, initialSettings);
  
      
  
      setNewSuccessMessage("Changes saved successfully");
    } catch (error) {
      setNewErrorMessage(`Error saving changes: `, error)
    }
  };


  const handleResetChanges = () => {
    setBoardSettingsJson(JSON.stringify(initialSettings, null, 2));
  };
  // TODO: add API logic
  

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
  };


  return (
    <>
      <StyledModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Board Settings"
        style={{ overlay: { backgroundColor: "rgba(0,0,0,.25)" }}}
        selectedStyle={selectedStyle}
      >
        <div className="panel-board">
          <div className="panel-header">
            Board Settings
            <Link to="" onClick={handleCloseModal}>
              <span className="icon" title="close" />
            </Link>
          </div>
          <div className="settings-info">
            <div>
              <strong>Allowed settings: </strong>
              <span>
                {`{ ${possibleSettingsList.join(', ')} }`}
              </span>
            </div>
            <strong style={{marginTop: '10px', display: 'inline-block'}}>API docs: </strong><a style={{color: 'inherit'}} href="https://github.com/plebbit/plebbit-js#readme" target="_blank" rel="noreferrer">https://github.com/plebbit/plebbit-js#readme</a>
          </div>
          <textarea
            value={boardSettingsJson}
            onChange={e => setBoardSettingsJson(e.target.value)}
            className="board-settings"
          />
          <div className="button-group">
            <button id="reset-board-settings" onClick={handleResetChanges}>Reset</button>
            <button id="save-board-settings" onClick={handleSaveChanges}>Save Changes</button>
          </div>
        </div>
      </StyledModal>
      [
        <span id="subscribe" style={{ cursor: 'pointer' }}>
          <span
            onClick={() => {
              window.electron && window.electron.isElectron
                ? setIsModalOpen(true)
                : alert(
                    'To edit this board you must be using the plebchan desktop app, which is a plebbit full node that seeds the board automatically.\n\nDownload plebchan here:\n\nhttps://github.com/plebbit/plebchan/releases/latest'
                  );
            }}
          >
            Board Settings
          </span>
        </span>
      ] 
    </>
  );
};

export default BoardSettings;