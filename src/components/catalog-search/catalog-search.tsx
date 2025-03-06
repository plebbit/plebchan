import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './catalog-search.module.css';
import useIsMobile from '../../hooks/use-is-mobile';

const CatalogSearch = () => {
  const { t } = useTranslation();
  const [openSearch, setOpenSearch] = useState(false);

  useEffect(() => {
    if (openSearch) {
      const input = document.querySelector('input');
      input?.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setOpenSearch(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
    }
  }, [openSearch]);

  const isMobile = useIsMobile();

  return (
    <>
      {!isMobile && '['}
      <span className={`${styles.filtersButton} button`} onClick={() => setOpenSearch(!openSearch)}>
        {t('search')}
      </span>
      {!isMobile && ']'}
      {openSearch && (
        <div className={styles.searchContainer}>
          <input type='text' />
          <span className={styles.closeSearch} onClick={() => setOpenSearch(false)}>
            ✖
          </span>
        </div>
      )}
    </>
  );
};

export default CatalogSearch;
