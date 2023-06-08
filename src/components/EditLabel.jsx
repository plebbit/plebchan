import React, { useState } from "react";
import { useComment, useEditedComment } from "@plebbit/plebbit-react-hooks";
import { Link } from "react-router-dom";
import OriginalCommentModal from "./modals/OriginalCommentModal";
import getDate from "../utils/getDate";


const EditLabel = ({ commentCid, className }) => {
  const [isOriginalCommentModalOpen, setIsOriginalCommentModalOpen] = useState(false);
  const comment = useComment({commentCid});
  const timestamp = getDate(comment.edit?.timestamp);
  const {state: editedCommentState, editedComment} = useEditedComment({comment});

  return (
    <>
      <OriginalCommentModal 
      isOpen={isOriginalCommentModalOpen}
      closeModal={() => setIsOriginalCommentModalOpen(false)}
      comment={comment}/> 
      {editedComment || comment.edit ? (
        <>
          <br />
          <span className={className}>
            {comment.removed ? (
              <>
                (This post has been removed)
              </>
            ) : (
              <>
                {comment.edit ? (
                  <>
                    (Edited at {timestamp}, <Link className="ttl-link" onClick={
                      () => setIsOriginalCommentModalOpen(true)
                    }>show original</Link>)
                  </>
                ) : null}
                {editedCommentState === 'pending' && ("(Pending edit)")}
                {editedCommentState === 'failed' && ("(Failed edit)")}
              </>
            )}
          </span>
        </>
      ) : null}
    </>
  );
};

export default EditLabel;