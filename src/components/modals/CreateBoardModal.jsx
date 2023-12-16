import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useAccount,
  useCreateSubplebbit,
  // useSubplebbits, useAccountSubplebbits
} from '@plebbit/plebbit-react-hooks';
import { StyledModal } from '../styled/modals/CreateBoardModal.styled';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import Modal from 'react-modal';
import useError from '../../hooks/useError';
import useSuccess from '../../hooks/useSuccess';

const CreateBoardModal = ({ isOpen, closeModal }) => {
  const { selectedStyle } = useGeneralStore((state) => state);

  const account = useAccount();
  const navigate = useNavigate();

  const nodeRef = useRef(null);
  const ruleInputRef = useRef(null);

  const [, setNewErrorMessage] = useError();
  const [, setNewSuccessMessage] = useSuccess();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState('');
  const [moderators, setModerators] = useState('');
  const [rule, setRule] = useState('');
  const [rules, setRules] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  const handleAddRule = () => {
    if (rule.trim() === '') {
      setNewErrorMessage('Rule field is empty');
      return;
    }

    if (rules.length >= 15) {
      setNewErrorMessage('Maximum number of rules is 15');
      return;
    }

    if (editIndex > -1) {
      setRules(rules.map((r, i) => (i === editIndex ? rule : r)));
      setEditIndex(-1);
    } else {
      setRules([...rules, rule]);
    }
    setRule('');
  };

  useEffect(() => {
    if (ruleInputRef.current) {
      ruleInputRef.current.focus();
    }
  }, [rules]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddRule();
    }
  };

  const handleEditRule = (index) => {
    setRule(rules[index]);
    setEditIndex(index);
    ruleInputRef.current.focus();
  };

  const handleDeleteRule = (index) => {
    if (index === editIndex) {
      setEditIndex(-1);
    }
    setRules(rules.filter((_, i) => i !== index));
  };

  const createSubplebbitOptions = {
    title: title || undefined,
    description: description || undefined,
    suggested: {
      avatarUrl: avatar || undefined,
    },
    roles: moderators || undefined,
    rules: rules || undefined,
  };

  const resetFields = () => {
    setTitle('');
    setDescription('');
    setAvatar('');
    setModerators('');
    setRule('');
    setRules([]);
  };

  const { createdSubplebbit, createSubplebbit } = useCreateSubplebbit(createSubplebbitOptions);

  const handleCreateBoard = async () => {
    let moderatorAddresses = moderators.trim() ? moderators.split(',').map((addr) => addr.trim()) : [];
    let invalidAddresses = moderatorAddresses.filter((addr) => !(addr.endsWith('.eth') || (addr.startsWith('12D3KooW') && addr.length === 52)));

    if (invalidAddresses.length > 0) {
      setNewErrorMessage('Invalid moderator addresses: ' + invalidAddresses.join(', '));
      return;
    }

    const roles = {};
    moderatorAddresses.forEach((addr) => {
      roles[addr] = { role: 'moderator' };
    });
    roles[account.author.address] = { role: 'admin' };

    let createSubplebbitOptions = {
      roles: roles,
    };

    if (title) {
      createSubplebbitOptions.title = title;
    }

    if (description) {
      createSubplebbitOptions.description = description;
    }

    if (avatar) {
      createSubplebbitOptions.suggested = {
        avatarUrl: avatar,
      };
    }

    if (rules.length > 0) {
      createSubplebbitOptions.rules = rules;
    }

    try {
      await createSubplebbit(createSubplebbitOptions);
    } catch (error) {
      setNewErrorMessage(error.message);
    }

    if (createdSubplebbit) {
      resetFields();
      closeModal();
      setNewSuccessMessage('Board created successfully, address: ' + createdSubplebbit.address);
      navigate(`/p/${createdSubplebbit.address}`);
    }
  };

  // remove after testing:
  // const {accountSubplebbits} = useAccountSubplebbits()
  // const ownerSubplebbitAddresses = Object.keys(accountSubplebbits).map(subplebbitAddress => accountSubplebbits[subplebbitAddress].role === 'owner')
  // const subplebbits = useSubplebbits({subplebbitAddresses: ownerSubplebbitAddresses})
  // console.log(subplebbits);

  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel='Create Board'
      selectedStyle={selectedStyle}
      style={{ overlay: { backgroundColor: 'rgba(0,0,0,.25)' } }}
    >
      <div className='modal-content' ref={nodeRef}>
        <div className='modal-header'>
          Create Board
          <button className='icon' onClick={() => closeModal()} title='close' />
        </div>
        <ul id='form'>
          <div id='explaination'>
            NOTE: plebbit is P2P, your board will stay online for as long as you leave the plebchan desktop app (full node) connected to the Internet.
          </div>
          <li className='settings-option disc'>Title</li>
          <div className='settings-tip'>Optional, useful to describe the board next to its p/address.</div>
          <div className='settings-input'>
            <input id='name' type='text' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Board Title' />
          </div>
          <li className='settings-option disc'>Description</li>
          <div className='settings-tip'>Optional, displayed as sticky with the board's avatar if set.</div>
          <div className='settings-input'>
            <textarea id='description' type='text' value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Add a description' />
          </div>
          <li className='settings-option disc'>Avatar</li>
          <div className='settings-tip'>Optional, set an image that represents your board.</div>
          <div className='settings-input'>
            <input id='name' type='text' value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder='https://example.com/image.png' />
          </div>
          <li className='settings-option disc'>Moderators</li>
          <div className='settings-tip'>Optional, let other users help you moderate your board.</div>
          <div className='settings-input'>
            <textarea id='name' type='text' value={moderators} onChange={(e) => setModerators(e.target.value)} placeholder='username.eth, 12D3KooW..., username2.eth' />
          </div>
          <li className='settings-option disc'>Rules</li>
          <div className='settings-tip'>Optional, listed in a sticky on top. Maximum 15 rules.</div>
          <div className='settings-input'>
            <input ref={ruleInputRef} id='rule' type='text' value={rule} onChange={(e) => setRule(e.target.value)} onKeyDown={handleKeyDown} placeholder='Add a rule' />
          </div>
          <button style={{ display: rules.length > 0 ? 'none' : 'block' }} id='rule-btn' className={rules.length > 0 ? 'relative' : ''} onClick={handleAddRule}>
            {editIndex > -1 ? 'Update Rule' : 'Add Rule'}
          </button>
          {rules.length > 0 && (
            <fieldset>
              <legend>
                <button className={rules.length > 0 ? 'relative' : ''} onClick={handleAddRule}>
                  {editIndex > -1 ? 'Update Rule' : 'Add Rule'}
                </button>
              </legend>
              {rules.map((rule, index) => (
                <div key={index} className='rule-item'>
                  <p>
                    {index + 1}. {rule}
                  </p>
                  <button onClick={() => handleEditRule(index)}>Edit</button>
                  <button onClick={() => handleDeleteRule(index)}>Delete</button>
                </div>
              ))}
            </fieldset>
          )}
          <button onClick={handleCreateBoard} id='create-board-btn'>
            Create Board
          </button>
        </ul>
      </div>
    </StyledModal>
  );
};

Modal.setAppElement('#root');

export default CreateBoardModal;
