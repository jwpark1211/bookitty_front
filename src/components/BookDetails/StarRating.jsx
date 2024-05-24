import React, { useState } from 'react';
import './StarRating.css';
import LoginModal from './LoginModal'; // Import your LoginModal component

const StarRating = ({ value, onChange, isLoggedIn }) => {
  const [showLoginModal, setShowLoginModal] = useState(false); // State to manage login modal visibility
  const stars = [1, 2, 3, 4, 5];

  const handleChange = (event) => {
    if (isLoggedIn) {
      onChange(Number(event.target.value));
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
            checked={star === Math.floor(value) || star === Math.ceil(value)}
            onChange={handleChange}
          />
          <label htmlFor={`star${star}`}></label>
        </React.Fragment>
      ))}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />} {/* Render the login modal */}
    </div>
  );
};

export default StarRating;
