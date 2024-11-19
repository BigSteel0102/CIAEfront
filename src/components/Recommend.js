import './css/Recommend.css';
import React, { useState } from 'react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { Link } from 'react-router-dom';

// 버튼 컴포넌트 정의
function Button({ name, src, alt, onClick }) {
    return <Link to='/Learning'><img src={src} className={name} alt={alt} onClick={onClick} /></Link>; // 이미지 버튼 생성
}

// PDF 문서 보기 및 탐색을 위한 컴포넌트
function Reading() {
    const [mainBookSrc, setMainBookSrc] = useState(process.env.PUBLIC_URL + '/cover1.png'); // MainBook 이미지 경로
    const [recommendBooks, setRecommendBooks] = useState([
        process.env.PUBLIC_URL + '/cover2.png',
        process.env.PUBLIC_URL + '/cover3.png',
        process.env.PUBLIC_URL + '/cover4.png'
    ]);

    // 추천 책을 클릭할 때 이미지를 교체하는 함수
    const handleBookClick = (index) => {
        const newRecommendBooks = [...recommendBooks];
        const clickedBook = newRecommendBooks[index];
        
        // MainBook 이미지와 클릭한 RecommendBook 이미지를 교체
        newRecommendBooks[index] = mainBookSrc;
        setMainBookSrc(clickedBook);
        setRecommendBooks(newRecommendBooks);
    };

    return (
        <>  
            <Link to='/Home'>
                <img className='CIAELogo' src={process.env.PUBLIC_URL + '/CIAE로고 2.png'} alt='CIAE'/>
            </Link>
            <div className='RecommendBar'>
                <p className='NewBookMent'>다른 책을 읽고 싶다면?</p>
                {recommendBooks.map((src, index) => (
                    <img 
                        key={index} 
                        className={`RecommendBook${index + 1}`} 
                        src={src} 
                        alt={`book${index + 1}`}
                        onClick={() => handleBookClick(index)} // 클릭 이벤트 연결
                    />
                ))}
            </div>
            <img className='MainBook' src={mainBookSrc} alt='Rabbit and Turtle'/>
            <p className='Irecommend'>읽을 만한 책을 추천해줄게요!</p>
            <Button
                name='Reading'
                src={process.env.PUBLIC_URL + '/Reading.png'}
                alt="Left navigation button" // 왼쪽 화살표 버튼으로 이전 페이지로 이동
            />
        </>
    );
}

export default function Learning() {
    return (
        <div>
            <Reading />
        </div>
    );
}
