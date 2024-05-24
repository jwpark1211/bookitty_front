import React from 'react';
import './LoginModal.css';

const LoginModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>Please log in to rate this book.</p>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default LoginModal;
