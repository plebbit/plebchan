import React, { useState } from "react";
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
  const [expanded, setExpanded] = useState([]);

  const handleCloseModal = () => {
    closeModal();

    if (location.pathname === "/settings") {
      navigate(-1, { replace: true });
    } else {
      navigate("/settings", { state: { from: location } });
    }
  };

  const toggleExpanded = (index) => {
    setExpanded((prevExpanded) => {
      const newExpanded = [...prevExpanded];
      if (newExpanded.includes(index)) {
        newExpanded.splice(newExpanded.indexOf(index), 1);
      } else {
        newExpanded.push(index);
      }
      return newExpanded;
    });
  };

  const expandAll = () => {
    if (expanded.length === 3) {
      setExpanded([]);
    } else {
      setExpanded([0, 1, 2]);
    }
  };
  
  
  
  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Settings"
      style={customOverlayStyles}
      selectedStyle={selectedStyle}
      expanded={expanded}
    >
      <div className="panel">
        <div className="panel-header">
          Settings
          <Link to="" onClick={handleCloseModal}>
            <span className="icon" title="close" />
          </Link>
        </div>
        <div className="all-div">
          [
          <button className="all-button" 
          onClick={expandAll} style={{all: "unset", cursor: "pointer"}}>
            {expanded.length === 3 ? "Collapse All Settings" : "Expand All Settings"}
          </button>
          ]
        </div>
        <ul>
          <li className="settings-cat-lbl">
          <span className={`${expanded.includes(0) ? 'minus' : 'plus'}`}
            onClick={() => toggleExpanded(0)}
          />
          <span className="settings-pointer" style={{cursor: "pointer"}}
            onClick={() => toggleExpanded(0)}
          >Account</span>
          </li>
          <ul className="settings-cat" style={{ display: expanded.includes(0) ? 'block' : 'none' }}>
            <li>
            </li>
          </ul>
        </ul>
        <ul>
          <li className="settings-cat-lbl">
          <span className={`${expanded.includes(1) ? 'minus' : 'plus'}`}
            onClick={() => toggleExpanded(1)}
          />
          <span className="settings-pointer" style={{cursor: "pointer"}}
            onClick={() => toggleExpanded(1)}
          >Profile</span>
          </li>
          <ul className="settings-cat" style={{ display: expanded.includes(1) ? 'block' : 'none' }}>
            <li>
            </li>
          </ul>
        </ul>
        <ul>
          <li className="settings-cat-lbl">
          <span className={`${expanded.includes(2) ? 'minus' : 'plus'}`}
            onClick={() => toggleExpanded(2)}
          />
          <span className="settings-pointer" style={{cursor: "pointer"}}
            onClick={() => toggleExpanded(2)}
          >Plebbit Options</span>
          </li>
          <ul className="settings-cat" style={{ display: expanded.includes(2) ? 'block' : 'none' }}>
            <li className="settings-option disc">
              IPFS Gateway URL</li>
            <li className="settings-tip">Optional URL of an IPFS gateway</li>
            <div className="settings-input">
              <input type="text" placeholder="IPFS Gateway URL" />
            </div>
          </ul>
          <ul className="settings-cat" style={{ display: expanded.includes(2) ? 'block' : 'none' }}>
            <li className="settings-option disc">
              IPFS HTTP Client Options</li>
            <li className="settings-tip">Optional URL of an IPFS API or IpfsHttpClientOptions, http://localhost:5001 to use a local IPFS node</li>
            <div className="settings-input">
              <input type="text" placeholder="IpfsHttpClientOptions" />
            </div>
          </ul>
          <ul className="settings-cat" style={{ display: expanded.includes(2) ? 'block' : 'none' }}>
            <li className="settings-option disc">
              PubSub HTTP Client Options</li>
            <li className="settings-tip">Optional URL or IpfsHttpClientOptions used for pubsub publishing when ipfsHttpClientOptions isn't available, like in the browser</li>
            <div className="settings-input">
              <input type="text" placeholder="pubsubHttpClientOptions" />
            </div>
          </ul>
        </ul>
        <div className="center">
          <button className="save-button">Save</button>
          <button className="reset-button">Reset</button>
        </div>
      </div>
    </StyledModal>
  );
}

Modal.setAppElement("#root");

export default SettingsModal;