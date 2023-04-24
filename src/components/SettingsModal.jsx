import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { deleteCaches, setAccount, useAccount } from "@plebbit/plebbit-react-hooks";
import { StyledModal } from "./styled/SettingsModal.styled";
import useGeneralStore from "../hooks/stores/useGeneralStore";
import useError from "../hooks/useError";
import useSuccess from "../hooks/useSuccess";
import packageJson from '../../package.json'
const {version} = packageJson


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
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  useError(errorMessage, [errorMessage]);
  useSuccess(successMessage, [successMessage]);

  const account = useAccount();

  const gatewayRef = useRef();
  const ipfsRef = useRef();
  const pubsubRef = useRef();
  const dataPathRef = useRef();

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSavePlebbitOptions = async () => {
    const gatewayUrls = gatewayRef.current.value.split('\n').filter(url => url.trim());
    const ipfsClientsOptions = ipfsRef.current.value.split('\n').filter(url => url.trim()) || undefined;
    const pubsubClientsOptions = pubsubRef.current.value.split('\n').filter(url => url.trim());

    const invalidUrls = [
      ...gatewayUrls,
      ...(ipfsClientsOptions || []),
      ...pubsubClientsOptions,
    ].filter((url) => !isValidURL(url));

    if (invalidUrls.length > 0) {
      setErrorMessage(`Invalid URL(s): ${invalidUrls.join(', ')}`);
      return;
    }

    const plebbitOptions = {
      ipfsGatewayUrls: gatewayUrls,
      ipfsHttpClientsOptions: ipfsClientsOptions,
      pubsubHttpClientsOptions: pubsubClientsOptions,
    };

    try {
      await setAccount({ ...account, plebbitOptions });
      localStorage.setItem("toastMessage", "Settings Saved");
      window.location.reload();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };


  const handleResetPlebbitOptions = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const defaultGatewayUrls = [
      'https://ipfs.io',
      'https://ipfsgateway.xyz',
      'https://cloudflare-ipfs.com'
    ];
    const defaultPubsubHttpClientsOptions = ['https://pubsubprovider.xyz/api/v0'];

    gatewayRef.current.value = defaultGatewayUrls.join('\n');
    ipfsRef.current.value = "";
    pubsubRef.current.value = defaultPubsubHttpClientsOptions.join('\n');
    dataPathRef.current.value = "";

    try {
      await setAccount({
        ...account,
        plebbitOptions: {
          ipfsGatewayUrls: defaultGatewayUrls,
          ipfsHttpClientsOptions: undefined,
          pubsubHttpClientsOptions: defaultPubsubHttpClientsOptions,
        },
      });
      localStorage.setItem("toastMessage", "Settings Reset");
      window.location.reload();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };


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
  
  
  useEffect(() => {
    if (localStorage.getItem("cacheCleared") === "true") {
      setSuccessMessage("Cache Cleared");
      localStorage.removeItem("cacheCleared");
    }
  }, []);
  
  
  
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
          <span id="version">
            v{version}
          </span>
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
        {/* <ul>
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
        </ul> */}
        <ul>
          <li className="settings-cat-lbl">
            <span className={`${expanded.includes(2) ? 'minus' : 'plus'}`}
              onClick={() => toggleExpanded(2)}
            />
            <span className="settings-pointer" style={{cursor: "pointer"}}
              onClick={() => toggleExpanded(2)}
            >Plebbit Options</span>
            <div className="plebbit-options-buttons"
              style={{ display: expanded.includes(2) ? 'block' : 'none' }}
            >
              <button className="save-button" onClick={handleSavePlebbitOptions}>Save</button>
              <button className="reset-button"onClick={handleResetPlebbitOptions}>Reset</button>
             </div>
          </li>
          <ul className="settings-cat" style={{ display: expanded.includes(2) ? 'block' : 'none' }}>
            <li className="settings-option disc">
              IPFS Gateway URLs</li>
            <li className="settings-tip">Optional URLs of IPFS gateways.</li>
            <div className="settings-input">
              <textarea placeholder="IPFS Gateway URLs"
                defaultValue={account?.plebbitOptions?.ipfsGatewayUrls.join("\n")}
                ref={gatewayRef}
              />
            </div>
          </ul>
          <ul className="settings-cat" style={{ display: expanded.includes(2) ? 'block' : 'none' }}>
            <li className="settings-option disc">
              IPFS HTTP Clients Options</li>
            <li className="settings-tip">Optional URLs of IPFS APIs or IpfsHttpClientOptions, 'http://localhost:5001/api/v0' to use a local IPFS node.</li>
            <div className="settings-input">
              <textarea placeholder="IPFS HTTP Clients Options" 
                defaultValue={account?.plebbitOptions?.ipfsHttpClientsOptions ? account?.plebbitOptions?.ipfsHttpClientsOptions.join("\n") : ''}
                ref={ipfsRef}
              />
            </div>
          </ul>
          <ul className="settings-cat" style={{ display: expanded.includes(2) ? 'block' : 'none' }}>
            <li className="settings-option disc">
              PubSub HTTP Clients Options</li>
            <li className="settings-tip">Optional URLs or IpfsHttpClientOptions used for pubsub publishing when ipfsHttpClientOptions isn't available, like in the browser.</li>
            <div className="settings-input">
              <textarea placeholder="PubSub HTTP Clients Options" 
                defaultValue={account?.plebbitOptions?.pubsubHttpClientsOptions.join("\n")} 
                ref={pubsubRef} 
              />
            </div>
          </ul>
          <ul className="settings-cat" style={{ display: expanded.includes(2) ? 'block' : 'none' }}>
            <li className="settings-option disc">
              Data Path (Node Only)</li>
            <li className="settings-tip">Optional folder path to create/resume the user and subplebbit databases.</li>
            <div className="settings-input">
              <textarea placeholder="Data Path (Node Only)"
                ref={dataPathRef}
              />
            </div>
          </ul>
          {/* <ul className="settings-cat" style={{ display: expanded.includes(2) ? 'block' : 'none' }}>
            <li className="settings-option disc">
              Chain Providers</li>
            <li className="settings-tip">Optional provider RPC URLs and chain IDs.</li>
            <ul>
              <li className="settings-option disc">Ethereum</li>
              <li className="settings-option disc">Avalanche</li>
              <li className="settings-option disc">Polygon</li>
            </ul>
          </ul> */}
        </ul>
        <div>
        <button
          className="cache-button"
          onClick={async () => {
            if (window.confirm("Are you sure you want to clear the cache?")) {
              await deleteCaches();
              localStorage.setItem("cacheCleared", "true");
              window.location.reload();
            }
          }}
        >
          Clear Cache
        </button>
        </div>
      </div>
    </StyledModal>
  );
}

Modal.setAppElement("#root");

export default SettingsModal;