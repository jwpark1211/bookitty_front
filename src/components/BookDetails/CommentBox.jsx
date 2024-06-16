import React from 'react';
import './CommentBox.css';

const CommentBox = ({ comment, memberId, isSignedIn, onEdit, onDelete, onLike, likedComments }) => {
    const isLiked = likedComments.includes(comment.id);

    return (
        <div className="comment-box">
            <div className="comment-info">
                <img src={comment.memberProfileImg} alt="프로필" />
                <span className="member-name">{comment.memberName}</span>
                {isSignedIn && comment.memberId === Number(memberId) ? (
                    <div className="comment-actions">
                        <button onClick={() => onEdit(comment)}>수정</button>
                        <button onClick={() => onDelete(comment.id)}>삭제</button>
                    </div>
                ) : (
                    isSignedIn && (
                        <div className="comment-actions">
                            <button onClick={() => onLike(comment.id)}>
                                <i className={`fas fa-heart ${isLiked ? 'liked' : ''}`}></i>
                            </button>
                        </div>
                    )
                )}
            </div>
            <span className="comment-content">{comment.content}</span>
        </div>
    );
};

export default CommentBox;
