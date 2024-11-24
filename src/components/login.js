import './css/login.css';
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './auth/authprovider';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, user } = useContext(AuthContext); // Access login function and user context
  const navigate = useNavigate();

  // Redirect if the user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/Home');
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form from reloading the page
    setErrorMessage(''); // Clear any previous error messages

    try {
      // Call the login function from AuthContext
      await login({ username, password }); // Ensure the keys match the backend's expected payload
      navigate('/Home'); // Redirect on successful login
    } catch (error) {
      // Handle errors more specifically
      if (error.response) {
        setErrorMessage(error.response.data.message || '잘못된 이메일 또는 비밀번호');
      } else if (error.request) {
        setErrorMessage('네트워크 오류');
      } else {
        setErrorMessage('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div>
      <Link to="/Home">
        <img className="CIAELogo" src="/CIAE_logo.png" alt="CIAE" />
      </Link>
      <div className="won"></div>
      <div className="Logi">
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          <input
            type="text"
            name="username"
            placeholder="닉네임"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="button">
            로그인
          </button>
        </form>
        <p className="ifNoAccount">아직 계정이 없다면?</p>
        <p className="Join">회원가입</p>
      </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}
