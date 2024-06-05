import React, { useState } from 'react';

const CommentBox = ({ comment, onEdit, isSignedIn }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.content);

    const handleEditClick = () => {
        if (isSignedIn) {
            setIsEditing(true);
        } 
    };

    const handleSaveEdit = () => {
        onEdit(comment.id, editedComment);
        setIsEditing(false);
    };

    return (
        <div className='comment-box'>
            <div className="comment-info">
                <img src={comment.memberProfileImg} style={{ width: '30px', height: '30px', borderRadius: '50%' }} alt={`${comment.memberName}'s profile`} />
                <span className="member-name" style={{ marginLeft: '10px' }}>{comment.memberName}</span>
                {isEditing ? (
                    <input 
                        type="text" 
                        value={editedComment} 
                        onChange={(e) => setEditedComment(e.target.value)} 
                    />
                ) : (
                    <span>{comment.content}</span>
                )}
            </div>
            <div className="actions">
                {isEditing ? (
                    <button 
                        onClick={handleSaveEdit} 
                        style={{ 
                            backgroundColor: 'transparent', 
                            color: 'white', 
                            border: 'none', 
                            cursor: 'pointer' 
                        }}
                    >
                        저장
                    </button>
                ) : (
                    <button 
                        onClick={handleEditClick} 
                        style={{ 
                            backgroundColor: 'transparent', 
                            color: 'white', 
                            border: 'none', 
                            cursor: 'pointer'
                        }}
                    >
                        수정
                    </button>
                )}
            </div>
        </div>
    );
};

export default CommentBox;
