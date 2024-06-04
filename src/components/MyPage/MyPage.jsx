import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2'; // Doughnut 추가
import { Chart, registerables } from 'chart.js';
import "./MyPage.css";

Chart.register(...registerables);

const MyPage = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [profileImg, setProfileImg] = useState(sessionStorage.getItem('profileImg') || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [readingStats, setReadingStats] = useState(Array(12).fill(0));
    const [categoryStats, setCategoryStats] = useState([]);

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

    const fetchReadingStats = async () => {
        const currentYear = new Date().getFullYear();
        const requestURL = `http://43.201.231.40:8080/state/statics/members/${memberId}/month/${currentYear}`;

        try {
            const response = await fetch(requestURL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('독서 통계 데이터 가져오기 성공:', responseData);
                setReadingStats(responseData.data.monthlyData);
            } else {
                throw new Error('독서 통계 데이터를 가져오는 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('독서 통계 데이터 가져오기 오류:', error);
            setErrorMessage('독서 통계 데이터를 가져오는 중 오류가 발생했습니다.');
        }
    };

    const fetchCategoryStats = async () => {
        try {
            const response = await fetch(`http://43.201.231.40:8080/state/statics/members/${memberId}/category`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('카테고리 통계 데이터 가져오기 성공:', responseData);
                setCategoryStats(responseData.data);
            } else {
                throw new Error('카테고리 통계 데이터를 가져오는 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('카테고리 통계 데이터 가져오기 오류:', error);
            setErrorMessage('카테고리 통계 데이터를 가져오는 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        fetchReadingStats(); // 독서 통계 데이터 가져오기
        fetchCategoryStats(); // 카테고리 통계 데이터 가져오기
    }, []);

    return (
        <div className="my-page">
            {/* 프로필 섹션 */}
            <div className="profile-section">
                {/* 프로필 이미지 */}
                <div className="profile-preview-container">
                    {profileImg ? (
                        <img src={profileImg} alt="프로필" className="profile-preview" />
                    ) : (
                        <div className="empty-profile"></div>
                    )}
                </div>
                {/* 사용자 정보 */}
                <div className="user-info">
                    <p className="name">{name} 님</p>
                    <p className="email">{email}</p>
                </div>
                {/* 프로필 수정 버튼 */}
                <div className="profile-edit-section">
                    <button className="profile-edit-button" onClick={handleModalOpen}>프로필 수정</button>
                </div>
            </div>
            {/* Divider */}
            <div className="divider"></div>

            {/* 프로필 수정 모달 */}
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

            {/* 독서 통계 섹션 */}
            <div className="reading-stats-section">
                <h3>독서 통계</h3>
                {/* 막대 그래프 */}
                <Bar
                    data={{
                        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                        datasets: [
                            {
                                label: '읽은 책 수',
                                data: readingStats,
                                backgroundColor: '#d300ff',
                                borderColor: '#d300ff',
                                borderWidth: 1,
                            },
                        ],
                    }}
                    options={{
                        maintainAspectRatio: true,
                        aspectRatio: 70/20, // 그래프의 가로 세로 비율 설정
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    display: false // y축 눈금 숨기기
                                }
                            },
                            x: {
                                ticks: {
                                    color: '#fff' // x축 글씨 색상 하얀색으로 설정
                                }
                            }
                        },
                    }}
                />
            </div>

            {/* 카테고리 통계 섹션 */}
            <div className="category-stats-section">
                <h3>도서 분류</h3>
                {/* 원 그래프 */}
                <Doughnut
    data={{
        labels: Object.keys(categoryStats), // 객체의 키를 라벨로 사용
        datasets: [{
            data: Object.values(categoryStats), // 객체의 값들을 데이터로 사용
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }]
    }}
/>

            </div>

            {/* 맨 아래 가로선 */}
            <div className="bottom-divider"></div>
        </div>
        
    );

};

export default MyPage;
