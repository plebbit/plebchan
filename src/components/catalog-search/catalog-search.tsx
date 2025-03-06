import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './catalog-search.module.css';
import useIsMobile from '../../hooks/use-is-mobile';
import useCatalogFiltersStore from '../../stores/use-catalog-filters-store';
import _ from 'lodash';

const CatalogSearch = () => {
  const { t } = useTranslation();
  const [openSearch, setOpenSearch] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { setSearchFilter, clearSearchFilter } = useCatalogFiltersStore();

  // Create a debounced version of setSearchFilter
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearchFilter = useCallback(
    _.debounce((text: string) => {
      if (text.trim()) {
        setSearchFilter(text);
      } else {
        clearSearchFilter();
      }
    }, 300),
    [setSearchFilter, clearSearchFilter],
  );

  const handleToggleSearch = useCallback(() => {
    setOpenSearch((prev) => !prev);

    if (openSearch) {
      setInputValue('');
      clearSearchFilter();
    }
  }, [openSearch, clearSearchFilter]);

  const handleCloseSearch = useCallback(() => {
    setOpenSearch(false);
    setInputValue('');
    clearSearchFilter();
  }, [clearSearchFilter]);

  useEffect(() => {
    if (openSearch) {
      const input = document.querySelector('input');
      input?.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          handleCloseSearch();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [openSearch, handleCloseSearch]);

  useEffect(() => {
    debouncedSetSearchFilter(inputValue);

    return () => {
      debouncedSetSearchFilter.cancel();
    };
  }, [inputValue, debouncedSetSearchFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const isMobile = useIsMobile();

  return (
    <>
      {!isMobile && '['}
      <span className={`${styles.filtersButton} button`} onClick={handleToggleSearch}>
        {t('search')}
      </span>
      {!isMobile && ']'}
      {openSearch && (
        <div className={styles.searchContainer}>
          <input type='text' value={inputValue} onChange={handleSearchChange} />
          <span className={styles.closeSearch} onClick={handleCloseSearch}>
            ✖
          </span>
        </div>
      )}
    </>
  );
};

export default CatalogSearch;
