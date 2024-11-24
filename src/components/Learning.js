import './css/Learning.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import axios from 'axios';

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.mjs`;

async function callOpenAI(messages, setAiResponse) {
    try {
        const response = await axios.post('http://127.0.0.1:5000/api/getAIResponse', {
            messages: messages
        });

        const newMessage = response.data.content;
        setAiResponse(newMessage);
    } catch (error) {
        console.error('Error calling backend API:', error);
        setAiResponse('API 호출 중 오류가 발생했습니다.');
    }
}

async function saveConversationToDB(messages) {
    try {
        await axios.post('http://127.0.0.1:5000/api/saveConversation', {
            messages: messages
        });
    } catch (error) {
        console.error('Error saving conversation to DB:', error);
    }
}

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
                default:
                    triggerPages = [];
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

function Ai({ onDone }) {
    const [InitQuestion, setInitQuestion] = useState(null);
    const [messages, setMessages] = useState([]);
    const [transcript, setTranscript] = useState('');
    const [aiResponse, setAiResponse] = useState(InitQuestion);
    const [isDone, setIsDone] = useState(false);
    const [stopCount, setStopCount] = useState(0);

    useEffect(() => {
    axios
        .get("http://127.0.0.1:5000/api/InitQuestion")
        .then((response) => {
            setInitQuestion(response.data);
            setAiResponse(response.data);
            setMessages([{ "role": "system", "content": response.data }]);
        })
        .catch((error) => console.error("Error fetching data:", error));
}, []);

    const handleUserInput = () => {
        setStopCount(stopCount + 1);

        const userMessage = { "role": "user", "content": transcript };
        const updatedMessages = [...messages, userMessage];

        callOpenAI(updatedMessages, (response) => {
            setAiResponse(response);
            setMessages([...updatedMessages, { "role": "assistant", "content": response }]);
        });

        setTranscript('');
    };

    const handleDone = () => {
        setAiResponse('');
        setTranscript('');
        setIsDone(false);
        saveConversationToDB(messages);
        onDone();
    };

    return (
        <div className={`Learning_Container active ${isDone ? 'completed' : ''}`}>
            <div className='LearningWon active'>
                <img src='/Teacher.png' alt='AI_Chat_Bot' className='AI_ChatBot_Image'/>
                <img src='/UserProfile.png' alt='AI_Chat_User3' className='AI_Chat_User_Image'/>
                <div className='chat-input'>
                    <input
                        type='text'
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        placeholder='답변을 입력하세요...'
                        className='chatinput'
                    />
                    <img src='/send.png' className='send-button' onClick={handleUserInput} ></img>
                </div>
                {stopCount >= 2 && (
                    <img src='/Done.png' onClick={handleDone} className='Done'/>
                )}
                <div className='AI_Question'>
                    <h3>{aiResponse}</h3>
                </div>
            </div>
        </div>
    );
}

function Reading({ onAITrigger, selectedPDF, triggerPages, pageNumber, setPageNumber, onEnd }) {
    const [numPages, setNumPages] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const goToPrevPage = () => {
        setPageNumber((prevPageNumber) => (prevPageNumber > 2 ? prevPageNumber - 2 : prevPageNumber));
    };

    const goToNextPage = () => {
        setPageNumber((prevPageNumber) => {
            const nextPage = prevPageNumber + 2;
            if (numPages && nextPage <= numPages) {
                if (triggerPages.includes(nextPage)) {
                    onAITrigger(nextPage);
                }
                return nextPage;
            } else if (numPages && nextPage > numPages) {
                onEnd();
                return prevPageNumber;
            }
            return prevPageNumber;
        });
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
                <Document
                    file={selectedPDF}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="pdf-document"
                >
                    <Page pageNumber={pageNumber} renderTextLayer={false} className="pdf-page" />
                </Document>
            </div>
            <div className="Learning_Book_Right">
                <Document
                    file={selectedPDF}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="pdf-document"
                >
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
