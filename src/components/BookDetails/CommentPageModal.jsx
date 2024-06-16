import React, { useState } from 'react';
import './CommentPageModal.css';
import CommentBox from './CommentBox';
import CommentModal from './CommentModal';

const CommentPageModal = ({ comments, onClose, memberId, isSignedIn, onEdit, onDelete, onLike, likedComments, accessToken, isbn, setComments }) => {
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [currentComment, setCurrentComment] = useState(null);

    const handleEditComment = (comment) => {
        setCurrentComment(comment);
        setShowCommentModal(true);
    };

    const handleCloseCommentModal = () => {
        setShowCommentModal(false);
        setCurrentComment(null);
    };

    return (
        <div className="comment-page-modal">
            <div className="modal-content-page">
                <h2>모든 코멘트</h2>
                <button className="close-button" onClick={onClose}>X</button>
                <div className="comment-list">
                    {comments.map((comment, index) => (
                        <CommentBox
                            key={index}
                            comment={comment}
                            memberId={memberId}
                            isSignedIn={isSignedIn}
                            onEdit={handleEditComment}
                            onDelete={onDelete}
                            onLike={onLike}
                            likedComments={likedComments}
                        />
                    ))}
                </div>
            </div>
            {showCommentModal && (
                <CommentModal
                    onClose={handleCloseCommentModal}
                    accessToken={accessToken}
                    memberId={memberId}
                    isbn={isbn}
                    currentComment={currentComment}
                    setComments={setComments}
                    comments={comments}
                />
            )}
        </div>
    );
};

export default CommentPageModal;
