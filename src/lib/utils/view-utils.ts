export type ParamsType = {
  commentCid?: string;
  subplebbitAddress?: string;
};

export const isHomeView = (pathname: string): boolean => {
  return pathname === '/';
};

export const isPostPageView = (pathname: string, params: ParamsType): boolean => {
  // some subs might use emojis in their address, so we need to decode the pathname
  const decodedPathname = decodeURIComponent(pathname);
  return params.subplebbitAddress && params.commentCid ? decodedPathname.startsWith(`/p/${params.subplebbitAddress}/c/${params.commentCid}`) : false;
};
