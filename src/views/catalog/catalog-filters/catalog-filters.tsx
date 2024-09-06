import { useState, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isAllView, isCatalogView } from '../../../lib/utils/view-utils';
import useCatalogFiltersStore from '../../../stores/use-catalog-filters-store';
import styles from './catalog-filters.module.css';

const FiltersTable = () => {
  const { t } = useTranslation();
  const { filterItems, saveAndApplyFilters } = useCatalogFiltersStore();

  const [localFilterItems, setLocalFilterItems] = useState(filterItems);

  const handleAddFilter = useCallback(() => {
    setLocalFilterItems((prev) => [...prev, { text: '', enabled: true }]);
  }, []);

  const handleSave = useCallback(() => {
    const nonEmptyFilters = localFilterItems.filter((item) => item.text.trim() !== '');
    saveAndApplyFilters(nonEmptyFilters);
  }, [saveAndApplyFilters, localFilterItems]);

  const updateLocalFilterItem = useCallback((index: number, item: any) => {
    setLocalFilterItems((prev) => prev.map((f, i) => (i === index ? item : f)));
  }, []);

  const removeLocalFilterItem = useCallback((index: number) => {
    setLocalFilterItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const moveLocalFilterItemUp = useCallback((index: number) => {
    if (index === 0) return;
    setLocalFilterItems((prev) => {
      const newItems = [...prev];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      return newItems;
    });
  }, []);

  return (
    <table className={styles.filtersTable}>
      <thead>
        <tr>
          <th>{t('order')}</th>
          <th>{t('enable')}</th>
          <th>{t('text')}</th>
          <th>{t('delete')}</th>
        </tr>
      </thead>
      <tbody>
        {localFilterItems.map((item, index) => (
          <tr key={index}>
            <td>
              <span className={styles.orderButton} onClick={() => moveLocalFilterItemUp(index)}>
                ↑
              </span>
            </td>
            <td>
              <input
                type='checkbox'
                className={styles.onCheckbox}
                checked={item.enabled}
                onChange={(e) => updateLocalFilterItem(index, { ...item, enabled: e.target.checked })}
              />
            </td>
            <td>
              <input
                type='text'
                autoCorrect='off'
                autoComplete='off'
                spellCheck='false'
                value={item.text}
                onChange={(e) => updateLocalFilterItem(index, { ...item, text: e.target.value })}
              />
            </td>
            <td>
              <span className={styles.deleteButton} onClick={() => removeLocalFilterItem(index)}>
                ×
              </span>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={4}>
            <button className={styles.addButton} onClick={handleAddFilter}>
              {t('add')}
            </button>
            <button className={styles.saveButton} onClick={handleSave}>
              {t('save')}
            </button>
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
        </div>
        {isInCatalogView && <FiltersTable />}
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
