import React from 'react';

const CommentPage = ({ comments, onClose }) => {
    return (
        <div className="comment-page">
            <h2>전체 코멘트</h2>
            <button onClick={onClose}>닫기</button>
            <div className="comment-list">
                {comments.map((comment, index) => (
                    <div key={index} className="comment-box">
                        <img src={comment.profilePicture} alt={comment.memberName} className="profile-picture" />
                        <span>{comment.memberName} : </span>
                        <span>{comment.content}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentPage;
