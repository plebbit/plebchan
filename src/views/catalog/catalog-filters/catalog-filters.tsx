import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useCatalogFiltersStore from '../../../stores/use-catalog-filters-store';
import styles from './catalog-filters.module.css';

const FiltersTable = ({ onSave }: { onSave: () => void }) => {
  const { t } = useTranslation();
  const { filterItems, saveAndApplyFilters } = useCatalogFiltersStore();

  const [localFilterItems, setLocalFilterItems] = useState(
    filterItems.map((item) => ({
      ...item,
      hide: item.hide ?? true,
      top: item.top ?? false,
    })),
  );

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update local items when store changes
  useEffect(() => {
    setLocalFilterItems(
      filterItems.map((item) => ({
        ...item,
        hide: item.hide ?? true,
        top: item.top ?? false,
      })),
    );
  }, [filterItems]);

  const handleAddFilter = useCallback(() => {
    setLocalFilterItems((prev) => {
      const newIndex = prev.length;
      setTimeout(() => {
        inputRefs.current[newIndex]?.focus();
      }, 0);
      return [
        ...prev,
        {
          text: '',
          enabled: true,
          count: 0,
          filteredCids: new Set<string>(),
          hide: true,
          top: false,
        },
      ];
    });
  }, []);

  const handleSave = useCallback(() => {
    const nonEmptyFilters = localFilterItems.filter((item) => item.text.trim() !== '');
    saveAndApplyFilters(nonEmptyFilters);
    onSave();
  }, [saveAndApplyFilters, localFilterItems, onSave]);

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
          <th>order</th>
          <th>on</th>
          <th>pattern</th>
          <th>color</th>
          <th>hide</th>
          <th>top</th>
          <th>del</th>
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
                ref={(el) => (inputRefs.current[index] = el)}
              />
            </td>
            <td>
              <span className={styles.clickbox} />
            </td>
            <td>
              <input type='checkbox' checked={item.hide} onChange={(e) => updateLocalFilterItem(index, { ...item, hide: e.target.checked })} />
            </td>
            <td>
              <input type='checkbox' checked={item.top} onChange={(e) => updateLocalFilterItem(index, { ...item, top: e.target.checked })} />
            </td>
            <td>
              <span className={styles.deleteButton} onClick={() => removeLocalFilterItem(index)}>
                ×
              </span>
            </td>
            <td className={styles.filterHits}>{item.count > 0 && `x${item.count}`}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={7}>
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

  return (
    <>
      <div className={styles.overlay} onClick={closeModal} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.title}>{t('filters_and_highlights')}</span>
          <span className={styles.closeButton} title='close' onClick={closeModal} />
        </div>
        <FiltersTable onSave={closeModal} />
      </div>
    </>
  );
};

const CatalogFilters = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  useEffect(() => {
    const onEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    document.addEventListener('keydown', onEscapeKey);
    return () => document.removeEventListener('keydown', onEscapeKey);
  }, [closeModal]);

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
