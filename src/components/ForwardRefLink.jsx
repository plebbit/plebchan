import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ForwardRefLink = React.forwardRef((props, ref) => {
  const { children, setRefAndCid, onMouseOver, onMouseLeave, onClick, ...otherProps } = props;

  const handleClick = (event) => {
    if (otherProps.to === '#void') {
      event.preventDefault();
    }
    if (onClick) {
      onClick(event);
    }
  };

  useEffect(() => {
    if (ref.current && typeof setRefAndCid === 'function') {
      setRefAndCid(ref.current);
    }
  }, [ref, setRefAndCid]);

  return (
    <Link ref={ref} {...otherProps} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} onClick={handleClick}>
      {children}
    </Link>
  );
});

export default ForwardRefLink;
