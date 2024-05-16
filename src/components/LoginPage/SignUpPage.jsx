import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import logo from './logo.svg';
import './SignUpPage.css';
import axios from 'axios';

const SignUpPage = ({ setIsSignIn, setName }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setNameInput] = useState(""); // setNameInput으로 변경
    const [birthdate, setBirthdate] = useState("");
    const [gender, setGender] = useState(null);
    const [error, setError] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isCheckEmailFirst, setIsCheckEmailFirst] = useState(false);
    const navigate = useNavigate();

    const handleGenderClick = (selectedGender) => {
        setGender(selectedGender);
    };

    const handleSignUp = async () => {
        if (!isCheckEmailFirst || !isEmailValid || password !== confirmPassword) {
            return;
        }
        console.log({
            email,
            password,
            name,
            birthdate,
            gender
        });
        try {
            const response = await axios.post("http://43.201.231.40:8080/members/new", {
                email,
                password,
                name,
                birthdate,
                gender
            });
            console.log(response.data)
            if (!response.data.data.id) {
                throw new Error('회원가입에 실패했습니다.');
            }
            alert("회원가입이 완료되었습니다!");
            setIsSignIn(true); // 로그인 상태로 변경
            setName(name); // 이름 상태 업데이트
            navigate('/login'); // 회원가입 성공 시 로그인 화면으로 이동
        } catch (error) {
            console.error("회원가입 오류:", error);
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
    
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            setError("비밀번호는 대소문자와 특수기호를 포함하여 8자 이상이어야 합니다.");
        } else {
            setError(""); 
        }
    };
    

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleNameChange = (e) => {
        setNameInput(e.target.value);
    };

    const handleBirthdateChange = (e) => {
        setBirthdate(e.target.value);
    };

    const handleCheckEmailAvailability = async () => {
        try {
            const response = await axios.get(`http://43.201.231.40:8080/members/email/${email}/unique`, {
                email,
            });
            const data = response.data;
            if (data.data.unique) {
                setIsEmailValid(true);
                setIsCheckEmailFirst(true);
                setError("사용 가능한 이메일입니다.");
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
                        placeholder="비밀번호 입력(영문자, 숫자, 특수문자 조합 최소 8문자 이내)"
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
                            className={`gender-button ${gender === 'MALE' ? 'selected' : ''}`}
                            onClick={() => handleGenderClick('MALE')}
                        >
                            남성
                        </button>
                        <button
                            className={`gender-button ${gender === 'FEMALE' ? 'selected' : ''}`}
                            onClick={() => handleGenderClick('FEMALE')}
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
