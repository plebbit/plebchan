import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import {
  createAccount,
  deleteAccount,
  deleteCaches,
  exportAccount,
  importAccount,
  setAccount,
  setActiveAccount,
  useAccount,
  useAccounts,
  useResolvedAuthorAddress,
} from '@plebbit/plebbit-react-hooks';
import stringify from 'json-stringify-pretty-compact';
import { StyledModal } from '../styled/modals/SettingsModal.styled';
import useError from '../../hooks/useError';
import useSuccess from '../../hooks/useSuccess';
import useAnonModeStore from '../../hooks/stores/useAnonModeStore';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import packageJson from '../../../package.json';
const { version } = packageJson;
const commitRef = process?.env?.REACT_APP_COMMIT_REF ? ` ${process.env.REACT_APP_COMMIT_REF.slice(0, 7)}` : '';

const SettingsModal = ({ isOpen, closeModal }) => {
  const { selectedStyle } = useGeneralStore((state) => state);
  const { anonymousMode, setAnonymousMode } = useAnonModeStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [expanded, setExpanded] = useState([]);
  const [copyStatus, setCopyStatus] = useState(false);
  const [ensName, setEnsName] = useState('');
  const [checkedENS, setCheckedENS] = useState(false);
  const [triggerSwitchAccount, setTriggerSwitchAccount] = useState(false);

  const [, setNewErrorMessage] = useError();
  const [, setNewSuccessMessage] = useSuccess();

  const account = useAccount();
  const { accounts } = useAccounts();

  const accountJson = useMemo(() => {
    if (account) {
      const { plebbit, karma, unreadNotificationCount, ...restOfAccount } = account;
      return stringify({ account: restOfAccount });
    }
  }, [account]);

  const [editedAccountJson, setEditedAccountJson] = useState(accountJson);
  useEffect(() => {
    setEditedAccountJson(accountJson);
  }, [accountJson]);

  const gatewayRef = useRef();
  const ipfsRef = useRef();
  const pubsubRef = useRef();
  const ethereumRpcRef = useRef();
  const polygonRpcRef = useRef();
  const dataPathRef = useRef();
  const importRef = useRef();
  const nameRef = useRef();
  const ensRef = useRef();

  const isElectron = window.electron && window.electron.isElectron;
  const author = { ...account?.author, address: ensName };
  const { resolvedAddress, state } = useResolvedAuthorAddress({ author, cache: false });

  const defaultGatewayUrls = isElectron ? undefined : ['https://ipfs.io', 'https://ipfsgateway.xyz', 'https://cloudflare-ipfs.com', 'https://plebpubsub.live'];

  const defaultPubsubHttpClientsOptions = isElectron ? undefined : ['https://pubsubprovider.xyz/api/v0', 'https://plebpubsub.live/api/v0'];

  const defaultEthereumRpcUrls = ['ethers.js', 'https://ethrpc.xyz', 'viem'];

  const defaultPolygonRpcUrls = ['https://polygon-rpc.com'];

  useEffect(() => {
    if (checkedENS && resolvedAddress && state === 'succeeded') {
      setCheckedENS(false);
    }
  }, [checkedENS, state, resolvedAddress]);

  const handleENSChange = () => {
    const newEnsName = ensRef.current.value;
    setEnsName(newEnsName);
  };

  const handleENSCheck = () => {
    const newEnsName = ensRef.current.value;
    setEnsName(newEnsName);
    setCheckedENS(true);
  };

  const handleENSSave = async () => {
    if (resolvedAddress === account?.signer?.address) {
      try {
        await setAccount({
          ...account,
          author: {
            ...account?.author,
            address: ensName,
          },
        });
        setAnonymousMode(false);
        localStorage.setitem('successToast', 'ENS name saved successfully. Anon mode has been disabled.');
        window.location.reload();
      } catch (error) {
        setNewErrorMessage(error.message);
        console.log(error);
      }
    } else if (resolvedAddress !== account?.signer?.address) {
      setNewErrorMessage(`Failed resolving address, ${ensName}`);
    }
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(account?.author.address);
      setCopyStatus(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  useEffect(() => {
    let copyStatusTimeoutId;
    let checkedENSTimeoutId;
    if (copyStatus) {
      copyStatusTimeoutId = setTimeout(() => setCopyStatus(false), 3000);
    }
    if (checkedENS) {
      checkedENSTimeoutId = setTimeout(() => setCheckedENS(false), 5000);
    }
    return () => {
      clearTimeout(copyStatusTimeoutId);
      clearTimeout(checkedENSTimeoutId);
    };
  }, [copyStatus, checkedENS]);

  const handleSavePlebbitOptions = async () => {
    let gatewayUrls = gatewayRef.current.value.split('\n').filter((url) => url.trim());
    let ipfsClientsOptions = ipfsRef.current.value.split('\n').filter((url) => url.trim());
    let pubsubClientsOptions = pubsubRef.current.value.split('\n').filter((url) => url.trim());

    if (!isElectron) {
      if (!gatewayUrls.length) gatewayUrls = defaultGatewayUrls;
      if (!pubsubClientsOptions.length) pubsubClientsOptions = defaultPubsubHttpClientsOptions;
    } else {
      if (!gatewayUrls.length) gatewayUrls = undefined;
      if (!pubsubClientsOptions.length) pubsubClientsOptions = undefined;
    }

    if (!ipfsClientsOptions.length) {
      ipfsClientsOptions = undefined;
    }

    const invalidUrls = [
      ...(Array.isArray(gatewayUrls) ? gatewayUrls : Array.isArray(defaultGatewayUrls) ? defaultGatewayUrls : []),
      ...(Array.isArray(ipfsClientsOptions) ? ipfsClientsOptions : []),
      ...(Array.isArray(pubsubClientsOptions) ? pubsubClientsOptions : Array.isArray(defaultPubsubHttpClientsOptions) ? defaultPubsubHttpClientsOptions : []),
    ].filter((url) => !isValidURL(url));

    if (invalidUrls.length > 0) {
      setNewErrorMessage(`Invalid URL(s): ${invalidUrls.join(', ')}`);
      return;
    }

    const plebbitOptions = {
      ipfsGatewayUrls: gatewayUrls,
      ipfsHttpClientsOptions: ipfsClientsOptions,
      pubsubHttpClientsOptions: pubsubClientsOptions,
    };

    try {
      await setAccount({ ...account, plebbitOptions });
      localStorage.setItem('successToast', 'Settings saved successfully.');
      window.location.reload();
    } catch (error) {
      setNewErrorMessage(error.message);
      console.log(error);
    }
  };

  const handleSaveChainProviders = async () => {
    let ethereumRpcUrls = ethereumRpcRef.current.value.split('\\n').filter((url) => url.trim());
    let polygonRpcUrls = polygonRpcRef.current.value.split('\\n').filter((url) => url.trim());

    if (!ethereumRpcUrls.length) {
      ethereumRpcUrls = defaultEthereumRpcUrls;
    }

    if (!polygonRpcUrls.length) {
      polygonRpcUrls = defaultPolygonRpcUrls;
    }

    const invalidUrls = [...(ethereumRpcUrls || defaultEthereumRpcUrls), ...(polygonRpcUrls || defaultPolygonRpcUrls)].filter((url) => !isValidURL(url));

    if (invalidUrls.length > 0) {
      setNewErrorMessage(`Invalid URL(s): ${invalidUrls.join(', ')}`);
      return;
    }

    const chainProviders = {
      eth: {
        urls: ethereumRpcUrls,
        chainId: 1,
      },
      matic: {
        urls: polygonRpcUrls,
        chainId: 137,
      },
    };

    try {
      await setAccount({
        ...account,
        plebbitOptions: {
          ...account?.plebbitOptions,
          chainProviders,
        },
      });
      localStorage.setItem('successToast', 'Blockchain options saved successfully.');
      window.location.reload();
    } catch (error) {
      setNewErrorMessage(error.message);
      console.log(error);
    }
  };

  const handleResetPlebbitOptions = async () => {
    setNewErrorMessage(null);
    setNewSuccessMessage(null);

    gatewayRef.current.value = defaultGatewayUrls ? defaultGatewayUrls.join('\n') : '';
    ipfsRef.current.value = '';
    pubsubRef.current.value = defaultPubsubHttpClientsOptions ? defaultPubsubHttpClientsOptions.join('\n') : '';
    dataPathRef.current.value = '';

    try {
      await setAccount({
        ...account,
        plebbitOptions: {
          ipfsGatewayUrls: defaultGatewayUrls,
          ipfsHttpClientsOptions: undefined,
          pubsubHttpClientsOptions: defaultPubsubHttpClientsOptions,
        },
      });
      localStorage.setItem('successToast', 'Settings reset successfully.');
      window.location.reload();
    } catch (error) {
      setNewErrorMessage(error.message);
      console.log(error);
    }
  };

  const handleResetChainProviders = async () => {
    setNewErrorMessage(null);
    setNewSuccessMessage(null);

    ethereumRpcRef.current.value = defaultEthereumRpcUrls.join('\n');
    polygonRpcRef.current.value = defaultPolygonRpcUrls.join('\n');

    const chainProviders = {
      eth: {
        urls: defaultEthereumRpcUrls,
        chainId: 1,
      },
      matic: {
        urls: defaultPolygonRpcUrls,
        chainId: 137,
      },
    };

    try {
      await setAccount({
        ...account,
        plebbitOptions: {
          ...account?.plebbitOptions,
          chainProviders,
        },
      });
      localStorage.setItem('successToast', 'Blockchain options reset successfully.');
      window.location.reload();
    } catch (error) {
      setNewErrorMessage(error.message);
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    if (location.pathname.endsWith('/settings')) {
      const newPath = location.pathname.slice(0, -9);
      closeModal();
      navigate(newPath, { replace: true });
    } else {
      closeModal();
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
    if (expanded.length === 4) {
      setExpanded([]);
    } else {
      setExpanded([0, 1, 2, 3]);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('cacheCleared') === 'true') {
      setNewSuccessMessage('Cache cleared successfully.');
      localStorage.removeItem('cacheCleared');
    }
  }, [setNewSuccessMessage]);

  const handleSaveAccount = async () => {
    const data = importRef.current.value;
    const oldData = accountJson;
    try {
      const parsedJson = JSON.parse(data);
      const newAccount = parsedJson.account;
      await setAccount({ ...newAccount, id: account?.id });

      if (!oldData.account?.author?.address.endsWith('.eth') && parsedJson.account?.author?.address.endsWith('.eth') && anonymousMode === true) {
        setAnonymousMode(false);
        localStorage.setItem('successToast', 'Account data saved successfully. ENS address detected, Anon mode disabled.');
        window.location.reload();
      } else {
        setNewSuccessMessage('Account data saved successfully.');
      }
    } catch (error) {
      setNewErrorMessage('Error saving account data: ' + error.message);
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await deleteAccount(account?.name);
        localStorage.setItem('successToast', 'Account deleted successfully.');
        window.location.reload();
      } catch (error) {
        setNewErrorMessage('Error deleting account: ' + error.message);
        console.error(error);
      }
    }
  };

  const handleCreateAccount = async () => {
    try {
      await createAccount();
      setNewSuccessMessage('Account created successfully.');
      setTriggerSwitchAccount(true);
    } catch (error) {
      setNewErrorMessage('Error creating account: ' + error.message);
      console.error(error);
    }
    const lastAccount = accounts[accounts.length - 1];
    setActiveAccount(lastAccount.name);
  };

  useEffect(() => {
    if (triggerSwitchAccount) {
      const lastAccount = accounts[accounts.length - 1];
      setActiveAccount(lastAccount.name);
      setTriggerSwitchAccount(false);
    }
  }, [accounts, triggerSwitchAccount]);

  const handleAccountChange = (e) => {
    setActiveAccount(e.target.value);
  };

  const handleDisplayName = async () => {
    const name = nameRef.current.value;

    try {
      await setAccount({
        ...account,
        name: name || account?.name,
        author: {
          ...account?.author,
          displayName: name,
        },
      });
      setNewSuccessMessage('Account name saved successfully.');
    } catch (error) {
      setNewErrorMessage(error.message);
      console.log(error);
    }
  };

  const [switchToLastAccount, setSwitchToLastAccount] = useState(false);

  useEffect(() => {
    if (switchToLastAccount && accounts.length > 0) {
      const lastAccount = accounts[accounts.length - 1];
      setActiveAccount(lastAccount.name);
      setSwitchToLastAccount(false);
    }
  }, [accounts, switchToLastAccount]);

  const _importAccount = async () => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';

    // Handle file selection
    fileInput.onchange = async (event) => {
      try {
        const files = event.target.files;
        if (!files || files.length === 0) {
          throw new Error('No file selected.');
        }
        const file = files[0];

        // Read the file content
        const reader = new FileReader();
        reader.onload = async (e) => {
          const fileContent = e.target.result;
          if (typeof fileContent !== 'string') {
            throw new Error('File content is not a string.');
          }
          const newAccount = JSON.parse(fileContent);
          await importAccount(fileContent);
          setSwitchToLastAccount(true);
          alert(`Imported ${newAccount.account?.name}`);
        };
        reader.readAsText(file);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          console.log(error);
        } else {
          console.error('An unknown error occurred:', error);
        }
      }
    };

    // Trigger file selection dialog
    fileInput.click();
  };

  const _exportAccount = async () => {
    try {
      const accountString = await exportAccount();
      const accountObject = JSON.parse(accountString);
      const formattedAccountJson = JSON.stringify(accountObject, null, 2);

      // Create a Blob from the JSON string
      const blob = new Blob([formattedAccountJson], { type: 'application/json' });

      // Create a URL for the Blob
      const fileUrl = URL.createObjectURL(blob);

      // Create a temporary download link
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${account.name}.json`;

      // Append the link, trigger the download, then remove the link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Release the Blob URL
      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        console.log(error);
      } else {
        console.error('An unknown error occurred:', error);
      }
    }
  };

  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel='Settings'
      style={{ overlay: { backgroundColor: 'rgba(0,0,0,.25)' } }}
      selectedStyle={selectedStyle}
      expanded={expanded}
    >
      <div className='panel'>
        <div className='panel-header'>
          <span id='version'>
            v{version}
            {commitRef} -&nbsp;
            {window.electron && window.electron.isElectron ? (
              <Link className='all-button' id='node-stats' to='http://localhost:5001/webui/' target='_blank' rel='noreferrer'>
                full node
              </Link>
            ) : (
              <span>web</span>
            )}
          </span>
          Settings
          <Link to='' onClick={handleCloseModal}>
            <span className='icon' title='close' />
          </Link>
        </div>
        <div className='all-div'>
          [
          <button className='all-button' onClick={expandAll} style={{ all: 'unset', cursor: 'pointer' }}>
            {expanded.length === 4 ? 'Collapse All Settings' : 'Expand All Settings'}
          </button>
          ]
        </div>
        <ul>
          <li className='settings-cat-lbl'>
            <span className={`${expanded.includes(1) ? 'minus' : 'plus'}`} onClick={() => toggleExpanded(1)} />
            <span className='settings-pointer' style={{ cursor: 'pointer' }} onClick={() => toggleExpanded(1)}>
              Account
            </span>
          </li>
          <ul className='settings-cat' style={{ display: expanded.includes(1) ? 'block' : 'none' }}>
            <li className='anon-off'>
              <label title={!anonymousMode ? 'Enable anon mode' : 'Disable anon mode'}>
                <input
                  type='checkbox'
                  checked={anonymousMode}
                  onChange={() => {
                    setAnonymousMode(!anonymousMode);
                    window.location.reload();
                  }}
                />
                &nbsp;Anon Mode
              </label>
            </li>
            <li className='settings-tip anon-tip'>Use a newly generated u/address per thread to post.</li>
            <li className='settings-option disc'>Account Data</li>
            <li className='settings-tip'>Manually edit your account data using the preview below.</li>
            <div className='settings-input'>
              <textarea
                id='account-data-text'
                value={editedAccountJson || accountJson}
                ref={importRef}
                onChange={(e) => setEditedAccountJson(e.target.value)}
                autoComplete='off'
                autoCorrect='off'
                spellCheck='false'
              />
              <div className='account-buttons'>
                <button onClick={handleSaveAccount}>Save</button>
                <button onClick={() => setEditedAccountJson(accountJson)}>Reset</button>
              </div>
            </div>
            <div className='account-options'>
              <li className='settings-tip'>
                <button onClick={_exportAccount}>Export</button> your full account data
              </li>
              <li className='settings-tip'>
                <button onClick={_importAccount}>Import</button> full account data
              </li>
              <li className='settings-tip'>
                <button onClick={handleCreateAccount}>Create</button> a new account
              </li>
              <li className='settings-tip'>
                <button onClick={handleDeleteAccount}>Delete</button> this account
              </li>
            </div>
            <li className='settings-option disc'>Account Address: u/{account?.author.shortAddress}</li>
            <li className='settings-tip'>Select a different account to use in the dropdown below.</li>
            <li>
              <div className='settings-input'>
                <select className='settings-select' value={account?.name} onChange={handleAccountChange}>
                  {accounts.map((account) => (
                    <option key={account?.name} value={account?.name}>
                      {account?.name}
                    </option>
                  ))}
                </select>
                {account?.author.address.endsWith('.eth') ? null : (
                  <button style={{ marginLeft: '35px' }} className='save-button' id='save-name' onClick={handleCopyAddress}>
                    {copyStatus ? 'Copied!' : 'Copy Full Address'}
                  </button>
                )}
              </div>
            </li>
            <li className='settings-option disc'>Crypto Address</li>
            <li className='settings-tip'>
              {account?.author.address.endsWith('.eth')
                ? 'Your account address is already an ENS name.'
                : 'Change your account address to an ENS name you own: in your ENS name page on ens.domains, click on "Records", "Edit Records", "Add record", add "plebbit-author-address" as record name, add your full address as value (copy it with the button above) and save.'}
            </li>
            <div className='settings-input'>
              <input
                className='settings-input'
                style={{ marginLeft: '20px' }}
                placeholder='address.eth'
                ref={ensRef}
                value={ensName}
                onChange={handleENSChange}
                disabled={checkedENS}
              />
              <button className='save-button' id='save-name' onClick={handleENSSave}>
                Save
              </button>
              <button className='save-button check-button' id='save-name' onClick={handleENSCheck}>
                Check
              </button>
            </div>
            {checkedENS && ensName === account?.signer?.address && (
              <li className='settings-tip' style={{ marginTop: '10px', color: 'green' }}>
                {ensName} has been acquired by you correctly.
              </li>
            )}
            {checkedENS && ensName !== account?.signer?.address && (
              <li className='settings-tip' style={{ marginTop: '10px', color: 'red' }}>
                {ensName} has not been acquired by you yet.
              </li>
            )}
            <li className='settings-option disc'>Account Name</li>
            <li className='settings-tip'>
              Change both your account name (default "Account 1") and display name (default "Anonymous"). This will not change your address.
            </li>
            <li>
              <div className='settings-input'>
                <input
                  className='settings-input'
                  style={{ marginLeft: '20px' }}
                  type='text'
                  ref={nameRef}
                  defaultValue={account?.author.displayName}
                  placeholder='Anonymous'
                />
                <button className='save-button' id='save-name' onClick={handleDisplayName}>
                  Save
                </button>
              </div>
            </li>
          </ul>
        </ul>
        <ul>
          <li className='settings-cat-lbl'>
            <span className={`${expanded.includes(2) ? 'minus' : 'plus'}`} onClick={() => toggleExpanded(2)} />
            <span className='settings-pointer' style={{ cursor: 'pointer' }} onClick={() => toggleExpanded(2)}>
              IPFS Options
            </span>
            <div className='plebbit-options-buttons' style={{ display: expanded.includes(2) ? 'block' : 'none' }}>
              <button className='save-button' onClick={handleSavePlebbitOptions}>
                Save
              </button>
              <button className='reset-button' onClick={handleResetPlebbitOptions}>
                Reset
              </button>
            </div>
          </li>
          <ul className='settings-cat' style={{ display: expanded.includes(2) ? 'block' : 'none', marginTop: '-10px' }}>
            <li className='settings-option disc'>IPFS Gateway URLs</li>
            <li className='settings-tip'>Optional URLs of IPFS gateways.</li>
            <div className='settings-input'>
              <textarea placeholder='IPFS Gateway URLs' defaultValue={isElectron ? '' : account?.plebbitOptions?.ipfsGatewayUrls.join('\n')} ref={gatewayRef} />
            </div>
          </ul>
          <ul className='settings-cat' style={{ display: expanded.includes(2) ? 'block' : 'none' }}>
            <li className='settings-option disc'>IPFS HTTP Clients Options</li>
            <li className='settings-tip'>Optional URLs of IPFS APIs or IpfsHttpClientOptions, 'http://localhost:5001/api/v0' to use a local IPFS node.</li>
            <div className='settings-input'>
              <textarea
                placeholder='IPFS HTTP Clients Options'
                defaultValue={account?.plebbitOptions?.ipfsHttpClientsOptions ? account?.plebbitOptions?.ipfsHttpClientsOptions.join('\n') : ''}
                ref={ipfsRef}
              />
            </div>
          </ul>
          <ul className='settings-cat' style={{ display: expanded.includes(2) ? 'block' : 'none' }}>
            <li className='settings-option disc'>PubSub HTTP Clients Options</li>
            <li className='settings-tip'>
              Optional URLs or IpfsHttpClientOptions used for pubsub publishing when ipfsHttpClientOptions isn't available, like in the browser.
            </li>
            <div className='settings-input'>
              <textarea
                placeholder='PubSub HTTP Clients Options'
                defaultValue={isElectron ? '' : account?.plebbitOptions?.pubsubHttpClientsOptions.join('\n')}
                ref={pubsubRef}
              />
            </div>
          </ul>
          <ul className='settings-cat' style={{ display: expanded.includes(2) ? 'block' : 'none' }}>
            <li className='settings-option disc'>Data Path (Node Only)</li>
            <li className='settings-tip'>Optional folder path to create/resume the user and subplebbit databases.</li>
            <div className='settings-input'>
              <textarea placeholder='Data Path (Node Only)' ref={dataPathRef} />
            </div>
          </ul>
        </ul>
        <ul>
          <li className='settings-cat-lbl'>
            <span className={`${expanded.includes(3) ? 'minus' : 'plus'}`} onClick={() => toggleExpanded(3)} />
            <span className='settings-pointer' style={{ cursor: 'pointer' }} onClick={() => toggleExpanded(3)}>
              Blockchain Options
            </span>
            <div className='plebbit-options-buttons' style={{ display: expanded.includes(3) ? 'block' : 'none' }}>
              <button className='save-button' onClick={handleSaveChainProviders}>
                Save
              </button>
              <button className='save-button' onClick={handleResetChainProviders}>
                Reset
              </button>
            </div>
          </li>
          <ul className='settings-cat' style={{ display: expanded.includes(3) ? 'block' : 'none', marginTop: '-10px' }}>
            <li className='settings-option disc'>Ethereum RPC</li>
            <li className='settings-tip'>Needed for .eth addresses.</li>
            <div className='settings-input'>
              <textarea placeholder='Ethereum RPC URLs' defaultValue={account?.plebbitOptions?.chainProviders?.['eth']?.urls.join('\n')} ref={ethereumRpcRef} />
            </div>
            <li className='settings-option disc'>Polygon RPC</li>
            <li className='settings-tip'>Needed for XPLEB NFTs.</li>
            <div className='settings-input'>
              <textarea placeholder='Polygon RPC URLs' defaultValue={account?.plebbitOptions?.chainProviders?.['matic']?.urls.join('\n')} ref={polygonRpcRef} />
            </div>
          </ul>
        </ul>
        <div>
          <button
            className='cache-button'
            onClick={async () => {
              if (window.confirm('Are you sure you want to clear the cache?')) {
                await deleteCaches();
                localStorage.setItem('cacheCleared', 'true');
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
};

Modal.setAppElement('#root');

export default SettingsModal;
