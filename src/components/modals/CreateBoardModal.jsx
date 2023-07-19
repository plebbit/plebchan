import React, { useRef, useState } from 'react';
import { StyledModal } from '../styled/modals/CreateBoardModal.styled';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import Modal from 'react-modal';
import useError from '../../hooks/useError';

const CreateBoardModal = ({ isOpen, closeModal }) => {
  const { selectedStyle } = useGeneralStore(state => state);

  const nodeRef = useRef(null);

  const [boardTitle, setBoardTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rule, setRule] = useState('');
  const [rules, setRules] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  const [, setNewErrorMessage] = useError();


  const handleAddRule = () => {
    if (rule.trim() === '') {
      setNewErrorMessage('Rule field is empty');
      return;
    }

    if (rules.length >= 15) {
      setNewErrorMessage('Maximum number of rules is 15');
      return;
    }

    if(editIndex > -1){
      setRules(rules.map((r, i) => i === editIndex ? rule : r));
      setEditIndex(-1);
    } else {
      setRules([...rules, rule]);
    }
    setRule('');
  }


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddRule();
    }
  }


  const handleEditRule = (index) => {
    setRule(rules[index]);
    setEditIndex(index);
  }


  const handleDeleteRule = (index) => {
    if (index === editIndex) {
      setEditIndex(-1);
    }
    setRules(rules.filter((_, i) => i !== index));
  }
  


  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Create Board"
      selectedStyle={selectedStyle}
      style={{ overlay: { backgroundColor: "rgba(0,0,0,.25)" }}}
    >
      <div className="modal-content" ref={nodeRef}>
        <div className="modal-header">
          Create Board
          <button className="icon" onClick={() => closeModal()} title="close" />
        </div>
        <ul id="form">
          <div id="explaination">NOTE: plebbit is P2P, your board will stay online for as long as you leave the plebchan desktop app (full node) connected to the Internet.</div>
          <li className='settings-option disc'>
            Title
          </li>
          <div className='settings-tip'>
            Optional, useful to describe the board next to its p/address.
          </div>
          <div className='settings-input'>
            <input
              id="name"
              type="text"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              placeholder="Add a title"
            />
          </div>
          <li className='settings-option disc'>
            Description
          </li>
          <div className='settings-tip'>
            Optional, displayed as sticky with the board's avatar if set.
          </div>
          <div className='settings-input'>
            <textarea
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description"
            />
          </div>
          <li className='settings-option disc'>
            Rules
          </li>
          <div className='settings-tip'>
            Optional, listed in a sticky on top. Maximum 15 rules.
          </div>
          <div className='settings-input'>
            <input
              id="rule"
              type="text"
              value={rule}
              onChange={(e) => setRule(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a rule"
            />
          </div>
          <fieldset>
            <legend>
              <button id="rule-btn" onClick={handleAddRule}>{editIndex > -1 ? "Update Rule" : "Add Rule"}</button>
            </legend>
            {rules.map((rule, index) => (
              <div key={index} className="rule-item">
                <p>{index+1}. {rule}</p>
                <button onClick={() => handleEditRule(index)}>Edit</button>
                <button onClick={() => handleDeleteRule(index)}>Delete</button>
              </div>
            ))}
          </fieldset>
          <button id="create-board-btn">Create Board</button>
        </ul>
      </div>
    </StyledModal>
  );
};

Modal.setAppElement('#root');

export default CreateBoardModal;
