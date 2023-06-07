import React from "react";
import { useComment } from "@plebbit/plebbit-react-hooks";
import useStateString from "../hooks/useStateString";


const StateLabel = ({ commentCid, className }) => {
  const comment = useComment({commentCid});
  const stateString = useStateString(comment);

  return (
    comment.state === "succeeded" ? null : (
      comment.state === "initializing" ? null : (
        <span className="ttl">
            <>
              <br />
              (
                <span className={className}>
                  {stateString}
                </span>
              )
            </>
        </span>
      )
    )
  )
};

export default StateLabel;