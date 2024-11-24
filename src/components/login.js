import './css/Login.css';
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Form Component
function Form(props) {
  return (
    <form>
      <input 
        className={props.type}
        type={props.type} 
        name={props.name}
        value={props.value}
        placeholder={props.label}
        onChange={props.onChange}
      />
    </form>
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post('https://your-backend-url.com/api/login', {
        email,
        password,
      });

      console.log('login successful!', response.data);
      localStorage.setItem('token', response.data.token);

      alert('login succeed!');
    } catch (error) {
      console.error('login failed:', error);
      setErrorMessage('비밀번호 혹은 아이디가 일치하지 않습니다.');
    }
  };

  return (
    <div>
      <Link to='/Home'><img className='CIAELogo' src='/CIAE_logo.png' alt='CIAE'/></Link>
      <div className='won'></div>
      <div className='Logi'>
        <Form
          type='email' 
          name='email'
          label='닉네임'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Form
          type='password' 
          name='password'
          label='비밀번호'
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />       
        <Button name='로그인' onClick={handleSubmit} />
        <p className='ifNoAccount'>아직 계정이 없다면?</p>
        <p className='Join'>회원가입</p>
      </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}