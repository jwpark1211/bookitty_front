import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BookDetail.css'; // Import the CSS file

const BookDetail = () => {
    const { isbn } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        console.log(isbn);
        const apiUrl = `http://43.201.231.40:8080/open/search/book/${isbn}`;
        console.log('요청 보낸 URL:', apiUrl);

        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': '*/*'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('서버 응답이 올바르지 않습니다.');
                }
                return response.json();
            })
            .then(data => {
                console.log('책 정보:', data);
                if (data && data.item && data.item.length > 0) {
                    setBook(data.item[0]); 
                } else {
                    throw new Error('책 정보가 없습니다.');
                }
            })
            .catch(error => console.error('책 정보를 가져오는 중 오류 발생:', error));
    }, [isbn]);

    if (!book) {
        console.log('책 정보가 아직 로드되지 않았습니다.');
        return null;
    }

    console.log('책 정보:', book);

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
            </div>
        </div>
    );
};

export default BookDetail;
