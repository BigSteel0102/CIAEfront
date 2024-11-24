import './css/Home.css';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Link 컴포넌트 가져오기
import { AuthContext} from './auth/authprovider';

export default function Home() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Call the logout function from AuthProvider
        navigate('/Login'); // Redirect to login page
    };

    return (
        <div>
            <div className='menu'>
                <p className='helloWorld'>즐거운 독서에서 <br/>
                   아이들의 행복한 일상까지</p>
                <p className='CIAEIntro'>안녕하세요, 저희는 CIAE입니다.</p>
                <img className='Baby' src='/baby.png' alt='baby'></img>
                <p className='SiteIntro'>책을 읽고 AI 캐릭터와 대화를 나눌 수 있도록 ADHD 학생 <br/>
                    들에게 특화된 웹페이지를 개발했습니다.
                </p>
                <p className='question1'>ADHD 학생에게 왜 독서가 중요한가요?</p>
                <p className='answer'> &nbsp;&nbsp;책을 읽으면서 한 문장씩 따라가다 보면, 집중력을 유지하 <br/>
                    는 연습을 할 수 있습니다.그리고 책 속 인물들의 감정과 이 <br/>
                    야기를 이해하면서, 다른 사람의 입장까지도 이해하는 힘을 <br />
                    기를 수 있습니다.</p>
                <p className='How'>어떻게 도와주나요?</p>
                <p className='LikeThis'>  &nbsp;&nbsp;독서를 하면서 챕터가 끝날 때마다 AI와 대화할 수 있는 <br/>
                기능을 제공합니다. 단순히 책을 읽기만 하고 끝나는 게 아<br/>
                니라, 학생들이 스스로 생각하고 표현하는 연습을 하도록 <br/>
                돕기 위함입니다.<br/><br/>
                &nbsp;&nbsp;독서치료의 체계적인 원리를 토대로, 책 내용에 대해 함<br/>
                께 이야기하면서 어려운 감정을 풀어내고 마음의 안정을<br/>
                 찾을 수 있는 기회를 줍니다. 이런 경험들이 모여 학교나 <br/>
                 사회생활에서도 ADHD 학생들이 자립할 수 있는 힘을 키<br/>
                 워주고자 합니다.
                </p>
                <img className='AIImg' src='/AIImg.png' alt='IntroduceImg'></img>
                <img className='turtleisHere' src='/turtle.png' alt='turtleSayingHi'></img>
                <p className='StartYeah'>읽는 재미를 느끼고, 생각하는 힘을 기를 시간! <br/>
                시작해볼까요?</p>
                <p className='pageName'>홈 화면</p>
                <p className='logOut' onClick={handleLogout} style={{ cursor: 'pointer', color: 'black' }}>로그아웃</p>
            </div>
        </div>
    );
}