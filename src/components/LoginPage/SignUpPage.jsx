import React, { useState } from "react";
import logo from './logo.svg';
import './SignUpPage.css';

const SignUpPage = ({ setIsSignIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [gender, setGender] = useState(null);
    const [error, setError] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);

    const handleGenderClick = (selectedGender) => {
        setGender(selectedGender);
    };

    const handleSignIn = async () => {
        if (!isEmailValid) {
            setError("이메일 중복 확인을 해주세요.");
            return;
        }

    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setIsEmailValid(false); 
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleBirthdateChange = (e) => {
        setBirthdate(e.target.value);
    };

    const handleCheckEmailAvailability = async () => {
        
    };
    
    return (
        <div className="sign-up-page">
            <div className="logo-container_2">
                <img src={logo} alt="로고" className="logo" />
                <div className="input-container">
                    <label className="label-text">이메일</label>
                    <div className="email-input-container">
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="이메일을 입력"
                            className="email-input01"
                        />
                    </div>
                    <button onClick={handleCheckEmailAvailability} className="check-email-button">중복확인</button>
                    <label className="label-text">이름</label>
                    <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="이름을 입력"
                        className="name-input"
                    />
                </div>
                <div className="input-container02">
                    <label className="label-text02">비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="비밀번호 입력(영문자, 숫자 조합 16자 이내)"
                        className="password-input"
                    />
                    <label className="label-text03">비밀번호 확인</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        placeholder="비밀번호 재입력"
                        className="password-input02"
                    />
                </div>
                <div className="input-container03">
                    <label className="label-text02">생년월일</label>
                    <input
                        type="date"
                        value={birthdate}
                        onChange={handleBirthdateChange}
                        className="birthdate-input"
                    />
                    <label className="label-text03">성별</label>
                    <div className="gender-buttons">
                        <button
                            className={`gender-button ${gender === 'male' ? 'selected' : ''}`}
                            onClick={() => handleGenderClick('male')}
                        >
                            남성
                        </button>
                        <button
                            className={`gender-button ${gender === 'female' ? 'selected' : ''}`}
                            onClick={() => handleGenderClick('female')}
                        >
                            여성
                        </button>
                    </div>
                </div>
                {error && <p className="error-message white">{error}</p>} {/* 에러 발생 시 글씨 색을 하얀색으로 */}
                <button onClick={handleSignIn} className="signup-button01">회원가입</button>
            </div>
        </div>
    );
}

export default SignUpPage;
