import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
  @media (min-width: 480px) {
    .modal-content {
      width: 450px;
      height: 350px;
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
    margin-top: 20px;
    width: 70%;
    padding: 2px;
    border: 1px solid #ccc;
    font-family: monospace;
    border: 1px solid #777;
    outline: none;
  }

  button.submit {
    margin-top: 20px;
    padding: 3px 15px;
    border-radius: 3px;
  }
`;

const customOverlayStyles = {
  overlay: {
    backgroundColor: 'rgba(0,0,0,.4)'
  }
};

const CaptchaModal = ({ isOpen, closeModal }) => {
  const handleCloseModal = () => {
    closeModal();
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
        <img src="/assets/banners/banner-1.jpg" alt="captcha" />
        <input type="text" autoComplete='off'
        placeholder="TYPE THE CAPTCHA HERE" />
        <button className="submit">Submit</button>
      </div>
    </StyledModal>
  );
};

Modal.setAppElement('#root');

export default CaptchaModal;
