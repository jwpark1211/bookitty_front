import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.svg';
import './header02.css';

const Header02 = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    const loginStatus = sessionStorage.getItem('login');
    if (loginStatus) {
      setIsSignedIn(true);
      setName(sessionStorage.getItem('name') || '');
      setProfileImage(sessionStorage.getItem('profileImg') || '');
    }
  }, []);

  return (
    <header className='header02'>
      <div className="logo-container">
        <Link to="/" className="logo-link">
          <img src={logo} alt="로고" className="logo" />
        </Link>
      </div>
      <div className="user-container">
        {isSignedIn && name && profileImage && (
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
