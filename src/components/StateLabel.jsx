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
  }, []);

  if (commentIndex === undefined) return null;

  console.log(commentIndex, stateString, comment);

  return (
    commentIndex && stateString !== "Succeeded" ? (
      (comment.state === "failed" || (stateString === undefined && !isLoading)) ? (
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