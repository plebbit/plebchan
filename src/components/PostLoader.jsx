import React from 'react';
import ContentLoader from 'react-content-loader';
import useGeneralStore from '../hooks/stores/useGeneralStore';

const SinglePostLoader = () => {
  const selectedStyle = useGeneralStore((state) => state.selectedStyle);
  const backgroundColor = selectedStyle === 'Tomorrow' ? '#333' : '#f3f3f3';
  const foregroundColor = selectedStyle === 'Tomorrow' ? '#555' : '#ecebeb';

  return (
    <div style={{ paddingLeft: '30px', paddingRight: '30px', marginBottom: '50px', marginTop: '30px' }}>
      <ContentLoader width='100%' height={15 * 3 + 30} backgroundColor={backgroundColor} foregroundColor={foregroundColor}>
        <rect x='0' y='8' width='100%' height='15' />
        <rect x='0' y='30' width='100%' height='15' />
        <rect x='0' y='52' width='100%' height='15' />
      </ContentLoader>
    </div>
  );
};

const PostLoader = () => {
  return (
    <div
      style={{
        display: 'block',
        boxSizing: 'border-box',
        paddingLeft: '30px',
        paddingRight: '30px',
        marginBottom: '30px',
      }}
    >
      {[...Array(5)].map((_, index) => (
        <SinglePostLoader key={index} />
      ))}
    </div>
  );
};

export default PostLoader;
