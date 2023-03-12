import React, { useState, useContext } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { BoardContext } from '../App';

const StyledModal = styled(Modal)`
  @media (min-width: 480px) {
    .modal-content {
      width: 450px;
      height: 300px;
    }
  }

  @media (max-width: 480px) {
    .modal-content {
      width: 90%;
      height: 40%;
    }
  }
  .modal-content {
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
    width: 80%;
    height: 100px;
    object-fit: contain;
  }

  .challenge {
    font-size: 12pt;
    margin-bottom: 30px;
    font-weight: 700;
    color: #fff;
  }

  input {
    margin-top: 30px;
    width: 70%;
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
  const { captchaResponse, setCaptchaResponse } = useContext(BoardContext);

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
        onChange={handleChallengeResponse} />
      </div>
    </StyledModal>
  );
};

Modal.setAppElement('#root');

export default CaptchaModal;
