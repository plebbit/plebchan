import React from "react";
import { StyledModal } from "./styled/SettingsModal.styled";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import useGeneralStore from "../hooks/stores/useGeneralStore";

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