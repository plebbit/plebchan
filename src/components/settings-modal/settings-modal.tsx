import styles from './settings-modal.module.css';
import { useNavigate } from 'react-router-dom';

const SettingsModal = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.settingsModal}>
      <div className={styles.header}>
        <span className={styles.version}>v0.2.0</span>
        Settings
        <span className={styles.closeButton} title='close' onClick={() => navigate(-1)} />
      </div>
    </div>
  );
};

export default SettingsModal;
