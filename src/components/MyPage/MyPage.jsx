import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./MyPage.css";

const MyPage = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [profileImg, setProfileImg] = useState(sessionStorage.getItem('profileImg') || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const email = sessionStorage.getItem('email') || '';
    const name = sessionStorage.getItem('name') || '';
    const accessToken = sessionStorage.getItem('accessToken') || '';
    const memberId = sessionStorage.getItem('memberId') || '';

    console.log("이메일 : ", email);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImg(URL.createObjectURL(file));
        setSelectedFile(file);
        console.log('이미지 변경:', file);
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
            if (!selectedFile) {
                setErrorMessage('프로필 이미지를 선택해주세요.');
                console.log('프로필 이미지를 선택해주세요.');
                return;
            }

            const formData = new FormData();
            formData.append('profile', selectedFile);

            const requestURL = `http://43.201.231.40:8080/members/${memberId}/profile`;
            console.log('요청 URL:', requestURL);

            const response = await fetch(requestURL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('프로필 이미지 업로드 성공:', responseData);

                // responseData의 구조를 감안하여 profileImg URL을 업데이트
                const newProfileImg = responseData.data.profileImg;

                setProfileImg(newProfileImg);
                sessionStorage.setItem('profileImg', newProfileImg);  // sessionStorage에 저장
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
                    {profileImg ? (
                        <img src={profileImg} alt="프로필" className="profile-preview" />
                    ) : (
                        <div className="empty-profile"></div>
                    )}
                </div>
                <div className="user-info">
                    <p className="name">{name} 님</p>
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
