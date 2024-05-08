import React, { useState } from 'react';
import logo from './logo.svg';
import './LoginPage.css';

const LoginPage = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    return (
        <div className="login-page">
            <div className="logo-container_1">
                <img src={logo} alt="로고" className="logo" />
            </div>
            <div className="login-text">로그인</div>
            <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="이메일을 입력하세요."
                className="email-input"
            />
            <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="비밀번호를 입력하세요."
                className="password-input01"
            />
            {error && <p className="error-message white">{error}</p>} {/* 에러 발생 시 글씨 색을 하얀색으로 */}
            <button onClick={handleLogin} className="login-button01">로그인</button>
            <p className="no-account">계정이 없으신가요? <span>&nbsp;</span><a href="/signup">회원가입</a></p>
        </div>
    );
}

export default LoginPage;
