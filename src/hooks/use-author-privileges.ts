import { useMemo } from 'react';
import { useAccount, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import useAnonModeStore from '../stores/use-anon-mode-store';

interface AuthorPrivilegesProps {
  commentAuthorAddress: string;
  subplebbitAddress: string;
}

const useAuthorPrivileges = ({ commentAuthorAddress, subplebbitAddress }: AuthorPrivilegesProps) => {
  const accountAuthorAddress = useAccount()?.author?.address;
  const { roles } = useSubplebbit({ subplebbitAddress }) || {};
  const { getAddressSigner } = useAnonModeStore();

  const { isCommentAuthorMod, isAccountMod, isAccountCommentAuthor, commentAuthorRole, accountAuthorRole } = useMemo(() => {
    const commentAuthorRole = roles?.[commentAuthorAddress]?.role;
    const isCommentAuthorMod = commentAuthorRole === 'admin' || commentAuthorRole === 'owner' || commentAuthorRole === 'moderator';
    const accountAuthorRole = roles?.[accountAuthorAddress]?.role;
    const isAccountMod = accountAuthorRole === 'admin' || accountAuthorRole === 'owner' || accountAuthorRole === 'moderator';

    let isAccountCommentAuthor = accountAuthorAddress === commentAuthorAddress;

    if (!isAccountCommentAuthor) {
      const existingSigner = getAddressSigner(commentAuthorAddress);
      isAccountCommentAuthor = !!existingSigner;
    }

    return { isCommentAuthorMod, isAccountMod, isAccountCommentAuthor, commentAuthorRole, accountAuthorRole };
  }, [roles, commentAuthorAddress, accountAuthorAddress, getAddressSigner]);

  return { isCommentAuthorMod, isAccountMod, isAccountCommentAuthor, commentAuthorRole, accountAuthorRole };
};

export default useAuthorPrivileges;
