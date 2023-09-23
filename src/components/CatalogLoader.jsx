import React from 'react';
import ContentLoader from 'react-content-loader';
import useGeneralStore from '../hooks/stores/useGeneralStore';

const SingleRectLoader = () => {
  const selectedStyle = useGeneralStore((state) => state.selectedStyle);
  const backgroundColor = selectedStyle === 'Tomorrow' ? '#333' : '#f3f3f3';
  const foregroundColor = selectedStyle === 'Tomorrow' ? '#555' : '#ecebeb';

  return (
    <ContentLoader
      speed={2}
      width={150}
      height={215}
      viewBox='0 0 150 215'
      backgroundColor={backgroundColor}
      foregroundColor={foregroundColor}
      style={{
        width: '150px',
        height: '215px',
        marginRight: '30px',
        marginBottom: '30px',
      }}
    >
      <rect x={0} y={0} width='150' height='150' />
      <rect x={0} y={170} width='150' height='18' />
      <rect x={0} y={195} width='80' height='20' />
    </ContentLoader>
  );
};

const CatalogLoader = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      {[...Array(24)].map((_, index) => (
        <SingleRectLoader key={index} />
      ))}
    </div>
  );
};

export default CatalogLoader;
