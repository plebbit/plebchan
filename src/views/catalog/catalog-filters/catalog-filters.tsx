import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isAllView, isCatalogView } from '../../../lib/utils/view-utils';
import useCatalogFiltersStore from '../../../stores/use-catalog-filters-store';
import styles from './catalog-filters.module.css';

const FiltersTable = () => {
  const { t } = useTranslation();
  const { filterText, setFilterText } = useCatalogFiltersStore();
  const [localFilterText, setLocalFilterText] = useState(filterText);

  return (
    <table className={styles.filtersTable}>
      <thead>
        <tr>
          <th>Order</th>
          <th>On</th>
          <th>Pattern</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <span className={styles.orderButton}>↑</span>
          </td>
          <td>
            <input type='checkbox' className={styles.onCheckbox} />
          </td>
          <td>
            <input type='text' onChange={(e) => setLocalFilterText(e.target.value)} value={localFilterText} />
          </td>
          <td>
            <span className={styles.deleteButton}>×</span>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={9}>
            <button className={styles.addButton}>Add</button>
            <button className={styles.saveButton}>Save</button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

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
            <div>
              <label className='capitalize'>
                <input type='checkbox' checked={!showTextOnlyThreads} onChange={(e) => setShowTextOnlyThreads(!e.target.checked)} />
                {t('hide_threads_without_images')}
              </label>
            </div>
          )}
          {isInAllView && (
            <div className={styles.nsfwLabels}>
              <div>
                <label>
                  <input type='checkbox' checked={!showGoreBoards} onChange={(e) => setShowGoreBoards(!e.target.checked)} />
                  hide gore content
                </label>
              </div>
              <div>
                <label>
                  <input type='checkbox' checked={!showAdultBoards} onChange={(e) => setShowAdultBoards(!e.target.checked)} />
                  hide adult content
                </label>
              </div>
            </div>
          )}
          <FiltersTable />
        </div>
      </div>
    </>
  );
};

const CatalogFilters = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <span className={`${styles.filtersButton} button`} onClick={() => setShowModal(true)}>
        {t('filters')}
      </span>
      {showModal && <FiltersModal closeModal={closeModal} />}
    </>
  );
};

export default CatalogFilters;
