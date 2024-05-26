import React, { useState } from 'react';
import './StarRating.css';
import LoginModal from './LoginModal';

const StarRating = ({ value, setValue, onRatingSubmit, onDeleteRating, isSignedIn }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const stars = [1, 2, 3, 4, 5];

    const handleChange = (event, star) => {
      const newValue = Number(event.target.value);
      if (isSignedIn) {
          if (newValue === value) {
              onDeleteRating(newValue);
          } else {
              setValue(star);
              onRatingSubmit(star);
          }
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
                        onChange={(event) => handleChange(event, star)}
                    />
                    <label htmlFor={`star${star}`} className={star <= value ? 'filled' : ''}></label>
                </React.Fragment>
            ))}
            {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
        </div>
    );
};

export default StarRating;
