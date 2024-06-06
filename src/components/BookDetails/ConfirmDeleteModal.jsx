// ConfirmDeleteModal.js
import React from 'react';
import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ onClose, onConfirm }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>삭제하시겠습니까?</h2>
                <div className="modal-buttons">
                    <button onClick={onConfirm} className="confirm-button">예</button>
                    <button onClick={onClose} className="cancel-button">아니오</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
