import React, { useState } from 'react';
import './StarRating.css';
import LoginModal from './LoginModal';

const StarRating = ({ value, setValue, onRatingSubmit, isSignedIn }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const stars = [1, 2, 3, 4, 5];

  const handleChange = (event) => {
    const newValue = Number(event.target.value);
    if (isSignedIn) {
      setValue(newValue);
      onRatingSubmit(newValue);
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="star-rating">
      {stars.map((star) => (
        <React.Fragment key={star}>
          <input
            type="radio"
            id={`star${star}`}
            name="rating"
            value={star}
            checked={star === value}
            onChange={handleChange}
          />
          <label htmlFor={`star${star}`} className={star <= value ? 'filled' : ''}></label>
        </React.Fragment>
      ))}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
};

export default StarRating;
