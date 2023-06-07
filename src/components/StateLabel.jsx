import React from "react";
import { useComment } from "@plebbit/plebbit-react-hooks";
import useStateString from "../hooks/useStateString";


const StateLabel = ({ commentCid, className }) => {
  const comment = useComment({commentCid});
  const stateString = useStateString(comment);

  return (
    comment.state === "succeeded" ? null : (
    <span className={className}>
        <>
          <br />
          {stateString || comment.state.charAt(0).toUpperCase() + comment.state.slice(1)}
        </>
    </span>
    )
  )
};

export default StateLabel;