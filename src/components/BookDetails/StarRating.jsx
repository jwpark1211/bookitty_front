import React, { useState } from 'react';
import './StarRating.css';
import LoginModal from './LoginModal';

const StarRating = ({ value,setValue, onRatingSubmit, isSignedIn }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const stars = [1, 2, 3, 4, 5];

  const handleChange = (event) => {
    if (isSignedIn) {
      onRatingSubmit(Number(event.target.value));
    } else {
      setShowLoginModal(true);
    }
  };

  const handleClick = (e) => {
    setValue(e.target.value);
  }

  return (
    <div className="star-rating">
      {stars.map((star) => (
        <React.Fragment key={star}>
          <input
            type="radio"
            id={`star${star}`}
            name="rating"
            value={star}
            checked={star <= value}
            onClick={handleClick}
            onChange={handleChange}
          />
          <label htmlFor={`star${star}`}></label>
        </React.Fragment>
      ))}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
};

export default StarRating;
