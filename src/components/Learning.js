import './css/Learning.css';
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { Link } from 'react-router-dom'; 

async function callOpenAI(messages, setAiResponse) {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    const url = 'https://api.openai.com/v1/chat/completions';

    const data = {
        model: "gpt-4o",
        messages: messages,
        max_tokens: 3000,
        temperature: 0.6,
        stream: false
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const jsonResponse = await response.json();
        const newMessage = jsonResponse.choices[0].message.content;
        
        console.log('OpenAI 응답:', newMessage); // 응답 내용 확인

        setAiResponse(newMessage); // AI 응답 상태 업데이트
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        setAiResponse('API 호출 중 오류가 발생했습니다.');
    }
}

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

function Button({ name, src, alt, onClick }) {
    return <img src={src} className={name} alt={alt} onClick={onClick} />;
}

function Reading({ onAITrigger }) {
    const [pageNumber, setPageNumber] = useState(1);
    const numPages = 9;

    const goToPrevPage = () => {
        if (pageNumber > 2) setPageNumber(pageNumber - 2);
    };

    const goToNextPage = () => {
        if (pageNumber + 1 < numPages) {
            setPageNumber(pageNumber + 2);
        } else {
            onAITrigger();
        }
    };

    return (
        <>
            <Button
                name='Learning_Button_Left'
                src='/Left.png'
                alt="Left navigation button"
                onClick={goToPrevPage}
            />
            <div className='Learning_Book_Left'>
                <Document file='/RabbitAndTurtle.pdf' className="pdf-document">
                    <Page pageNumber={pageNumber} renderTextLayer={false} className="pdf-page"/>
                </Document>
            </div>
            <div className='Learning_Book_Right'>
                <Document file='/RabbitAndTurtle.pdf' className="pdf-document">
                    <Page pageNumber={pageNumber + 1} renderTextLayer={false} className="pdf-page"/>
                </Document>
            </div>
            <Button
                name='Learning_Button_Right'
                src='/Right.png'
                alt="Right navigation button"
                onClick={goToNextPage}
            />
        </>
    );
}

function Ai() {
    const [messages, setMessages] = useState([
        { "role": "system", "content": 'Adopt a conversational tone and provide empathetic responses to connect deeply with the user\'s emotions. ...' },
        { "role": "assistant", "content": '안녕! 만나서 반가워. 😋 오늘 "토끼와 거북이"에 대해 얘기해볼까 해. 이 이야기 속에서 토끼는 처음에 자신감이 넘치지만, 결국엔 방심해서 경주에서 지게 되잖아. 토끼가 그 순간 느꼈을 좌절감이나 실망감을 생각해보면, 너도 비슷한 감정을 느껴본 적 있어? 어떤 상황 이었는지 나눠줄 수 있어?' }
    ]);
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [aiResponse, setAiResponse] = useState('안녕! 만나서 반가워. 😋 오늘 "토끼와 거북이"에 대해 얘기해볼까 해. 이 이야기 속에서 토끼는 처음에 자신감이 넘치지만, 결국엔 방심해서 경주에서 지게 되잖아. 토끼가 그 순간 느꼈을 좌절감이나 실망감을 생각해보면, 너도 비슷한 감정을 느껴본 적 있어? 어떤 상황 이었는지 나눠줄 수 있어?');
    const [showContinue, setShowContinue] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [showHomeButton, setShowHomeButton] = useState(false);
    const [stopCount, setStopCount] = useState(0);

    const startListening = () => {
        setIsListening(true);
        setShowContinue(false);
        setIsDone(false);
    };

    const handleStop = async () => {
        setIsListening(false);
        setShowContinue(true);
        setStopCount(stopCount + 1);

        const userMessage = { "role": "user", "content": transcript };
        const updatedMessages = [...messages, userMessage];

        await callOpenAI(updatedMessages, (response) => {
            console.log('AI 응답 상태 업데이트 중:', response); // 업데이트 전에 응답 출력
            setAiResponse(response); // AI 응답 상태 설정
            setMessages([...updatedMessages,{ "role": "assistant", "content": response }]);
        });
        //git feature

        setTranscript('');
    };

    const handleDone = () => {
        setAiResponse('');
        setTranscript('');
        setIsListening(false);
        setShowContinue(false);
        setIsDone(true);
        setShowHomeButton(true);
    };

    useEffect(() => {
        console.log('현재 aiResponse 상태:', aiResponse); // 상태 업데이트 확인
    }, [aiResponse]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const speechToText = event.results[0][0].transcript;
            setTranscript(speechToText);
        };

        recognition.onerror = (event) => {
            console.error('음성 인식 오류:', event.error);
        };

        if (isListening) recognition.start();
        else recognition.stop();

        return () => recognition.stop();
    }, [isListening]);

    if (showHomeButton) {
        return (
            <div className='Learning_Container active'>
                <div className='LearningWon active'>
                    <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <h1 className='MessageForUser'>This is the End of our Test!</h1>
                        <a href="/Home">
                            <button className='Home_Button'>Home</button>
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`Learning_Container active ${isDone ? 'completed' : ''}`}>
            <div className='LearningWon active'>
                <img src='/Turtle_Right.png' alt='AI_Chat_Bot' className='AI_ChatBot_Image'/>
                <img src='/UserProfile.png' alt='AI_Chat_User3' className='AI_Chat_User_Image'/>
                {!isListening && !showContinue && (
                    <img src='/AnswerStart.png' alt='Start' className='AnswerStart' onClick={startListening}/>
                )}
                {isListening && (
                    <img src='/Stop.png' alt='Stop' className='AnswerStart' onClick={handleStop}/>
                )}
                {showContinue && (
                    <img src='/ContinueStart.png' alt='continue' className='Continue' onClick={() => { setShowContinue(false); startListening(); }}/>
                )}
                {stopCount >= 2 && (
                    <img src='/Done.png' onClick={handleDone} className='Done' alt='Done'/>
                )}
                <div className='AI_Question'>
                    <h3>{aiResponse}</h3> {/* AI 응답 출력 */}
                </div>
                <div className='User'>
                    <p>{transcript}</p>
                </div>
            </div>
        </div>
    );
}

export default function Learning() {
    const [showAI, setShowAI] = useState(false);

    const handleAITrigger = () => { 
        setShowAI(true);
    };

    return (
        <div>
            <Link to='/Home'><img className='CIAELogo' src='/CIAE_logo.png' alt='CIAE'/></Link>
            {showAI ? (
                <Ai />
            ) : (
                <Reading onAITrigger={handleAITrigger} />
            )}
        </div>
    );
}
