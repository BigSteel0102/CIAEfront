import './css/Home.css';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div>
            <div className='menu'>
                <p className='CIAEIntro'>안녕하세요, 저희는 CIAE입니다.</p>
                <img className='Baby' src='/CIAE_logo.png' alt='ciae'></img>
                <p className='pageName'>홈 화면</p>
                <Link to='/login'><p className='logOut'>로그아웃</p></Link>
            </div>
        </div>
    );
}