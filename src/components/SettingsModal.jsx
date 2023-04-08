import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import styled from "styled-components";
import useGeneralStore from "../hooks/stores/useGeneralStore";

const StyledModal = styled(Modal)`
  .panel {
    top: 60px;
    width: 330px;
    left: 50%;
    margin-left: -178px;
    position: absolute;
    padding: 2px 5px 5px;
    font-size: 14px;
    box-shadow: 0 0 5px rgba(0, 0, 0, .25);
  }

  .panel-header {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 5px;
    margin-top: 5px;
    padding-bottom: 5px;
    text-align: center;
    line-height: 14px;
  }

  .icon {
    right: 5px;
    width: 18px;
    height: 18px;
    display: block;
    background-size: 100%;
    cursor: pointer;
    position: absolute;
    top: 5px;
  }

  h4 {
    font-size: 14px;
    padding: 0;
    margin: 10px 0 5px;
  }

  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return `
        .panel {
          background-color: #f0e0d6;
        }

        .panel-header {
          border-bottom: 1px solid #d9bfb7;
        }

        .icon {
          background-image: url(/assets/buttons/cross_red.png);
        }`;

      case 'Yotsuba-B':
        return `
        .panel {
          background-color: #d6daf0;
        }
        
        .panel-header {
          border-bottom: 1px solid #b7c5d9;
        }
        
        .icon {
          background-image: url(/assets/buttons/cross_blue.png);
        }`;

      case 'Futaba':
        return `
        .panel {
          background-color: #f0e0d6;
        }

        .panel-header {
          border-bottom: 1px solid rgba(0,0,0,.2);
        }
        
        .icon {
          background-image: url(/assets/buttons/cross_red.png);
        }`;

      case 'Burichan':
        return `
        .panel {
          background-color: #d6daf0;
        }
        
        .panel-header {
          border-bottom: 1px solid rgba(0,0,0,.2);
        }
        
        .icon {
          background-image: url(/assets/buttons/cross_blue.png);
        }`;

      case 'Tomorrow':
        return `
        .panel {
          background-color: #282a2e;
        }
        
        .panel-header {
          border-bottom: 1px solid #111;
        }
        
        .icon {
          background-image: url(/assets/buttons/cross_dark.png);
        }`;

      case 'Photon':
        return `
        .panel {
          background-color: #ddd;
        }
        
        .panel-header {
          border-bottom: 1px solid rgba(0, 0, 0, 0.20);
        }
        
        .icon {
          background-image: url(/assets/buttons/cross_photon.png);
        }`;
      
    }
  }}
`;

const customOverlayStyles = {
  overlay: {
    backgroundColor: 'rgba(0,0,0,.25)'
  }
};

const SettingsModal = ({ isOpen, closeModal }) => {
  const selectedStyle = useGeneralStore(state => state.selectedStyle);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCloseModal = () => {
    closeModal();

    if (location.pathname === "/settings") {
      navigate(-1, { replace: true });
    } else {
      navigate("/settings", { state: { from: location } });
    }
  };

  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Settings"
      style={customOverlayStyles}
      selectedStyle={selectedStyle}
    >
      <div className="panel">
        <div className="panel-header">
          Settings
          <Link to="" onClick={handleCloseModal}>
            <span className="icon" title="close" />
          </Link>
        </div>
        <h4>Plebbit Options</h4>
        <p>Coming soon...</p>
      </div>
    </StyledModal>
  );
}

Modal.setAppElement("#root");

export default SettingsModal;