import React from 'react';
import './CommentPage.css';

const CommentPage = ({ comments, onClose }) => {
    return (
        <div className="comment-page-modal">
            <div className="comment-page-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>모든 코멘트</h2>
                {comments.map((comment, index) => (
                    <div key={index} className='comment-box'>
                        <div className="comment-info">
                            <img src={comment.memberProfileImg} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                            <span className="member-name">{comment.memberName}</span>
                        </div>
                        <span>{comment.content}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentPage;
