import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BookDetail.css';
import StarRating from './StarRating';
import LoginModal from './LoginModal';
import axios from 'axios';
import CommentPage from './CommentPage';

const BookDetail = () => {
    const { isbn } = useParams();
    const [book, setBook] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [comments, setComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const accessToken = sessionStorage.getItem('accessToken');
    const refreshToken = sessionStorage.getItem('refreshToken');
    const memberId = sessionStorage.getItem('memberId');
    const [userRating, setUserRating] = useState(0);
    const isSignedIn = sessionStorage.getItem('login') === 'true';
    const [visibleComments, setVisibleComments] = useState(3); // 화면에 보여줄 코멘트 수
    const [showAllCommentsModal, setShowAllCommentsModal] = useState(false); // 전체 코멘트를 보여줄 모달 표시 여부


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

        const fetchComments = async () => {
            try {
                const commentsUrl = `http://43.201.231.40:8080/comment/isbn/${isbn}`;
                const response = await fetch(commentsUrl);
                if (!response.ok) {
                    throw new Error('서버 응답이 올바르지 않습니다.');
                }
                const responseData = await response.json();
                const { data } = responseData;
                setComments(data.content);
            } catch (error) {
                console.error('코멘트 정보를 가져오는 중 오류 발생:', error);
            }
        };

        fetchBookDetails();
        fetchRatings();
        fetchComments();
    }, [isbn]);

    
    useEffect(() => {
        const fetchMemberInfo = async () => {
            try {
                const commentsWithMemberInfo = await Promise.all(
                    comments.map(async (comment) => {
                        const memberInfoUrl = `http://43.201.231.40:8080/members/${comment.memberId}`;
                        const [memberResponse] = await Promise.all([
                            fetch(memberInfoUrl, {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`
                                }
                            }),
                        ]);
                        if (!memberResponse.ok) {
                            throw new Error('회원 정보를 가져오는 중 오류가 발생했습니다.');
                        }
                        const memberData = await memberResponse.json();
                        if (!memberData || !memberData.name) {
                            throw new Error('멤버 이름을 가져오는 데 문제가 있습니다.');
                        }
                        return {
                            ...comment,
                            memberName: memberData.name
                        };
                    })
                );
                setComments(commentsWithMemberInfo);
            } catch (error) {
                console.error('회원 정보를 가져오는 중 오류 발생:', error);
            }
        };
        
        
        
        
        
        

        
        if (comments.length > 0) {
            fetchMemberInfo();
        }
    }, [comments, accessToken]);

    const handleRatingSubmit = (ratingValue) => {
        if (!isSignedIn) {
            setShowModal(true);
            return;
        }

        const submitRating = async () => {
            const ratingsUrl = `http://43.201.231.40:8080/star/new`;
            let token = accessToken;
            try {
                const response = await axios.post(
                    ratingsUrl,
                    {
                        isbn,
                        memberId,
                        score: ratingValue
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setRatings([...ratings, { score: ratingValue, comment: '' }]);
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
                                score: ratingValue
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        );

                        setRatings([...ratings, { score: ratingValue, comment: '' }]);
                        console.log('Rating submitted successfully:', response.data);
                    } catch (refreshError) {
                        console.error('Error:', refreshError);
                    }
                } else {
                    console.error('Error:', error);
                }
            }
        };

        submitRating();
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

    const handleCloseModal = () => {
        setShowModal(false);
    };
    
    if (!book) {
        return null;
    }
    
    const averageRating = ratings.length > 0
        ? ratings.reduce((acc, rating) => acc + rating.score, 0) / ratings.length
        : 0;
    
    const ratingCounts = [0, 0, 0, 0, 0];
    ratings.forEach(rating => {
        ratingCounts[rating.score - 1]++;
    });
    
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
                <div className='comment-section'>
    <h3>코멘트</h3>
    {comments && comments.length > 0 ? (
    comments.slice(0, visibleComments).map((comment, index) => (
        <div key={index} className='comment-box' style={{ textAlign: 'center' }}>
            <div className="comment-info" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={comment.memberProfileImg} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                <span className="member-name" style={{ marginLeft: '10px' }}>{comment.memberName}</span>
            </div>
            <span>{comment.content}</span>
        </div>
    ))
) : (
    <span>코멘트가 없습니다.</span>
)}





    {comments.length > visibleComments && (
        <button onClick={() => setShowAllCommentsModal(true)}>더 보기</button>
    )}
</div>

            </div>
            {showModal && <LoginModal onClose={handleCloseModal} />}
            {showAllCommentsModal && <CommentPage comments={comments} onClose={() => setShowAllCommentsModal(false)} />}
        </div>
    );
    };
    
    export default BookDetail;
    