import React, { useState } from 'react';
import './StarRating.css';
import LoginModal from './LoginModal';

const StarRating = ({ value, setValue, onRatingSubmit, isSignedIn }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const stars = [1, 2, 3, 4, 5];

    const handleChange = (event, star) => {
        if (isSignedIn) {
            if (star === value) {
                // If the same value is selected again, remove the rating.
                setValue(0);
                onRatingSubmit(0); // Pass 0 to remove the rating
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
