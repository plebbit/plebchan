import React from "react";
import { useComment, useEditedComment } from "@plebbit/plebbit-react-hooks";
import { Link } from "react-router-dom";
import OriginalCommentModal from "./modals/OriginalCommentModal";
import getDate from "../utils/getDate";


const EditLabel = ({ commentCid, className }) => {
  const [isOriginalCommentModalOpen, setIsOriginalCommentModalOpen] = React.useState(false);
  const comment = useComment({commentCid});
  const timestamp = getDate(comment.edit?.timestamp);
  const {state: editedCommentState, editedComment} = useEditedComment({comment});
  
  return (
    <>
      <OriginalCommentModal 
      isOpen={isOriginalCommentModalOpen}
      closeModal={() => setIsOriginalCommentModalOpen(false)}
      comment={comment}/> 
      {editedComment && (
        <>
          <br />
          <span className={className}>
            {editedCommentState === 'succeeded' && (
              <>
              (Edited at {timestamp}, <Link className="ttl-link" onClick={
                () => setIsOriginalCommentModalOpen(true)
              }>show original</Link>)
              </>
              )}
            {editedCommentState === 'pending' && ("(Pending Edit)")}
            {editedCommentState === 'failed' && ("(Failed Edit)")}
          </span>
        </>
      )}
    </>
  );
};

export default EditLabel;