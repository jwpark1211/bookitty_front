import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyPage.css';

const MyPage = ({ isSignedIn, email, name }) => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setErrorMessage('');
  };

  const handleImageUpload = async () => {
    try {
      if (!profileImage) {
        setErrorMessage('프로필 이미지를 선택해주세요.');
        return;
      }

      const formData = new FormData();
      formData.append('profileImage', profileImage);

      const response = await fetch(`http://43.201.231.40:8080/members/{id}/profile`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      });

      if (response.ok) {
        console.log('프로필 이미지 업로드 성공:', await response.json());
        handleModalClose();
      } else {
        throw new Error('프로필 이미지 업로드 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('프로필 이미지 업로드 오류:', error);
      setErrorMessage('프로필 이미지 업로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="my-page">
      <div className="profile-section">
        <div className="profile-preview-container">
          {previewImage ? (
            <img src={previewImage} alt="프로필" className="profile-preview" />
          ) : (
            <div className="empty-profile"></div>
          )}
        </div>
        <div className="user-info">
        <p className="name">{name} 님 </p>
          <p className="email">{email}</p>
        </div>
      </div>
      <div className="profile-edit-section">
        <button className="profile-edit-button" onClick={handleModalOpen}>프로필 수정</button>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleModalClose}>&times;</span>
            <label className="file-input-label" htmlFor="file-input">파일 선택</label>
            <input id="file-input" type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
            <button className="upload-button" onClick={handleImageUpload}>프로필 업로드</button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
