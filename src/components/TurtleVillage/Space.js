import './css/Space.css';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Space() {
    return (
        <div>
            <div className='menu'>
                <p className='pageName'>우주</p>
                <Link to='/Login'><p className='logOut'>로그아웃</p></Link>
                <div className='DeepSea_Background'>
                    <img src='/Space.png' className='UnderTheSea_Image' alt='Space'></img>
                </div>
            </div>
            {/* 여기에 DeepSea 컴포넌트의 주요 내용을 추가하세요 */}
        </div>
    )
}