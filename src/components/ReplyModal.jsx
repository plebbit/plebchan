import React from 'react';
import { StyledModal } from './styled/ReplyModal.styled';
import useGeneralStore from '../hooks/stores/useGeneralStore';
import Modal from 'react-modal';
import Draggable from 'react-draggable';


const ReplyModal = ({ isOpen, closeModal }) => {
  const selectedStyle = useGeneralStore(state => state.selectedStyle);

  const handleCloseModal = () => {
    closeModal();
  };

  const nodeRef = React.useRef(null);

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
            Reply to Thread
            <button className="icon" onClick={handleCloseModal} title="close" />
          </div>
          <div id="form">
            <div>
              <input id="name" type="text" placeholder="Name"></input>
            </div>
            <div>
              <input id="name" type="text" placeholder="Embed link" disabled></input>
            </div>
            <div>
              <textarea rows="4" placeholder="Comment" wrap="soft"></textarea>
            </div>
            <div>
              <button id="next">Post</button>
            </div>
          </div>
        </div>
      </Draggable>
    </StyledModal>
  );
};

Modal.setAppElement('#root');

export default ReplyModal;