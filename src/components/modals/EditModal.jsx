import React, { useEffect, useRef, useState } from 'react';
import { StyledModal } from '../styled/modals/ReplyModal.styled';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import Modal from 'react-modal';
import Draggable from 'react-draggable';

const EditModal = ({ isOpen, closeModal, originalCommentContent }) => {
  const { setEditedComment, selectedStyle } = useGeneralStore((state) => state);

  const nodeRef = useRef(null);
  const commentRef = useRef();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setIsMobile]);

  const handleSaveEdit = () => {
    setEditedComment(commentRef.current.value);
    closeModal();
  };

  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel='Edit Comment'
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={isMobile}
      selectedStyle={selectedStyle}
      style={isMobile ? { overlay: { backgroundColor: 'rgba(0,0,0,.25)' } } : { overlay: { backgroundColor: 'rgba(0,0,0,0)' } }}
    >
      <Draggable handle='.modal-header' nodeRef={nodeRef} disabled={isMobile}>
        <div className='modal-content' ref={nodeRef}>
          <div className='modal-header'>
            Edit Comment
            <button className='icon' onClick={() => closeModal()} title='close' />
          </div>
          <div id='form'>
            <div className='textarea-wrapper'>
              <textarea
                className='textarea'
                rows='4'
                style={{ paddingTop: '0' }}
                placeholder='Comment'
                defaultValue={originalCommentContent}
                wrap='soft'
                ref={commentRef}
              />
            </div>
            <div>
              <button id='next' onClick={handleSaveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      </Draggable>
    </StyledModal>
  );
};

Modal.setAppElement('#root');

export default EditModal;
