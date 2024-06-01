import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.svg';
import './header02.css';

const Header02 = ({ isSignedIn, name, profileImage }) => {
  console.log("이름 : ", name);
  return (
    <header className='header02'>
      <div className="logo-container">
        <Link to="/" className="logo-link">
          <img src={logo} alt="로고" className="logo" />
        </Link>
      </div>
      <div className="user-container">
        {isSignedIn && (
          <div className="user-profile">
            <img src={profileImage} alt="프로필 사진" className="profile-pic" width="30" height="30" />
            <Link to="/mypage" className="user-nickname">
              {name} 님
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header02;
