import React, { useState, useEffect } from "react";
import { useAccountComment } from "@plebbit/plebbit-react-hooks";
import useStateString from "../hooks/useStateString";

const StateLabel = ({ commentIndex, className }) => {
  const comment = useAccountComment({commentIndex: commentIndex});
  const stateString = useStateString(comment);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [commentIndex]);

  return (
    commentIndex !== undefined && stateString !== "Succeeded" ? (
      (comment.state === "failed") ? (
        null
      ) : (
        stateString === undefined && !isLoading && comment.cid === undefined ? (
          null
        ) : (
        <span className="ttl">
          <br />
          (
            <span className={className}>
              {stateString}
            </span>
          )
        </span>
      ))
    ) : null
  );
};

export default StateLabel;