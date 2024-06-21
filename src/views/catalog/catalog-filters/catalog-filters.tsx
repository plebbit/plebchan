import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isAllView, isCatalogView } from '../../../lib/utils/view-utils';
import useCatalogFiltersStore from '../../../stores/use-catalog-filters-store';
import styles from './catalog-filters.module.css';

const FiltersModal = ({ closeModal }: { closeModal: () => void }) => {
  const { t } = useTranslation();
  const { showAdultBoards, setShowAdultBoards, showGoreBoards, setShowGoreBoards, showTextOnlyThreads, setShowTextOnlyThreads } = useCatalogFiltersStore();
  const location = useLocation();
  const params = useParams();
  const isInCatalogView = isCatalogView(location.pathname, params);
  const isInAllView = isAllView(location.pathname, params);

  return (
    <>
      <div className={styles.overlay} onClick={closeModal} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.title}>{t('filters')}</span>
          <span className={styles.closeButton} title='close' onClick={closeModal} />
        </div>
        <div className={styles.filters}>
          {isInCatalogView && (
            <label className={styles.paddingBottom}>
              <input type='checkbox' checked={!showTextOnlyThreads} onChange={(e) => setShowTextOnlyThreads(!e.target.checked)} />
              Hide Threads Without Media
            </label>
          )}
          {isInAllView && (
            <div className={styles.nsfwLabels}>
              <div className={styles.categoryTitle}>NSFW Boards</div>
              <label>
                <input type='checkbox' checked={!showGoreBoards} onChange={(e) => setShowGoreBoards(!e.target.checked)} />
                Hide Gore Boards
              </label>
              <label>
                <input type='checkbox' checked={!showAdultBoards} onChange={(e) => setShowAdultBoards(!e.target.checked)} />
                Hide Adult Boards
              </label>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const CatalogFilters = () => {
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <span className='button' onClick={() => setShowModal(true)}>
        Filters
      </span>
      {showModal && <FiltersModal closeModal={closeModal} />}
    </>
  );
};

export default CatalogFilters;
