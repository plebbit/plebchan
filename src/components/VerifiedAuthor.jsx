import React from 'react';
import { useComment, useAuthorAddress } from '@plebbit/plebbit-react-hooks';

function VerifiedAuthor({ commentCid, children }) {
  const comment = useComment({ commentCid });
  const { authorAddress, shortAuthorAddress, authorAddressChanged } = useAuthorAddress({ comment });

  return children({ authorAddress, shortAuthorAddress, authorAddressChanged });
}

export default React.memo(VerifiedAuthor);
