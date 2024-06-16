import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BookDetail.css';
import StarRating from './StarRating';
import LoginModal from './LoginModal';
import BookState from './BookState';
import CommentSection from './CommentSection';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const BookDetail = () => {
    const { isbn } = useParams();
    const [book, setBook] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const accessToken = sessionStorage.getItem('accessToken');
    const refreshToken = sessionStorage.getItem('refreshToken');
    const memberId = sessionStorage.getItem('memberId');
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
        fetchBookDetails();
    }, [isbn]);


    const handleCloseModal = () => {
        setShowModal(false);
    };


    if (!book) {
        return null;
    }

    return (
        <div className="book-detail">
            <div className="book-info-details">
                <div className="book-image">
                    {book.cover && <img src={book.cover} alt={book.title} />}
                </div>
                <div className="book-info">
                    <h1 className="book-title01">{book.title}</h1>
                    <div className="book-state-button">
                        <BookState memberId={memberId} isbn={book.isbn13} />
                    </div>
                    <h2 className="book-author01">{book.author}</h2>
                    <h3 className="book-pubDate">{book.pubDate}</h3>
                    <h4 className="book-description">{book.description}</h4>
                    <h5 className="book-price">정가 {book.priceStandard}원</h5>
                    <a href={book.link} className="book-link" target="_blank" rel="noopener noreferrer">알라딘에서 보기</a>
                </div>
            </div>
            <div className="book-ratings">
                <h3>평점</h3>
                <StarRating 
                    isbn={book.isbn13} 
                    memberId={memberId} 
                    accessToken={accessToken} 
                    refreshToken={refreshToken} 
                    isSignedIn={isSignedIn} 
                />
            </div>
            <div className="comment-section">
                <CommentSection 
                    isbn={isbn}
                    accessToken={accessToken}
                    memberId={memberId}
                    isSignedIn={isSignedIn}
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            {showModal && <LoginModal onClose={handleCloseModal} />}
            </div>
            {showModal && <LoginModal onClose={handleCloseModal} />}
        </div>
    );
};

export default BookDetail;
