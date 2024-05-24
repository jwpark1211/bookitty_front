import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import LoginModal from './LoginModal';
import axios from 'axios';

const BookRating = ({ isLoggedIn }) => {
  const [rating, setRating] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleRatingChange = (value) => {
    if (isLoggedIn) {
      setRating(value);
      submitRating(value);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const submitRating = (value) => {
    axios.post('http://43.201.231.40:8080/star/new', { rating: value })
      .then(response => {
        console.log('Rating submitted successfully:', response.data);
      })
      .catch(error => {
        console.error('Error submitting rating:', error);
      });
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <p>You are logged in. Rate this book:</p>
          <StarRating value={rating} onChange={handleRatingChange} />
        </div>
      ) : (
        <p>Please login to rate this book</p>
      )}
      {showLoginModal && !isLoggedIn && <LoginModal onClose={handleCloseLoginModal} />}
    </div>
  );
};

export default BookRating;
