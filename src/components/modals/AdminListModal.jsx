import React, { useEffect, useState, useRef } from 'react';
import Modal from 'react-modal';
import Draggable from 'react-draggable';
import { StyledModal } from '../styled/modals/ReplyModal.styled';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import { BoardForm } from '../styled/views/Board.styled';
import { Link } from 'react-router-dom';

const AdminListModal = ({ isOpen, closeModal, roles }) => {
  const { selectedStyle } = useGeneralStore((state) => state);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const nodeRef = useRef(null);
  const rolesList = roles ? Object.entries(roles).map(([address, { role }]) => ({ address, role })) : [];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setIsMobile]);

  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel='Reply Modal'
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={isMobile}
      selectedStyle={selectedStyle}
      overlayClassName='overlay'
      style={isMobile ? { overlay: { backgroundColor: 'rgba(0,0,0,.25)' } } : { overlay: { backgroundColor: 'rgba(0,0,0,0)' } }}
    >
      <Draggable handle='.modal-header' nodeRef={nodeRef} disabled={isMobile}>
        <div
          className='modal-content'
          ref={nodeRef}
          style={{
            maxWidth: '300px',
            maxHeight: '250px',
          }}
        >
          <button className='icon' style={{ imageRendering: 'pixelated', margin: '1px 1px 0 0' }} onClick={() => closeModal()} title='close' />
          <div className='modal-header'>   Moderators</div>
          <div
            className='list'
            style={{
              padding: '10px',
              maxHeight: '200px',
              maxWidth: '300px',
              overflowY: 'auto',
              overflowX: 'hidden',
              wordWrap: 'break-word',
              wordBreak: 'break-all',
            }}
          >
            <BoardForm selectedStyle={selectedStyle} style={{ all: 'unset' }}>
              {roles ? (
                rolesList.map(({ address, role }, index) => (
                  <p key={index}>
                    •{' '}
                    <Link to={() => {}} className='quote-link'>
                      u/{address}
                    </Link>
                    : {role}
                  </p>
                ))
              ) : (
                <p>This board doesn't have moderators yet.</p>
              )}
            </BoardForm>
          </div>
        </div>
      </Draggable>
    </StyledModal>
  );
};

Modal.setAppElement('#root');

export default AdminListModal;
