import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const BookDetail = () => {
    const { id } = useParams(); // URL에서 베스트셀러 ID를 가져옴
    const [bookDetail, setBookDetail] = useState(null);

    useEffect(() => {
        fetch(`http://43.201.231.40:8080/open/bestseller`, {
            method: 'GET',
            headers: {
                'Accept': '*/*'
            }
        })
            .then(response => response.json())
            .then(data => {
                setBookDetail(data); 
            })
            .catch(error => console.error('Error fetching book detail:', error));
    }, [id]); 
    
    return (
        <div>
            {bookDetail ? (
                <div>
                    <h5>{bookDetail.title}</h5>
                    <p>{bookDetail.author}</p>
                    <p>{bookDetail.link}</p>
                    <p>{bookDetail.cover}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default BookDetail;