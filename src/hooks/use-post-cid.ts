import { useEffect, useReducer } from 'react';
import { useComment } from '@plebbit/plebbit-react-hooks';

type State = {
  resolvedPostCid: string | null;
  currentParentCid: string | undefined;
};

type Action = { type: 'SET_POST_CID'; payload: string } | { type: 'SET_PARENT_CID'; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_POST_CID':
      return { ...state, resolvedPostCid: action.payload };
    case 'SET_PARENT_CID':
      return { ...state, currentParentCid: action.payload };
    default:
      return state;
  }
};

const usePostCidForPendingPost = (initialParentCid: string | undefined): string | null => {
  const [state, dispatch] = useReducer(reducer, {
    resolvedPostCid: null,
    currentParentCid: initialParentCid,
  });

  const comment = useComment({ commentCid: state.currentParentCid });

  useEffect(() => {
    if (comment) {
      if (comment.postCid) {
        dispatch({ type: 'SET_POST_CID', payload: comment.postCid });
      } else if (comment.parentCid) {
        dispatch({ type: 'SET_PARENT_CID', payload: comment.parentCid });
      }
    }
  }, [comment]);

  return state.resolvedPostCid;
};

export default usePostCidForPendingPost;
