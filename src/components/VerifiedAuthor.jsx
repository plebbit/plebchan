import {useComment, useAuthorAddress} from '@plebbit/plebbit-react-hooks';

function VerifiedAuthor({ commentCid, children }) {
  const comment = useComment({commentCid});
  const {authorAddress, shortAuthorAddress} = useAuthorAddress({comment});

  return children({ authorAddress, shortAuthorAddress });
}

export default VerifiedAuthor;