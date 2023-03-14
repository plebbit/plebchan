import React from 'react';
import useBoardStore from '../useBoardStore';
import Modal from 'react-modal';
import styled from 'styled-components';

const StyledModal = styled(Modal)`

  .modal-content {
    width: 400px;
    height: 300px;
    display: flex;
    align-self: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.75);
    padding: 0;
    z-index: 9999;
    border: 1px solid #aaa;
  }

  button.x {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  img {
    width: 300px;
    height: 100px;
    object-fit: contain;
  }

  .challenge {
    font-size: 12pt;
    margin-bottom: 40px;
    font-weight: 700;
    color: #fff;
  }

  input {
    margin-top: 30px;
    width: 300px;
    padding: 2px;
    border: 1px solid #ccc;
    font-family: monospace;
    border: 1px solid #777;
    outline: none;
  }
`;

const customOverlayStyles = {
  overlay: {
    backgroundColor: 'rgba(0,0,0,.4)'
  }
};

const CaptchaModal = ({ isOpen, closeModal, captchaImage }) => {
  const { captchaResponse, setCaptchaResponse } = useBoardStore(state => state);

  const handleCloseModal = () => {
    closeModal();
  };

  const handleChallengeResponse = (event) => {
    setCaptchaResponse(event.target.value);
  };  

  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={false}
      contentLabel="Captcha Modal"
      style={customOverlayStyles}
    >
      <div className="modal-content">
        <button className='x' onClick={handleCloseModal}>X</button>
        <div className="challenge">Verification</div>
        <img src={captchaImage} alt="captcha" />
        <input 
        type="text" 
        autoComplete='off'
        placeholder="TYPE THE CAPTCHA HERE AND PRESS ENTER" 
        value={captchaResponse} 
        onChange={handleChallengeResponse}
        autoFocus />
      </div>
    </StyledModal>
  );
};

Modal.setAppElement('#root');

export default CaptchaModal;
