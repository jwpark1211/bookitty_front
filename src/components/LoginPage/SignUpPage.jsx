import React, { useState } from "react";
import logo from './logo.svg';
import './SignUpPage.css';
import axios from 'axios';

const SignUpPage = ({ setIsSignIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [gender, setGender] = useState(null);
    const [error, setError] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isCheckEmailFirst, setIsCheckEmailFirst] = useState(false);

    const handleGenderClick = (selectedGender) => {
        setGender(selectedGender);
    };

    const handleSignUp = async () => {
        if (!isCheckEmailFirst || !isEmailValid || password !== confirmPassword) {
            return;
        }

        try {
            const response = await axios.post("http://43.201.231.40:8080/members/new", {
                email,
                password,
                name,
                birthdate,
                gender
            });
            if (!response.data.success) {
                throw new Error('회원가입에 실패했습니다.');
            }
            alert("회원가입이 완료되었습니다!");
            setIsSignIn(true); // 로그인 상태로 변경
        } catch (error) {
            console.error("회원가입 오류:", error);
            setError("회원가입에 실패했습니다.");
        }
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
    
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailRegex.test(newEmail)) {
            setIsEmailValid(true);
            setIsCheckEmailFirst(false);
            setError(""); 
        } else {
            setIsEmailValid(false);
            setIsCheckEmailFirst(false);
            setError("올바른 이메일 형식이 아닙니다."); 
        }
    };
    

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
    
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,16}$/; 
        if (!passwordRegex.test(newPassword)) {
            setError("비밀번호는 영문자와 숫자의 조합이며 16자 이내이어야 합니다.");
        } else {
            setError(""); 
        }
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
        try {
            const response = await axios.post(`http://43.201.231.40:8080/members/email/${email}/unique`, {
                email,
            });
            const data = response.data;
            if (data.true) {
                setIsEmailValid(true);
                setIsCheckEmailFirst(true);
                setError("");
            } else {
                setIsEmailValid(false);
                setError("이미 등록된 이메일입니다.");
            }
        } catch (error) {
            console.error('Error checking email availability:', error);
            setError("이메일 중복 확인 중 오류가 발생했습니다.");
        }
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
                <button onClick={handleSignUp} className="signup-button01">회원가입</button>
            </div>
        </div>
    );
}

export default SignUpPage;

