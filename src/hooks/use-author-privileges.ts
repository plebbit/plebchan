import { useMemo } from 'react';
import { useAccount, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import useAnonModeStore from '../stores/use-anon-mode-store';
import useAnonMode from './use-anon-mode';

interface AuthorPrivilegesProps {
  commentAuthorAddress: string;
  subplebbitAddress: string;
  postCid?: string;
}

const useAuthorPrivileges = ({ commentAuthorAddress, subplebbitAddress, postCid }: AuthorPrivilegesProps) => {
  const account = useAccount();
  const accountAuthorAddress = account?.author?.address;
  const { roles } = useSubplebbit({ subplebbitAddress }) || {};
  const { getAddressSigner, getThreadSigner } = useAnonModeStore();
  const { anonMode } = useAnonMode(postCid);

  const { isCommentAuthorMod, isAccountMod, isAccountCommentAuthor, commentAuthorRole, accountAuthorRole } = useMemo(() => {
    const commentAuthorRole = roles?.[commentAuthorAddress]?.role;
    const isCommentAuthorMod = commentAuthorRole === 'admin' || commentAuthorRole === 'owner' || commentAuthorRole === 'moderator';
    const accountAuthorRole = roles?.[accountAuthorAddress]?.role;
    const isAccountMod = accountAuthorRole === 'admin' || accountAuthorRole === 'owner' || accountAuthorRole === 'moderator';

    let isAccountCommentAuthor = postCid && accountAuthorAddress === commentAuthorAddress;

    if (!isAccountCommentAuthor && anonMode) {
      const addressSigner = getAddressSigner(commentAuthorAddress);
      const threadSigner = postCid ? getThreadSigner(postCid) : null;

      isAccountCommentAuthor = (addressSigner && addressSigner.address === commentAuthorAddress) || (threadSigner && threadSigner.address === commentAuthorAddress);
    }

    return { isCommentAuthorMod, isAccountMod, isAccountCommentAuthor, commentAuthorRole, accountAuthorRole };
  }, [roles, commentAuthorAddress, accountAuthorAddress, anonMode, getAddressSigner, getThreadSigner, postCid]);

  return { isCommentAuthorMod, isAccountMod, isAccountCommentAuthor, commentAuthorRole, accountAuthorRole };
};

export default useAuthorPrivileges;
