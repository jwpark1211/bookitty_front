import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Chart, registerables } from 'chart.js';
import "./MyPage.css";

Chart.register(...registerables);

const MyPage = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [profileImg, setProfileImg] = useState(sessionStorage.getItem('profileImg') || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [readingStats, setReadingStats] = useState(Array(12).fill(0));
    const [categoryStats, setCategoryStats] = useState({});
    const [bookStatus, setBookStatus] = useState({ content: [] });
    const [currentFilter, setCurrentFilter] = useState('전체');
    const email = sessionStorage.getItem('email') || '';
    const name = sessionStorage.getItem('name') || '';
    const accessToken = sessionStorage.getItem('accessToken') || '';
    const memberId = sessionStorage.getItem('memberId') || '';

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

                const newProfileImg = responseData.data.profileImg;

                setProfileImg(newProfileImg);
                sessionStorage.setItem('profileImg', newProfileImg);
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

    const fetchBookStatus = async () => {
        try {
            const response = await fetch(`http://43.201.231.40:8080/state/member/${memberId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('책 상태 데이터 가져오기 성공:', responseData);
                setBookStatus(responseData.data);
            } else {
                throw new Error('책 상태 데이터를 가져오는 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('책 상태 데이터 가져오기 오류:', error);
            setErrorMessage('책 상태 데이터를 가져오는 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        fetchReadingStats();
        fetchCategoryStats();
        fetchBookStatus();
    }, []);

    const filteredBooks = bookStatus.content.filter((book) => {
        if (currentFilter === '전체') return true;
        return book.state === currentFilter;
    });

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
                <div className="profile-edit-section">
                    <button className="profile-edit-button" onClick={handleModalOpen}>프로필 수정</button>
                </div>
            </div>
            <div className="divider"></div>

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

            <div className="reading-stats-section">
                <h3>독서 통계</h3>
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
                        aspectRatio: 90/20,
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    display: false 
                                }
                            },
                            x: {
                                ticks: {
                                    color: '#fff'
                                }
                            }
                        },
                    }}
                />
            </div>

            <div className="category-stats-section">
                <h3>도서 분류</h3>
                <Doughnut
                    data={{
                        labels: Object.keys(categoryStats),
                        datasets: [{
                            data: Object.values(categoryStats),
                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                        }]
                    }}
                />
            </div>

            <div className="bottom-divider"></div>

            <div className="book-status-section">
    <h3 style={{marginBottom: '10px', textAlign: 'center'}}>나의 서재</h3>
    <div className="filter-buttons">
        <button
            className={`filter-button ${currentFilter === '전체' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('전체')}
            style={{textDecoration: 'none'}}
        >
            전체
        </button>
        <button
            className={`filter-button ${currentFilter === 'READ_ALREADY' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('READ_ALREADY')}
            style={{textDecoration: 'none'}}
        >
            다 읽음
        </button>
        <button
            className={`filter-button ${currentFilter === 'READING' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('READING')}
            style={{textDecoration: 'none'}}
        >
            읽고 싶은 책
        </button>
        <button
            className={`filter-button ${currentFilter === 'WANT_TO_READ' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('WANT_TO_READ')}
            style={{textDecoration: 'none'}}
        >
            읽고 싶은 책
        </button>
    </div>
    <div className="book-list">
    {filteredBooks.length > 0 ? (
        filteredBooks.map((book, index) => (
            <div key={index} className="book-item">
                <img src={book.bookImgUrl} className="book-image03" alt="book cover" style={{ borderRadius: '20px' }} />
                <p><a href={`/book/${book.isbn}`} style={{ textDecoration: 'none', color: 'inherit' }}>{book.bookTitle}</a></p>
                <p style={{ fontWeight: '100', fontSize: '13px', color: 'grey' }}>{book.bookAuthor}</p>
            </div>
        ))
    ) : (
        <p>책이 없습니다.</p>
    )}
</div>



</div>


        </div>
    );
};

export default MyPage;
