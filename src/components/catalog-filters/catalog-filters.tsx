import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useCatalogFiltersStore from '../../stores/use-catalog-filters-store';
import useFeedResetStore from '../../stores/use-feed-reset-store';
import styles from './catalog-filters.module.css';

const FiltersTable = ({ onSave }: { onSave: () => void }) => {
  const { t } = useTranslation();
  const { filterItems, saveAndApplyFilters, currentSubplebbitAddress } = useCatalogFiltersStore();
  const resetFeed = useFeedResetStore((state) => state.reset);

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
          subplebbitCounts: new Map<string, number>(),
          subplebbitFilteredCids: new Map<string, Set<string>>(),
          hide: true,
          top: false,
        },
      ];
    });
  }, []);

  const handleSave = useCallback(() => {
    const nonEmptyFilters = localFilterItems.filter((item) => item.text.trim() !== '');

    saveAndApplyFilters(nonEmptyFilters);

    useCatalogFiltersStore.getState().resetCountsForCurrentSubplebbit();

    if (resetFeed) {
      resetFeed();
    }

    onSave();
  }, [saveAndApplyFilters, localFilterItems, onSave, resetFeed]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSave();
      }
    },
    [handleSave],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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
            <td className={styles.filterHits}>
              {currentSubplebbitAddress && item.subplebbitFilteredCids?.has(currentSubplebbitAddress) && `x${item.subplebbitCounts?.get(currentSubplebbitAddress) ?? 0}`}
            </td>
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

const FiltersProtip = () => {
  return (
    <div className={styles.filtersProtip}>
      <h4>Patterns</h4>
      <ul>
        <li>
          <strong>Matching whole words:</strong>
        </li>
        <li>
          <code>feel</code> — will match <em>"feel"</em> but not <em>"feeling"</em>. This search is case-insensitive.
        </li>
      </ul>
      <ul>
        <li>
          <strong>AND operator:</strong>
        </li>
        <li>
          <code>feel girlfriend</code> — will match <em>"feel"</em> AND <em>"girlfriend"</em> in any order.
        </li>
      </ul>
      <ul>
        <li>
          <strong>OR operator:</strong>
        </li>
        <li>
          <code>feel|girlfriend</code> — will match <em>"feel"</em> OR <em>"girlfriend"</em>.
        </li>
      </ul>
      <ul>
        <li>
          <strong>Mixing both operators:</strong>
        </li>
        <li>
          <code>girlfriend|boyfriend feel</code> — matches <em>"feel"</em> AND <em>"girlfriend"</em>, or <em>"feel"</em> AND <em>"boyfriend"</em>.
        </li>
      </ul>
      <ul>
        <li>
          <strong>Exact match search:</strong>
        </li>
        <li>
          <code>"that feel when"</code> — place double quotes around the pattern to search for an exact string.
        </li>
      </ul>
      <ul>
        <li>
          <strong>Wildcards:</strong>
        </li>
        <li>
          <code>feel*</code> — matches expressions such as <em>"feel"</em>, <em>"feels"</em>, <em>"feeling"</em>, <em>"feeler"</em>, etc…
        </li>
        <li>
          <code>idolm*ster</code> — this can match <em>"idolmaster"</em> or <em>"idolm@ster"</em>, etc…
        </li>
      </ul>
      <ul>
        <strong>It is also possible to filter by regular expression:</strong>
        <li>
          <code>/^(?=.*detachable)(?=.*hats).*$/i</code> — AND operator.
        </li>
        <li>
          <code>/^(?!.*touhou).*$/i</code> — NOT operator.
        </li>
        <li>
          <code>{'/^&gt;/'}</code> — threads starting with a quote (<em>{'">"'}</em> character as an html entity).
        </li>
        <li>
          <code>/^$/</code> — threads with no text.
        </li>
      </ul>
      <h4>Controls</h4>
      <ul>
        <li>
          <strong>On</strong> — enables or disables the filter.
        </li>
        <li>
          <strong>Hide</strong> — hides matched threads.
        </li>
        <li>
          <strong>Top</strong> — moves the filter to the top of the feed.
        </li>
      </ul>
    </div>
  );
};

const FiltersModal = ({ closeModal }: { closeModal: () => void }) => {
  const { t } = useTranslation();
  const [showHelp, setShowHelp] = useState(false);
  const openHelp = () => setShowHelp(true);
  const closeHelp = () => setShowHelp(false);
  return (
    <>
      <div className={styles.overlay} onClick={showHelp ? closeHelp : closeModal} />
      <div className={`${styles.modal} ${showHelp ? styles.filtersProtipModal : ''}`}>
        <div className={styles.header}>
          <span className={styles.title}>{showHelp ? t('filter_and_highlights_help') : t('filter_and_highlights')}</span>
          {!showHelp && <span className={styles.openHelpButton} title={t('help')} onClick={openHelp} />}
          <span className={styles.closeButton} title={t('close')} onClick={closeModal} />
        </div>
        {showHelp ? <FiltersProtip /> : <FiltersTable onSave={closeModal} />}
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
