import './css/Forest.css';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Forest() {
    return (
        <div>
            <div className='menu'>
                <p className='pageName'>숲속마을</p>
                <Link to='/Login'><p className='logOut'>로그아웃</p></Link>
                <div className='DeepSea_Background'>
                    <img src='/Forest.png' className='UnderTheSea_Image' alt='Forest'></img>
                </div>
            </div>
            {/* 여기에 DeepSea 컴포넌트의 주요 내용을 추가하세요 */}
        </div>
    );
}
