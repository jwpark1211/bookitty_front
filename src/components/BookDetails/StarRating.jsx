import React, { useState } from 'react';
import './StarRating.css';
import LoginModal from './LoginModal';
import CommentBox from './CommentBox';

const StarRating = ({ value, setValue, onRatingSubmit, isSignedIn }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const stars = [1, 2, 3, 4, 5];

    const handleChange = (event, star) => {
        if (isSignedIn) {
            if (star === value) {
                // 현재 값과 같은 값을 선택했을 때는 평점을 삭제한다.
                setValue(0);
                onRatingSubmit(0); // 평점 삭제를 위해 0을 전달
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
