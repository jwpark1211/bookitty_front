import React, { useState } from 'react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const CommentBox = ({ comment, onEdit, onDelete, isSignedIn}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.content);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const memberId = Number(sessionStorage.getItem('memberId')) || '';

    console.log("memberId : " , memberId);
    console.log("comment.memberId : " ,comment.memberId);

    const handleEditClick = () => {
        if (isSignedIn && comment.memberId === memberId) {
            setIsEditing(true);
        }
    };

    const handleSaveEdit = () => {
        onEdit(comment.id, editedComment);
        setIsEditing(false);
    };

    const handleDeleteClick = () => {
        if (isSignedIn && comment.memberId === memberId) {
            setShowDeleteModal(true);
        }
    };

    const handleConfirmDelete = () => {
        onDelete(comment.id);
        setShowDeleteModal(false);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
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
                {(isSignedIn && comment.memberId === memberId) && (
                    <>
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
                        <button 
                            onClick={handleDeleteClick} 
                            style={{ 
                                backgroundColor: 'transparent', 
                                color: 'white', 
                                border: 'none', 
                                cursor: 'pointer',
                                marginLeft: '10px'
                            }}
                        >
                            삭제
                        </button>
                    </>
                )}
            </div>
            {showDeleteModal && (
                <ConfirmDeleteModal
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
};

export default CommentBox;
