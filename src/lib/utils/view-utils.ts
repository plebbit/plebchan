export type ParamsType = {
  accountCommentIndex?: string;
  commentCid?: string;
  subplebbitAddress?: string;
  timeFilterName?: string;
};

export const isAllView = (pathname: string): boolean => {
  return pathname.startsWith('/p/all');
};

export const isBoardView = (pathname: string, params: ParamsType): boolean => {
  // some subs might use emojis in their address, so we need to decode the pathname
  const decodedPathname = decodeURIComponent(pathname);
  return params.subplebbitAddress ? decodedPathname.startsWith(`/p/${params.subplebbitAddress}`) : false;
};

export const isCatalogView = (pathname: string, params: ParamsType): boolean => {
  const { subplebbitAddress, timeFilterName } = params;
  const decodedPathname = decodeURIComponent(pathname);

  return (
    decodedPathname === `/p/${subplebbitAddress}/catalog` ||
    decodedPathname === `/p/${subplebbitAddress}/catalog/settings` ||
    decodedPathname === `/p/all/catalog` ||
    decodedPathname === `/p/all/catalog/settings` ||
    decodedPathname === `/p/all/catalog/${timeFilterName}` ||
    decodedPathname === `/p/subscriptions/catalog` ||
    decodedPathname === `/p/subscriptions/catalog/settings` ||
    decodedPathname === `/p/subscriptions/catalog/${timeFilterName}`
  );
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

export const isSettingsView = (pathname: string, params: ParamsType): boolean => {
  const { accountCommentIndex, commentCid, subplebbitAddress } = params;
  const decodedPathname = decodeURIComponent(pathname);
  return (
    decodedPathname === `/p/${subplebbitAddress}/c/${commentCid}/settings` ||
    decodedPathname === `/p/${subplebbitAddress}/description/settings` ||
    decodedPathname === `/p/${subplebbitAddress}/rules/settings` ||
    decodedPathname === `/profile/${accountCommentIndex}/settings`
  );
};

export const isSubscriptionsView = (pathname: string): boolean => {
  return pathname.startsWith('/p/subscriptions');
};

export const isNotFoundView = (pathname: string, params: ParamsType): boolean => {
  return (
    !isAllView(pathname) &&
    !isBoardView(pathname, params) &&
    !isCatalogView(pathname, params) &&
    !isDescriptionView(pathname, params) &&
    !isHomeView(pathname) &&
    !isPendingPostView(pathname, params) &&
    !isPostPageView(pathname, params) &&
    !isRulesView(pathname, params)
  );
};
