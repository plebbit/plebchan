import React from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { StyledModal } from "./styled/ModerationModal.styled";
import useGeneralStore from "../hooks/stores/useGeneralStore";


const ModerationModal = ({ isOpen, closeModal }) => {
  const selectedStyle = useGeneralStore(state => state.selectedStyle);

  const handleCloseModal = () => {
    closeModal();
  }

  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel="Moderator Tools"
      style={{ overlay: { backgroundColor: "rgba(0,0,0,.25)" }}}
      selectedStyle={selectedStyle}
    >
      <div className="panel">
        <div className="panel-header">
          Moderator Tools
          <Link to="" onClick={handleCloseModal}>
            <span className="icon" title="close" />
          </Link>
        </div>
        <ul className="settings-cat">
          <li className="settings-cat-lbl"> 
            <input type="checkbox" style={{marginRight: "10px"}} />
            Pin thread
          </li>
          <li className="settings-tip">
            Pin the thread to make it a sticky, showed at the top of the board even as new posts are submitted.
          </li>
        </ul>
        <ul className="settings-cat">
          <li className="settings-cat-lbl"> 
            <input type="checkbox" style={{marginRight: "10px"}} />
            Delete thread
          </li>
          <li className="settings-tip">
            The post will no longer visible to other users, but the person who posted it can still see it in their own account.
          </li>
        </ul>
        <ul className="settings-cat">
        <li className="settings-cat-lbl"> 
          <input type="checkbox" style={{marginRight: "10px"}} />
            Close thread
          </li>
          <li className="settings-tip">
            Closing a thread allows users to still see the content, but they cannot add any new replies to it.
          </li>
        </ul>
        <ul className="settings-cat">
          <li className="settings-option disc">
            Reason
          </li>
          <li className="settings-tip">
            Help people become better posters by giving a short reason why their post was removed.
          </li>
          <li className="settings-input" style={{marginTop: "-10px"}}>
            <textarea placeholder="Enter reason here..." />
          </li>
        </ul>
        <button
          className="save-button"
          onClick={async () => {
              // await deleteCaches();
              // localStorage.setItem("cacheCleared", "true");
              // window.location.reload();
            }
          }
        >
          Save
        </button>
      </div>
    </StyledModal>
  );
}

Modal.setAppElement("#root");

export default ModerationModal;