import React from "react";
import { useAccountComment } from "@plebbit/plebbit-react-hooks";
import useStateString from "../hooks/useStateString";
import useGeneralStore from "../hooks/stores/useGeneralStore";


const StateLabel = ({ commentCid, className }) => {
  const { pendingCommentIndex } = useGeneralStore(state => state);

  const comment = useAccountComment({commentIndex: pendingCommentIndex});
  const stateString = useStateString(comment);

  return (
    !commentCid && stateString !== "Succeeded" ? (
      comment.state === "failed" ? (
        <span className="ttl">
          <br />
          (
            <span className="ttl">
              Failed
            </span>
          )
          </span>
      ) : (
      <span className="ttl">
        <br />
        (
          <span className={className}>
            {stateString}
          </span>
        )
      </span>
      )
    ) : null
  );
};

export default StateLabel;