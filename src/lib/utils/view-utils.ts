export type ParamsType = {
  accountCommentIndex?: string;
  commentCid?: string;
  subplebbitAddress?: string;
};

export const isAllView = (pathname: string): boolean => {
  return pathname.startsWith('/p/all');
};

export const isBoardView = (pathname: string, params: ParamsType): boolean => {
  // some subs might use emojis in their address, so we need to decode the pathname
  const decodedPathname = decodeURIComponent(pathname);
  return params.subplebbitAddress ? decodedPathname.startsWith(`/p/${params.subplebbitAddress}`) : false;
};

export const isCatalogView = (pathname: string): boolean => {
  return pathname.endsWith('/catalog') || pathname.endsWith('/catalog/settings');
};

export const isDescriptionView = (pathname: string, params: ParamsType): boolean => {
  const decodedPathname = decodeURIComponent(pathname);
  return pathname === '/p/all/description' ? true : params.subplebbitAddress ? decodedPathname.startsWith(`/p/${params.subplebbitAddress}/description`) : false;
};

export const isHomeView = (pathname: string): boolean => {
  return pathname === '/';
};

export const isPendingPostView = (pathname: string, params: ParamsType): boolean => {
  return pathname === `/profile/${params.accountCommentIndex}`;
};

export const isPostPageView = (pathname: string, params: ParamsType): boolean => {
  if (isDescriptionView(pathname, params) || isRulesView(pathname, params)) {
    return true;
  }
  const decodedPathname = decodeURIComponent(pathname);
  return params.subplebbitAddress && params.commentCid ? decodedPathname.startsWith(`/p/${params.subplebbitAddress}/c/${params.commentCid}`) : false;
};

export const isRulesView = (pathname: string, params: ParamsType): boolean => {
  const decodedPathname = decodeURIComponent(pathname);
  return params.subplebbitAddress ? decodedPathname.startsWith(`/p/${params.subplebbitAddress}/rules`) : false;
};

export const isSubscriptionsView = (pathname: string): boolean => {
  return pathname.startsWith('/p/subscriptions');
};

export const isNotFoundView = (pathname: string, params: ParamsType): boolean => {
  return (
    !isAllView(pathname) &&
    !isBoardView(pathname, params) &&
    !isCatalogView(pathname) &&
    !isDescriptionView(pathname, params) &&
    !isHomeView(pathname) &&
    !isPendingPostView(pathname, params) &&
    !isPostPageView(pathname, params) &&
    !isRulesView(pathname, params)
  );
};
