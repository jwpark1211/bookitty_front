import React, { useState } from 'react';
import './StarRating.css';
import LoginModal from './LoginModal';

const StarRating = ({ value, setValue, onRatingSubmit, isSignedIn }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const stars = [1, 2, 3, 4, 5];

    

    const handleClick = (e) => {
        const clickedStar = Number(e.target.value);

        if (isSignedIn) {
            if (clickedStar === value) {
                setValue(0);
                onRatingSubmit(0); // 0을 전달하여 평점 삭제
            } else {
                setValue(clickedStar);
                onRatingSubmit(clickedStar);
            }
        } else {
            setShowLoginModal(true);
        }
    }

    return (
        <div className="star-rating">
            {stars.map((star) => {
                const isChecked = star <= value;
                return(
                    <React.Fragment key={star}>
                    <input
                        type="radio"
                        id={`star${star}`}
                        name="rating"
                        value={star}
                        checked={isChecked}
                        onClick={handleClick}
                    />
                    <label htmlFor={`star${star}`} style={isChecked ? {color:"#f90"}:{color:"#ccc"}}/>
                </React.Fragment>
                )
            })}
            {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
        </div>
    );
};

export default StarRating;
