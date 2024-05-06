export type ParamsType = {
  accountCommentIndex?: string;
  commentCid?: string;
  subplebbitAddress?: string;
};

export const isHomeView = (pathname: string): boolean => {
  return pathname === '/';
};

export const isDescriptionView = (pathname: string, params: ParamsType): boolean => {
  const decodedPathname = decodeURIComponent(pathname);
  return params.subplebbitAddress ? decodedPathname.startsWith(`/p/${params.subplebbitAddress}/description`) : false;
};

export const isRulesView = (pathname: string, params: ParamsType): boolean => {
  const decodedPathname = decodeURIComponent(pathname);
  return params.subplebbitAddress ? decodedPathname.startsWith(`/p/${params.subplebbitAddress}/rules`) : false;
};

export const isPostPageView = (pathname: string, params: ParamsType): boolean => {
  if (isDescriptionView(pathname, params) || isRulesView(pathname, params)) {
    return true;
  }
  const decodedPathname = decodeURIComponent(pathname);
  return params.subplebbitAddress && params.commentCid ? decodedPathname.startsWith(`/p/${params.subplebbitAddress}/c/${params.commentCid}`) : false;
};

export const isCatalogView = (pathname: string, params: ParamsType): boolean => {
  const decodedPathname = decodeURIComponent(pathname);
  return params.subplebbitAddress ? decodedPathname.startsWith(`/p/${params.subplebbitAddress}/catalog`) : false;
};

export const isPendingPostView = (pathname: string, params: ParamsType): boolean => {
  return pathname === `/profile/${params.accountCommentIndex}`;
};

export const isNotFoundView = (pathname: string, params: ParamsType): boolean => {
  return (
    !isHomeView(pathname) &&
    !isDescriptionView(pathname, params) &&
    !isRulesView(pathname, params) &&
    !isPostPageView(pathname, params) &&
    !isCatalogView(pathname, params) &&
    !isPendingPostView(pathname, params)
  );
};
