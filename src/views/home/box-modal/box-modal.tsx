import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useHomeFiltersStore from '../../../stores/use-home-filters-store';
import styles from '../home.module.css';

const BoxModal = ({ isBoardsBoxModal }: { isBoardsBoxModal: boolean }) => {
  const { t } = useTranslation();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLSpanElement>(null);

  const {
    showNsfwBoardsOnly,
    setShowNsfwBoardsOnly,
    showWorksafeBoardsOnly,
    setShowWorksafeBoardsOnly,
    useCatalog,
    setUseCatalog,
    showWorksafeContentOnly,
    setShowWorksafeContentOnly,
    showNsfwContentOnly,
    setShowNsfwContentOnly,
  } = useHomeFiltersStore();

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowFilterModal(false);
      }
    },
    [modalRef, buttonRef, setShowFilterModal],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <>
      <span ref={buttonRef} onClick={() => !showFilterModal && setShowFilterModal(true)}>
        {isBoardsBoxModal ? t('filter') : t('options')} ▼
      </span>
      {showFilterModal && (
        <div ref={modalRef} className={styles.filterModal}>
          {isBoardsBoxModal ? (
            <>
              <div
                className={`${styles.option} ${!showNsfwBoardsOnly && !showWorksafeBoardsOnly && styles.selected}`}
                onClick={() => {
                  setShowNsfwBoardsOnly(false);
                  setShowWorksafeBoardsOnly(false);
                  setShowFilterModal(false);
                }}
              >
                {t('show_all_boards')}
              </div>
              <div
                className={`${styles.option} ${showNsfwBoardsOnly && styles.selected}`}
                onClick={() => {
                  if (showWorksafeBoardsOnly) {
                    setShowWorksafeBoardsOnly(false);
                  }
                  setShowNsfwBoardsOnly(!showNsfwBoardsOnly);
                  setShowFilterModal(false);
                }}
              >
                {t('show_nsfw_boards_only')}
              </div>
              <div
                className={`${styles.option} ${showWorksafeBoardsOnly && styles.selected}`}
                onClick={() => {
                  if (showNsfwBoardsOnly) {
                    setShowNsfwBoardsOnly(false);
                  }
                  setShowWorksafeBoardsOnly(!showWorksafeBoardsOnly);
                  setShowFilterModal(false);
                }}
              >
                {t('show_worksafe_boards_only')}
              </div>
              <div className={styles.separator} />
              <div
                className={`${styles.option} ${useCatalog && styles.selected}`}
                onClick={() => {
                  setUseCatalog(!useCatalog);
                  setShowFilterModal(false);
                }}
              >
                {t('use_catalog')}
              </div>
            </>
          ) : (
            <>
              <div
                className={`${styles.option} ${showWorksafeContentOnly && styles.selected}`}
                onClick={() => {
                  if (showNsfwContentOnly) {
                    setShowNsfwContentOnly(false);
                  }
                  setShowWorksafeContentOnly(!showWorksafeContentOnly);
                  setShowFilterModal(false);
                }}
              >
                {t('show_worksafe_content_only')}
              </div>
              <div
                className={`${styles.option} ${showNsfwContentOnly && styles.selected}`}
                onClick={() => {
                  if (showWorksafeContentOnly) {
                    setShowWorksafeContentOnly(false);
                  }
                  setShowNsfwContentOnly(!showNsfwContentOnly);
                  setShowFilterModal(false);
                }}
              >
                {t('show_nsfw_content_only')}
              </div>
              <div
                className={`${styles.option} ${!showWorksafeContentOnly && !showNsfwContentOnly && styles.selected}`}
                onClick={() => {
                  setShowWorksafeContentOnly(false);
                  setShowNsfwContentOnly(false);
                  setShowFilterModal(false);
                }}
              >
                {t('show_all_content')}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default BoxModal;
