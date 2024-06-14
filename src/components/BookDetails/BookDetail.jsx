import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BookDetail.css';
import StarRating from './StarRating';
import LoginModal from './LoginModal';
import CommentModal from './CommentModal';
import BookState from './BookState';
import CommentPage from './CommentPage';
import CommentBox from './CommentBox';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

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
    const [visibleComments, setVisibleComments] = useState(3);
    const [showAllCommentsModal, setShowAllCommentsModal] = useState(false);
    const [likedComments, setLikedComments] = useState([]);
    const [newComment, setNewComment] = useState([]);
    const [bookState, setBookState] = useState('');
    const [showCommentModal, setShowCommentModal] = useState(false);


    const handleShowCommentModal = () => {
        if (!isSignedIn) {
            setShowModal(true);
        } else {
            setShowCommentModal(true);
        }
    };

    const handleCloseCommentModal = () => {
        setShowCommentModal(false);
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const deleteCommentUrl = `http://43.201.231.40:8080/comment/${commentId}`;
            await axios.delete(deleteCommentUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const updatedComments = comments.filter(comment => comment.id !== commentId);
            setComments(updatedComments);
            console.log('Comment deleted successfully');
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const handleEditComment = async (commentId, editedContent) => {
        try {
            const editCommentUrl = `http://43.201.231.40:8080/comment/${commentId}`;
            const response = await axios.patch(
                editCommentUrl,
                { content: editedContent },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            const updatedComments = comments.map(comment => {
                if (comment.id === commentId) {
                    return { ...comment, content: editedContent };
                }
                return comment;
            });
            setComments(updatedComments);
            console.log('Comment edited successfully:', response.data);
        } catch (error) {
            console.error('Failed to edit comment:', error);
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

        const likedCommentsFromStorage = JSON.parse(localStorage.getItem('likedComments'));
        if (likedCommentsFromStorage) {
            setLikedComments(likedCommentsFromStorage);
        }

        fetchBookDetails();
        fetchRatings();
        fetchComments();
    }, [isbn]);

    useEffect(() => {
        localStorage.setItem('likedComments', JSON.stringify(likedComments));
    }, [likedComments]);

    useEffect(() => {
        const fetchMemberInfo = async () => {
            try {
                const commentsWithMemberInfo = await Promise.all(
                    comments.map(async (comment) => {
                        const memberInfoUrl = `http://43.201.231.40:8080/members/${comment.memberId}`;
                        const memberResponse = await fetch(memberInfoUrl, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        });
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

    const handleRatingSubmit = async (ratingValue) => {
        if (!isSignedIn) {
            setShowModal(true);
            return;
        }
    
        const existingRating = ratings.find(rating => rating.memberId === memberId);
    
        if (existingRating && ratingValue === existingRating.score) {
            // 같은 평점 값 클릭 시 평점 삭제
            const deleteRatingUrl = `http://43.201.231.40:8080/star/${existingRating.id}`;
            let token = accessToken;
    
            try {
                await axios.delete(deleteRatingUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                const updatedRatings = ratings.filter(rating => rating.id !== existingRating.id);
                setRatings(updatedRatings);
                setUserRating(0); // 사용자 평점 초기화
                console.log('Rating deleted successfully');
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    try {
                        token = await refreshAccessToken();
                        await axios.delete(deleteRatingUrl, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
    
                        const updatedRatings = ratings.filter(rating => rating.id !== existingRating.id);
                        setRatings(updatedRatings);
                        setUserRating(0); // 사용자 평점 초기화
                        console.log('Rating deleted successfully');
                    } catch (refreshError) {
                        console.error('Error:', refreshError);
                    }
                } else {
                    console.error('Error:', error);
                }
            }
        } else {
            // 다른 평점 값 클릭 시 평점 제출
            const submitRating = async () => {
                let token = accessToken;
    
                if (existingRating) {
                    const patchRatingUrl = `http://43.201.231.40:8080/star/${existingRating.id}`;
                    try {
                        const response = await axios.patch(patchRatingUrl, { score: ratingValue }, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });
    
                        const updatedRatings = ratings.map(rating => {
                            if (rating.id === existingRating.id) {
                                return { ...rating, score: ratingValue };
                            }
                            return rating;
                        });
    
                        setRatings(updatedRatings);
                        console.log('Rating updated successfully:', response.data);
                    } catch (error) {
                        if (error.response && error.response.status === 401) {
                            try {
                                token = await refreshAccessToken();
                                const response = await axios.patch(patchRatingUrl, { score: ratingValue }, {
                                    headers: {
                                        Authorization: `Bearer ${token}`
                                    }
                                });
    
                                const updatedRatings = ratings.map(rating => {
                                    if (rating.id === existingRating.id) {
                                        return { ...rating, score: ratingValue };
                                    }
                                    return rating;
                                });
    
                                setRatings(updatedRatings);
                                console.log('Rating updated successfully:', response.data);
                            } catch (refreshError) {
                                console.error('Error:', refreshError);
                            }
                        } else {
                            console.error('Error:', error.response ? error.response.data : error.message);
                        }
                    }
                } else {
                    const ratingsUrl = `http://43.201.231.40:8080/star/new`;
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
    
                        setRatings([...ratings, { id: response.data.id, score: ratingValue, comment: '' }]);
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
    
                                setRatings([...ratings, { id: response.data.id, score: ratingValue, comment: '' }]);
                                console.log('Rating submitted successfully:', response.data);
                            } catch (refreshError) {
                                console.error('Error:', refreshError);
                            }
                        } else {
                            console.error('Error:', error.response ? error.response.data : error.message);
                        }
                    }
                }
            };
    
            try {
                await submitRating();
                setUserRating(ratingValue);
                console.log(`Rating submitted: ${ratingValue} stars`);
            } catch (error) {
                console.error('Failed to submit rating:', error);
            }
        }
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

    

    const handleCommentSubmit = async () => {
        if (!isSignedIn) {
            setShowModal(true);
            return;
        }

        if (!newComment.trim()) {
            console.error('빈 코멘트는 제출할 수 없습니다.');
            return;
        }

        try {
            const commentUrl = `http://43.201.231.40:8080/comment/new`;
            const response = await axios.post(
                commentUrl,
                {
                    isbn,
                    memberId,
                    content: newComment
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            setComments([...comments, { id: response.data.id, content: newComment, memberId, memberName: '내 이름' }]);
            setNewComment('');
            console.log('Comment submitted successfully:', response.data);
        } catch (error) {
            console.error('Failed to submit comment:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleShowAllComments = () => {
        setShowAllCommentsModal(true);
    };

    const handleCloseAllCommentsModal = () => {
        setShowAllCommentsModal(false);
    };

    const handleLike = async (commentId, isLiked) => {
        if (!isSignedIn) {
            setShowModal(true);
            return;
        }

        try {
            const action = isLiked ? 'decrease' : 'increase';
            const likeUrl = `http://43.201.231.40:8080/comment/${commentId}/member/${memberId}/like/${action}`;
            const response = await axios.post(
                likeUrl,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            const updatedComments = comments.map(comment => {
                if (comment.id === commentId) {
                    const newLikes = isLiked ? (comment.like_count || 0) - 1 : (comment.like_count || 0) + 1;
                    return { ...comment, like_count: newLikes, liked: !isLiked };
                }
                return comment;
            });
            setComments(updatedComments);

            const updatedLikedComments = isLiked 
                ? likedComments.filter(id => id !== commentId)
                : [...likedComments, commentId];
            
            setLikedComments(updatedLikedComments);
            localStorage.setItem('likedComments', JSON.stringify(updatedLikedComments));

            console.log(`좋아요 ${isLiked ? '취소' : '요청'} 성공:`, response.data);
        } catch (error) {
            console.error(`좋아요 ${isLiked ? '취소' : '요청'} 에러:`, error);
        }
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
                <div className='BookState'>
                    <BookState memberId={memberId} isbn={book.isbn13} />
                </div>

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
    {isSignedIn && <button className="comment-button" onClick={() => setShowCommentModal(true)}>👉 코멘트 달기 </button>} {/* 로그인한 사용자에게만 보이도록 변경 */}
    {comments && comments.length > 0 ? (
        comments.slice(0, visibleComments).map((comment, index) => {
            return (
            <div key={index} className="comment-box">
                <CommentBox
                    comment={comment}
                    onEdit={handleEditComment}
                    onDelete={handleDeleteComment}
                    isSignedIn={isSignedIn}
                />
                <div className="like-section">
                    <button className={`like-button ${likedComments.includes(comment.id) ? 'heart-active' : ''}`} onClick={() => handleLike(comment.id, likedComments.includes(comment.id))}>
                        <i className={`fas fa-heart ${likedComments.includes(comment.id) ? 'liked' : ''}`}></i>
                    </button>
                </div>
            </div>
        )})
    ) : (
        <div className="comment-container01">
            코멘트가 없습니다.
        </div>
    )}

        {comments.length > visibleComments && (
            <button className="more-button" onClick={handleShowAllComments}>더 보기</button>
        )}
    </div>
                {showCommentModal && <CommentModal onClose={handleCloseCommentModal} accessToken={accessToken} isbn={isbn} memberId={memberId} />}
            </div>
            {showModal && <LoginModal onClose={handleCloseModal} />}
            {showAllCommentsModal && <CommentPage comments={comments} onClose={handleCloseAllCommentsModal} />}
        </div>
    );
};

export default BookDetail;
