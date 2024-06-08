import { useAccount, useSubplebbit } from '@plebbit/plebbit-react-hooks';

interface AuthorPrivilegesProps {
  commentAuthorAddress: string;
  subplebbitAddress: string;
}

const useAuthorPrivileges = ({ commentAuthorAddress, subplebbitAddress }: AuthorPrivilegesProps) => {
  const accountAuthorAddress = useAccount()?.author?.address;
  const { roles } = useSubplebbit({ subplebbitAddress }) || {};

  const commentAuthorRole = roles?.[commentAuthorAddress]?.role;
  const isCommentAuthorMod = commentAuthorRole === 'admin' || commentAuthorRole === 'owner' || commentAuthorRole === 'moderator';
  const accountAuthorRole = roles?.[accountAuthorAddress]?.role;
  const isAccountMod = accountAuthorRole === 'admin' || accountAuthorRole === 'owner' || accountAuthorRole === 'moderator';
  const isAccountCommentAuthor = accountAuthorAddress === commentAuthorAddress;

  return { isCommentAuthorMod, isAccountMod, isAccountCommentAuthor, commentAuthorRole, accountAuthorRole };
};

export default useAuthorPrivileges;
