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

function Reading({ onAITrigger, selectedPDF, triggerPages, pageNumber, setPageNumber, onEnd }) {
    
    const [numPages, setNumPages] = useState(null);

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
        } else if (numPages && pageNumber + 2 > numPages) {
            onEnd();
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
    const [aiResponse, setAiResponse] = useState('');
    const [conversation, setConversation] = useState([]);
    const [step, setStep] = useState(0);

    useEffect(() => {
        // 첫 번째 질문 요청
        const fetchFirstQuestion = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/first-question', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                setAiResponse(data.question);
            } catch (error) {
                console.error('첫 번째 질문을 가져오는 중 오류 발생:', error);
            }
        };

        fetchFirstQuestion();
    }, []);

    const handleSendMessage = async () => {
        if (transcript.trim() === '') return;

        const userMessage = { role: 'user', content: transcript };
        const updatedConversation = [...conversation, userMessage];

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    conversation: updatedConversation,
                }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const jsonResponse = await response.json();

            setConversation(jsonResponse.conversation);
            setAiResponse(jsonResponse.response);
            setTranscript('');
            setStep(step + 1);
        } catch (error) {
            console.error('Flask API와 통신 중 오류 발생:', error);
        }
    };

    return (
        <div className={`Learning_Container active`}>
            <div className="LearningWon active">
                <img src="/Turtle_Right.png" alt="AI_Chat_Bot" className="AI_ChatBot_Image" />
                <img src="/UserProfile.png" alt="AI_Chat_User3" className="AI_Chat_User_Image" />
                <div className="chat-container">
                    <div className="AI_Question">
                        <h3>{aiResponse}</h3>
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            placeholder="메시지를 입력하세요..."
                            className="chat-input-box"
                        />
                        <button onClick={handleSendMessage} className="send-button">전송</button>
                    </div>
                </div>
                {step >= 2 && (
                    <button onClick={onDone} className="Done">끝내기</button>
                )}
            </div>
        </div>
    );
}

export default function Learning() {
    const [pageNumber, setPageNumber] = useState(1);
    const [showAI, setShowAI] = useState(false);
    const [selectedPDF, setSelectedPDF] = useState(false);
    const [triggerPages, setTriggerPages] = useState([]);
    const [showEndMessage, setShowEndMessage] = useState(false);
    
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

    const handleEnd = () => {
        setShowEndMessage(true);
    };

    return (
        <div>
            <Link to="/Home"><img className="CIAELogo" src="/CIAE_logo.png" alt="CIAE" /></Link>
            {!selectedPDF ? (
                <PDFSelector onPDFSelected={handlePDFSelected} />
            ) : showAI ? (
                <Ai onDone={handleAIDone} />
            ) : showEndMessage ? (
                <div className="LearningWon active">
                    <h1 className='End'>끝!</h1>
                    <Link to="/Home">
                        <button className="Home_Button">Home</button>
                    </Link>
                </div>
            ) : (
                <Reading onAITrigger={handleAITrigger} selectedPDF={selectedPDF} triggerPages={triggerPages} pageNumber={pageNumber} setPageNumber={setPageNumber} onEnd={handleEnd} />
            )}
        </div>
    );
}
