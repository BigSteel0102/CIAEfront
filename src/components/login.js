import './css/login.css';
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './/auth/authprovider';

// Form Component
function Form(props) {
  return (
      <input 
        className={props.type}
        type={props.type} 
        name={props.name}
        value={props.value}
        placeholder={props.label}
        onChange={props.onChange}
      />
  );
}

// Button Component for Login
function Button(props) {
  return (
    <button onClick={props.onClick} className='button'>로그인</button>
  );
}


// Main Login Component
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/Home')
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      await login({ email, password });
      navigate('/Home');
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || '잘못된 이메일 또는 비밀번호');
      } else if (error.request) {
        setErrorMessage('네트워크 오류');
      } else {
        setErrorMessage('unknown error');
      }
    }
  };

  return (
    <div>
      <Link to='/Home'><img className='CIAELogo' src='/CIAE_logo.png' alt='CIAE'/></Link>
      <div className='won'></div>
      <div className='Logi'>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type='email' 
            name='email'
            label='닉네임'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type='password' 
            name='password'
            label='비밀번호'
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />       
          <button type="submit" className="button">로그인</button>
        </form>
        <p className='ifNoAccount'>아직 계정이 없다면?</p>
        <p className='Join'>회원가입</p>
      </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}