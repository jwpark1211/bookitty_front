import React from 'react';
import logo from './logo.svg';
import './header.css';
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className='header'>
            <div className="logo-container">
                <img src={logo} alt="로고" className="logo" />
            </div>
            <div className="button-container">
                <Link to="/login" className="login-button">로그인</Link>
                <Link to="/signup" className='signup-button'>회원가입</Link> 
            </div>
        </header>
    );
}

export default Header;