import { useState, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isAllView, isCatalogView } from '../../../lib/utils/view-utils';
import useCatalogFiltersStore from '../../../stores/use-catalog-filters-store';
import styles from './catalog-filters.module.css';

const FiltersTable = ({
  localFilterItems,
  setLocalFilterItems,
  onSave,
}: {
  localFilterItems: any[];
  setLocalFilterItems: React.Dispatch<React.SetStateAction<any[]>>;
  onSave: () => void;
}) => {
  const { t } = useTranslation();
  const { saveAndApplyFilters } = useCatalogFiltersStore();

  const handleAddFilter = useCallback(() => {
    setLocalFilterItems((prev) => [...prev, { text: '', enabled: true }]);
  }, [setLocalFilterItems]);

  const handleSave = useCallback(() => {
    const nonEmptyFilters = localFilterItems.filter((item) => item.text.trim() !== '');
    saveAndApplyFilters(nonEmptyFilters);
    onSave();
  }, [saveAndApplyFilters, localFilterItems, onSave]);

  const updateLocalFilterItem = useCallback(
    (index: number, item: any) => {
      setLocalFilterItems((prev) => prev.map((f, i) => (i === index ? item : f)));
    },
    [setLocalFilterItems],
  );

  const removeLocalFilterItem = useCallback(
    (index: number) => {
      setLocalFilterItems((prev) => prev.filter((_, i) => i !== index));
    },
    [setLocalFilterItems],
  );

  const moveLocalFilterItemUp = useCallback(
    (index: number) => {
      if (index === 0) return;
      setLocalFilterItems((prev) => {
        const newItems = [...prev];
        [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
        return newItems;
      });
    },
    [setLocalFilterItems],
  );

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
  const { showAdultBoards, setShowAdultBoards, showGoreBoards, setShowGoreBoards, showTextOnlyThreads, setShowTextOnlyThreads, filterItems, saveAndApplyFilters } =
    useCatalogFiltersStore();

  const [localShowAdultBoards, setLocalShowAdultBoards] = useState(showAdultBoards);
  const [localShowGoreBoards, setLocalShowGoreBoards] = useState(showGoreBoards);
  const [localShowTextOnlyThreads, setLocalShowTextOnlyThreads] = useState(showTextOnlyThreads);
  const [localFilterItems, setLocalFilterItems] = useState(filterItems);

  const location = useLocation();
  const params = useParams();
  const isInCatalogView = isCatalogView(location.pathname, params);
  const isInAllView = isAllView(location.pathname, params);

  const handleSave = useCallback(() => {
    setShowAdultBoards(localShowAdultBoards);
    setShowGoreBoards(localShowGoreBoards);
    setShowTextOnlyThreads(localShowTextOnlyThreads);
    const nonEmptyFilters = localFilterItems.filter((item) => item.text.trim() !== '');
    saveAndApplyFilters(nonEmptyFilters);
    closeModal();
  }, [
    localShowAdultBoards,
    localShowGoreBoards,
    localShowTextOnlyThreads,
    localFilterItems,
    setShowAdultBoards,
    setShowGoreBoards,
    setShowTextOnlyThreads,
    saveAndApplyFilters,
    closeModal,
  ]);

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
                <input type='checkbox' checked={!localShowTextOnlyThreads} onChange={(e) => setLocalShowTextOnlyThreads(!e.target.checked)} />
                {t('hide_threads_without_images')}
              </label>
            </div>
          )}
          {isInAllView && (
            <div className={styles.nsfwLabels}>
              <div>
                <label>
                  <input type='checkbox' checked={!localShowGoreBoards} onChange={(e) => setLocalShowGoreBoards(!e.target.checked)} />
                  hide gore content
                </label>
              </div>
              <div>
                <label>
                  <input type='checkbox' checked={!localShowAdultBoards} onChange={(e) => setLocalShowAdultBoards(!e.target.checked)} />
                  hide adult content
                </label>
              </div>
            </div>
          )}
        </div>
        {isInCatalogView && <FiltersTable localFilterItems={localFilterItems} setLocalFilterItems={setLocalFilterItems} onSave={handleSave} />}
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
