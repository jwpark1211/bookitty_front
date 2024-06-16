import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CommentModal.css';

const CommentModal = ({ onClose, accessToken, memberId, isbn, currentComment, setComments, comments }) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        if (currentComment) {
            setContent(currentComment.content);
        } else {
            setContent('');
        }
    }, [currentComment]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (content.trim().length < 1 || content.trim().length > 100) {
            alert("1자 이상 100자 이내로 작성해주세요.");
            return;
        }

        try {
            if (currentComment) {
                const editCommentUrl = `http://43.201.231.40:8080/comment/${currentComment.id}`;
                const response = await axios.patch(
                    editCommentUrl,
                    { content },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );

                const updatedComments = comments.map(comment => {
                    if (comment.id === currentComment.id) {
                        return { ...comment, content };
                    }
                    return comment;
                });
                setComments(updatedComments);
                console.log('Comment edited successfully:', response.data);
            } else {
                const addCommentUrl = `http://43.201.231.40:8080/comment/new`;
                const response = await axios.post(
                    addCommentUrl,
                    {
                        content,
                        isbn,
                        memberId: Number(memberId)
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );

                setComments([response.data, ...comments]);
                window.location.reload();
                console.log('Comment added successfully:', response.data);
            }

            onClose();
        } catch (error) {
            console.error('Failed to submit comment:', error);
        }
    };

    return (
        <div className="comment-modal">
            <div className="modal-content2">
                <h2>{currentComment ? '코멘트 수정' : '코멘트 작성'}</h2>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="1자 이상 100자 이내 작성 가능"
                        maxLength="100"
                    />
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>취소</button>
                        <button type="submit">{currentComment ? '수정' : '작성'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CommentModal;
