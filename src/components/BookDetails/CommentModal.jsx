import React, { useState } from 'react';
import './CommentModal.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const CommentModal = ({ onClose, accessToken, isbn, memberId }) => {
    const [comment, setComment] = useState('');

    const handleChange = (event) => {
        setComment(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const requestBody = {
                isbn: isbn,
                memberId: memberId,
                content: comment
            };

            console.log('Request JSON:', requestBody);

            const response = await axios.post(
                'http://43.201.231.40:8080/comment/new',
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            console.log('코멘트 제출:', response.data);
            onClose();
        } catch (error) {
            console.error('코멘트 제출 에러:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <textarea
                    className="comment-input"
                    rows="4"
                    value={comment}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="코멘트를 입력하세요 (최대 100자)"
                />
                <button className="submit-button" onClick={handleSubmit}>제출</button>
            </div>
        </div>
    );
};

export default CommentModal;
