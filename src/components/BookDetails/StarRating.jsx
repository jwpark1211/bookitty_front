import React, { useState, useEffect } from 'react';
import './StarRating.css';
import LoginModal from './LoginModal';
import axios from 'axios';

const StarRating = ({ isbn, memberId, accessToken, refreshToken, isSignedIn }) => {
    const [value, setValue] = useState(0);
    const [starId, setStarId] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const ratingsUrl = `http://43.201.231.40:8080/star/isbn/${isbn}`;
                const response = await fetch(ratingsUrl);
                if (!response.ok) {
                    throw new Error('서버 응답이 올바르지 않습니다.');
                }
                const { data } = await response.json();
                setRatings(data.content);
            } catch (error) {
                console.error('평점 정보를 가져오는 중 오류 발생:', error);
            }
        };

        const fetchUserRating = async () => {
            try {
                const response = await axios.get(`http://43.201.231.40:8080/star/member/${memberId}/isbn/${isbn}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                if (response.data && response.data.data.id) {
                    setValue(response.data.data.score);
                    setStarId(response.data.data.id);
                }
            } catch (error) {
                console.error('Error fetching user rating:', error);
            }
        };

        if (isSignedIn) {
            fetchUserRating();
        }
        fetchRatings();
    }, [isbn, memberId, accessToken, isSignedIn]);

    const refreshAccessToken = async () => {
        try {
            const response = await axios.post('http://43.201.231.40:8080/auth/refresh', {
                refreshToken: refreshToken
            });
            sessionStorage.setItem('accessToken', response.data.accessToken);
            return response.data.accessToken;
        } catch (error) {
            console.error('Failed to refresh access token:', error);
            setShowLoginModal(true);
            throw new Error('Failed to refresh access token');
        }
    };

    const handleClick = async (e) => {
        const newValue = Number(e.target.value);

        if (!isSignedIn) {
            setShowLoginModal(true);
            return;
        }

        try {
            if (starId) {
                // 기존 별점을 수정
                await axios.patch(`http://43.201.231.40:8080/star/${starId}`, {
                    score: newValue
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                setValue(newValue); // 즉시 상태 업데이트
                setRatings(prevRatings => prevRatings.map(rating => rating.id === starId ? { ...rating, score: newValue } : rating));
            } else {
                // 새로운 별점을 생성
                const response = await axios.post(`http://43.201.231.40:8080/star/new`, {
                    isbn,
                    memberId,
                    score: newValue
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                if (response.data && response.data.data.id) {
                    setValue(newValue); // 즉시 상태 업데이트
                    setStarId(response.data.data.id);

                    // Update ratings state to reflect the new rating
                    setRatings(prevRatings => [...prevRatings, { id: response.data.data.id, score: newValue, comment: '' }]);
                }
            }
        } catch (error) {
            console.error('Error handling rating:', error);
        }
    };

    const handleDelete = async () => {
        if (!isSignedIn) {
            setShowLoginModal(true);
            return;
        }

        try {
            if (starId) {
                await axios.delete(`http://43.201.231.40:8080/star/${starId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                setValue(0); // 상태 업데이트
                setStarId(null);
                // 평점 리스트 다시 가져오기
                const ratingsUrl = `http://43.201.231.40:8080/star/isbn/${isbn}`;
                const response = await fetch(ratingsUrl);
                if (!response.ok) {
                    throw new Error('서버 응답이 올바르지 않습니다.');
                }
                const { data } = await response.json();
                setRatings(data.content);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error deleting rating:', error);
        }
    };

    const stars = [1, 2, 3, 4, 5];

    const averageRating = ratings.length > 0
        ? ratings.reduce((acc, rating) => acc + rating.score, 0) / ratings.length
        : 0;

    const ratingCounts = [0, 0, 0, 0, 0];
    ratings.forEach(rating => {
        ratingCounts[rating.score - 1]++;
    });

    return (
        <div className="star-rating-container">
            <div className="average-rating">{averageRating.toFixed(1)}</div>
            <div className="star-rating">
                {stars.map((star) => (
                    <React.Fragment key={star}>
                        <input
                            type="radio"
                            id={`star${star}`}
                            name="rating"
                            value={star}
                            checked={star === value}
                            onChange={handleClick} // 상태 업데이트
                        />
                        <label htmlFor={`star${star}`} className={star <= value ? 'filled' : ''} />
                    </React.Fragment>
                ))}
                {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
            </div>
            <button className="delete-button" onClick={handleDelete}>❌</button>
        
            <div className="rating-list">
                {ratings.map((rating, index) => (
                    <div key={index} className="rating-item">
                        <span className="rating-comment">{rating.comment}</span>
                    </div>
                ))}
            </div>
            <div className="rating-statistics">
                {ratingCounts.map((count, index) => (
                    <div key={index} className="rating-statistics-bar">
                        <span>{index + 1}</span>
                        <div className="bar" style={{ width: `${(count / ratings.length) * 100}%` }}></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StarRating;
