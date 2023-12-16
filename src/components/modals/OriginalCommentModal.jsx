import React, { useState, useEffect } from 'react';
import { StyledModal } from '../styled/modals/ReplyModal.styled';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import Modal from 'react-modal';
import Draggable from 'react-draggable';
import getDate from '../../utils/getDate';

const OriginalCommentModal = ({ isOpen, closeModal, comment }) => {
  const { selectedStyle } = useGeneralStore((state) => state);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const nodeRef = React.useRef(null);
  const originalCommentContent = comment.original?.content;
  const timestamp = getDate(comment.timestamp);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setIsMobile]);

  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel='Original Comment'
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={isMobile}
      selectedStyle={selectedStyle}
      style={isMobile ? { overlay: { backgroundColor: 'rgba(0,0,0,.25)' } } : { overlay: { backgroundColor: 'rgba(0,0,0,0)' } }}
    >
      <Draggable handle='.modal-header' nodeRef={nodeRef} disabled={isMobile}>
        <div className='modal-content' ref={nodeRef}>
          <div className='modal-header'>
            Original at {timestamp}
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
                readOnly={true}
              />
            </div>
          </div>
        </div>
      </Draggable>
    </StyledModal>
  );
};

Modal.setAppElement('#root');

export default OriginalCommentModal;
