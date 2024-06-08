import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.svg';
import './header02.css';
import axiosInstance from '../LoginPage/axiosInstance';

const Header02 = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemberInfo = async () => {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) return;

      try {
        const response = await axiosInstance.get('/members/me');
        const memberInfo = response.data.data; // 수정: data 속성 가져오기
        setIsSignedIn(true);
        setName(memberInfo.name);
        setProfileImage(memberInfo.profileImg);
      } catch (error) {
        console.error('회원 정보 가져오기 실패:', error);
      }
    };

    fetchMemberInfo();
  }, []);

  const handleLogout = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    const refreshToken = sessionStorage.getItem('refreshToken');

    console.log("AccessToken : ", accessToken);

    try {
      await axiosInstance.post('/members/logout', {
        accessToken: accessToken,
        refreshToken: refreshToken
      });

      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('login');
      sessionStorage.removeItem('name');
      sessionStorage.removeItem('profileImg');

      setIsSignedIn(false);
      setName('');
      setProfileImage('');
      navigate('/'); // 로그아웃 후 메인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
    }
  };

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
            <button onClick={handleLogout} className="logout-button">로그아웃</button>
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
