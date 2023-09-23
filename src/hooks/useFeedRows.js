import { useMemo, useRef } from 'react';

const useFeedRows = (feedWithDescriptionAndRules, columnCount) => {
  const rowsRef = useRef([]);
  return useMemo(() => {
    const rows = [];
    for (let i = 0; i < feedWithDescriptionAndRules.length; i += columnCount) {
      if (rowsRef.current?.[rows.length] && rowsRef.current[rows.length].length === columnCount) {
        rows.push(rowsRef.current[rows.length]);
      } else {
        rows.push(feedWithDescriptionAndRules.slice(i, i + columnCount));
      }
    }
    rowsRef.current = rows;
    return rows;
  }, [feedWithDescriptionAndRules, columnCount]);
};

export default useFeedRows;
