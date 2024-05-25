import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BookDetail.css';
import StarRating from './StarRating';
import LoginModal from './LoginModal';
import axios from 'axios';

const BookDetail = () => {
    const { isbn } = useParams();
    const [book, setBook] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const accessToken = sessionStorage.getItem('accessToken');
    console.log("Access Token:", accessToken);
    const refreshToken = sessionStorage.getItem('refreshToken');
    const memberId = sessionStorage.getItem('memberId');
    const [userRating, setUserRating] = useState(0);
    const isSignedIn = sessionStorage.getItem('login') === 'true';

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const apiUrl = `http://43.201.231.40:8080/open/search/book/${isbn}`;
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('서버 응답이 올바르지 않습니다.');
                }
                const data = await response.json();
                if (data && data.item && data.item.length > 0) {
                    setBook(data.item[0]);
                } else {
                    throw new Error('책 정보가 없습니다.');
                }
            } catch (error) {
                console.error('책 정보를 가져오는 중 오류 발생:', error);
            }
        };

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

        fetchBookDetails();
        fetchRatings();
    }, [isbn]);

    const handleRatingSubmit = (ratingValue) => {
        if (!isSignedIn) {
            setShowModal(true);
            return;
        }

        setUserRating(ratingValue);
        console.log(`평점이 제출되었습니다: ${ratingValue} 점`);
    };

    const refreshAccessToken = async () => {
        try {
            const response = await axios.post('http://43.201.231.40:8080/auth/refresh', {
                refreshToken: refreshToken
            });
            sessionStorage.setItem('accessToken', response.data.accessToken);
            return response.data.accessToken;
        } catch (error) {
            console.error('Failed to refresh access token:', error);
            setShowModal(true);
            throw new Error('Failed to refresh access token');
        }
    };

    const onRatingButtonClick = async () => {
        const ratingsUrl = `http://43.201.231.40:8080/star/new`;
        let token = accessToken;
        try {
            const response = await axios.post(
                ratingsUrl,
                {
                    isbn,
                    memberId,
                    score: userRating
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setRatings([...ratings, { score: userRating, comment: '' }]);
            console.log('Rating submitted successfully:', response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                try {
                    token = await refreshAccessToken();
                    const response = await axios.post(
                        ratingsUrl,
                        {
                            isbn,
                            memberId,
                            score: userRating
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    setRatings([...ratings, { score: userRating, comment: '' }]);
                    console.log('Rating submitted successfully:', response.data);
                } catch (refreshError) {
                    console.error('Error:', refreshError);
                }
            } else {
                console.error('Error:', error);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    if (!book) {
        return null;
    }

    const averageRating = ratings.length > 0
        ? ratings.reduce((acc, rating) => acc + rating.score, 0) / ratings.length
        : 0;

    return (
        <div className="book-detail">
            <div className="book-image">
                {book.cover && <img src={book.cover} alt={book.title} />}
            </div>
            <div className="book-info">
                <h1 className="book-title01">{book.title}</h1>
                <h2 className="book-author01">{book.author}</h2>
                <h3 className="book-pubDate">{book.pubDate}</h3>
                <h4 className="book-description">{book.description}</h4>
                <h5 className="book-price">정가 {book.priceStandard}원</h5>
                <a href={book.link} className="book-link" target="_blank" rel="noopener noreferrer">알라딘에서 보기</a>
                <div className="book-ratings">
                    <h3>평점</h3>
                    <div className="average-rating">{averageRating.toFixed(1)}</div>
                    <StarRating value={userRating} setValue={setUserRating} onRatingSubmit={handleRatingSubmit} isSignedIn={isSignedIn} />
                    <button onClick={onRatingButtonClick} className="rate-button" disabled={!isSignedIn}>나도 평가하기</button>
                    <div className="rating-list">
                        {ratings.map((rating, index) => (
                            <div key={index} className="rating-item">
                                <span className="rating-score">{rating.score}점</span>
                                <span className="rating-comment">{rating.comment}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showModal && <LoginModal onClose={handleCloseModal} />}
        </div>
    );
};

export default BookDetail;
