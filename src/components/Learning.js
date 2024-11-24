import './css/Learning.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.mjs`;

function Button({ name, src, alt, onClick }) {
    return <img src={src} className={name} alt={alt} onClick={onClick} />;
}

function PDFSelector({ onPDFSelected }) {
    const handleRadioSelect = (event) => {
        const pdfUrl = event.target.value;
        if (pdfUrl) {
            let triggerPages;
            switch (pdfUrl) {
                case '/verySmall.pdf':
                    triggerPages = [43, 69];
                    break;
                case '/Small.pdf':
                    triggerPages = [11, 19];
                    break;
                case '/Standard.pdf':
                    triggerPages = [7, 8];
                    break;
            }
            onPDFSelected(pdfUrl, triggerPages);
        }
    };

    return (
        <div className="PDFSelector active">
            <h1 className='SelectSizeOfText'>글자수 조절</h1>
            <div className='verySmall'>
                <input className='verySmallRadio' type="radio" id='verySmall' name='Text' value='/verySmall.pdf' onChange={handleRadioSelect} />
                <label className='Text' htmlFor='verySmall'>아주 적게</label>
            </div>
            <div className='Small'> 
                <input className='SmallRadio' type="radio" id='Small' name='Text' value='/Small.pdf' onChange={handleRadioSelect} />
                <label className='Text' htmlFor='Small'>약간 적게</label>
            </div>
            <div className='Standard'>
                <input className='StandardRadio' type="radio" id='Standard' name='Text' value='/Standard.pdf' onChange={handleRadioSelect} />
                <label className='Text' htmlFor='Standard'>&nbsp; &nbsp;기본</label>
            </div>
        </div>
    );
}

function Reading({ onAITrigger, selectedPDF, triggerPages, pageNumber, setPageNumber }) {
    
    const [numPages, setNumPages] = useState(null);

    useEffect(() => {
        const fetchNumPages = async () => {
            try {
                const response = await fetch(selectedPDF);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const arrayBuffer = await response.arrayBuffer();
                const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
                setNumPages(pdf.numPages);
            } catch (error) {
                console.error('PDF 정보를 검색하는 중 오류 발생:', error);
            }
        };

        fetchNumPages();
    }, [selectedPDF]);

    const goToPrevPage = () => {
        if (pageNumber > 2) setPageNumber(pageNumber - 2);
    };

    const goToNextPage = () => {
        if (numPages && pageNumber + 2 <= numPages) {
            const nextPage = pageNumber + 2;
            setPageNumber(nextPage);
            if (triggerPages.includes(nextPage)) {
                onAITrigger(nextPage);
            }
        }
    };

    return (
        <>
            <Button
                name="Learning_Button_Left"
                src="/Left.png"
                alt="왼쪽 네비게이션 버튼"
                onClick={goToPrevPage}
            />
            <div className="Learning_Book_Left">
                <Document file={selectedPDF} className="pdf-document">
                    <Page pageNumber={pageNumber} renderTextLayer={false} className="pdf-page" />
                </Document>
            </div>
            <div className="Learning_Book_Right">
                <Document file={selectedPDF} className="pdf-document">
                    <Page pageNumber={pageNumber + 1} renderTextLayer={false} className="pdf-page" />
                </Document>
            </div>
            <Button
                name="Learning_Button_Right"
                src="/Right.png"
                alt="오른쪽 네비게이션 버튼"
                onClick={goToNextPage}
            />
        </>
    );
}

function Ai({ onDone }) {
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [showHomeButton, setShowHomeButton] = useState(false);
    const [stopCount, setStopCount] = useState(0);
    const [aiResponse, setAiResponse] = useState('');
    const [showContinue, setShowContinue] = useState(false);
    const [messages, setMessages] = useState([]);
    const [conversation, setConversation] = useState([]);

    useEffect(() => {
        const fetchFirstQuestion = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/first-question', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                setAiResponse(data.question);
            } catch (error) {
                console.error('첫 번째 질문을 검색하는 중 오류 발생:', error);
            }
        };

        fetchFirstQuestion();
    }, []);

    const startListening = () => {
        setIsListening(true);
        setShowContinue(false);
        setIsDone(false);
    };

    const handleStop = async () => {
        setIsListening(false);
        setShowContinue(true);
        setStopCount(stopCount + 1);

        const userMessage = { role: 'user', content: transcript };
        const updatedMessages = [...messages, userMessage];

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    conversation: conversation,
                }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const jsonResponse = await response.json();

            setConversation(jsonResponse.conversation);
            setAiResponse(jsonResponse.response);
            setTranscript('');
        } catch (error) {
            console.error('Flask API와 통신 중 오류 발생:', error);
        }
    };

    const handleDone = () => {
        setAiResponse('');
        setTranscript('');
        setIsListening(false);
        setShowContinue(false);
        setIsDone(true);
        setShowHomeButton(false);
        onDone();
    };

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
        return null;
    }

    return (
        <div className={`Learning_Container active ${isDone ? 'completed' : ''}`}>
            <div className="LearningWon active">
                <img src="/Turtle_Right.png" alt="AI_Chat_Bot" className="AI_ChatBot_Image" />
                <img src="/UserProfile.png" alt="AI_Chat_User3" className="AI_Chat_User_Image" />
                {!isListening && !showContinue && (
                    <img src="/AnswerStart.png" alt="Start" className="AnswerStart" onClick={startListening} />
                )}
                {isListening && (
                    <img src="/Stop.png" alt="Stop" className="AnswerStart" onClick={handleStop} />
                )}
                {showContinue && (
                    <img src="/ContinueStart.png" alt="continue" className="Continue" onClick={() => { setShowContinue(false); startListening(); }} />
                )}
                {stopCount >= 2 && (
                    <img src="/Done.png" onClick={handleDone} className="Done" alt="Done" />
                )}
                <div className="AI_Question">
                    <h3>{aiResponse}</h3>
                </div>
                <div className="User">
                    <p>{transcript}</p>
                </div>
            </div>
        </div>
    );
}

export default function Learning() {
    const [pageNumber, setPageNumber] = useState(1);
    const [showAI, setShowAI] = useState(false);
    const [selectedPDF, setSelectedPDF] = useState(false);
    const [triggerPages, setTriggerPages] = useState([]);
    
    const handleAITrigger = (pageNumber) => {
        if (triggerPages.includes(pageNumber)) {
            setShowAI(true);
        }
    };

    const handleAIDone = () => {
        setShowAI(false);
    };

    const handlePDFSelected = (file, pages) => {
        setSelectedPDF(file);
        setTriggerPages(pages);
    };

    return (
        <div>
            <Link to="/Home"><img className="CIAELogo" src="/CIAE_logo.png" alt="CIAE" /></Link>
            {!selectedPDF ? (
                <PDFSelector onPDFSelected={handlePDFSelected} />
            ) : showAI ? (
                <Ai onDone={handleAIDone} />
            ) : (
                <Reading onAITrigger={handleAITrigger} selectedPDF={selectedPDF} triggerPages={triggerPages} pageNumber={pageNumber} setPageNumber={setPageNumber} />
            )}
        </div>
    );
}
