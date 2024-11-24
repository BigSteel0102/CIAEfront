import './css/Learning.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import axios from 'axios';

// PDF.js 작업자 경로 설정
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.mjs`;

// OpenAI API 호출 함수
async function callOpenAI(messages, setAiResponse) {
    try {
        // Flask 백엔드 API에 POST 요청을 보내 AI 응답을 가져옴
        const response = await axios.post(`https://flask-app-878850522333.asia-northeast3.run.app/ResponseAI/Grade/Book/${book_id}/Chapter/${chapter_id}`, {
            messages: messages
        });

        const newMessage = response.data.content;
        setAiResponse(newMessage); // 새로운 AI 응답을 상태에 저장
    } catch (error) {
        console.error('Error calling backend API:', error);
        setAiResponse('API 호출 중 오류가 발생했습니다.'); // 오류 발생 시 사용자에게 오류 메시지 표시
    }
}

// 버튼 컴포넌트
function Button({ name, src, alt, onClick }) {
    return <img src={src} className={name} alt={alt} onClick={onClick} />;
}

// PDF 선택 컴포넌트
function PDFSelector({ onPDFSelected, onBookSelected }) {
    const handleRadioSelect = (event) => {
        const pdfUrl = event.target.value;
        const bookId = event.target.dataset.bookId;
        if (bookId) {
            localStorage.setItem('selectedBookId', bookId); // 선택된 책 ID를 로컬 저장소에 저장
        }
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
            onPDFSelected(pdfUrl, triggerPages); // 선택된 PDF와 관련된 페이지 정보를 부모 컴포넌트에 전달
        }
    };

    return (
        <div className="PDFSelector active">
            <h1 className='SelectSizeOfText'>글자수 조절</h1>
            <div className='verySmall'>
                <input className='verySmallRadio' type="radio" id='verySmall' name='Text' value='/verySmall.pdf' data-book-id='1' onChange={handleRadioSelect} />
                <label className='Text' htmlFor='verySmall'>아주 적게</label>
            </div>
            <div className='Small'>
                <input className='SmallRadio' type="radio" id='Small' name='Text' value='/Small.pdf' data-book-id='2' onChange={handleRadioSelect} />
                <label className='Text' htmlFor='Small'>약간 적게</label>
            </div>
            <div className='Standard'>
                <input className='StandardRadio' type="radio" id='Standard' name='Text' value='/Standard.pdf' data-book-id='3' onChange={handleRadioSelect} />
                <label className='Text' htmlFor='Standard'>&nbsp; &nbsp;기본</label>
            </div>
        </div>
    );
}

// AI 챗봇 컴포넌트
function Ai({ onDone, chapterId }) {
    const [InitQuestion, setInitQuestion] = useState(null); // 초기 질문 상태
    const [messages, setMessages] = useState([]); // 대화 메시지 상태
    const [transcript, setTranscript] = useState(''); // 사용자 입력 상태
    const [aiResponse, setAiResponse] = useState(InitQuestion); // AI 응답 상태
    const [isDone, setIsDone] = useState(false); // 대화 종료 상태
    const [stopCount, setStopCount] = useState(0); // 대화 종료 버튼 노출을 위한 카운트

    useEffect(() => {
        // 특정 챕터에 대한 초기 질문을 가져옴
        axios
            .get(`http://127.0.0.1:5000/api/books/books/${chapterId}/chapters`)
            .then((response) => {
                const chapterData = response.data;
                setInitQuestion(chapterData.initQuestion);
                setAiResponse(chapterData.initQuestion);
                setMessages([{ "role": "system", "content": chapterData.initQuestion }]); // 초기 질문을 시스템 메시지로 설정
            })
            .catch((error) => console.error("Error fetching init question:", error));
    }, [chapterId]);

    // 사용자 입력 처리 함수
    const handleUserInput = () => {
        setStopCount(stopCount + 1); // 종료 카운트 증가

        const userMessage = { "role": "user", "content": transcript };
        const updatedMessages = [...messages, userMessage];

        callOpenAI(updatedMessages, (response) => {
            setAiResponse(response);
            setMessages([...updatedMessages, { "role": "assistant", "content": response }]); // AI 응답을 메시지에 추가
        });

        setTranscript(''); // 입력 필드 초기화
    };

    // 대화 종료 처리 함수
    const handleDone = () => {
        setAiResponse('');
        setTranscript('');
        setIsDone(false);
        onDone(); // 부모 컴포넌트에 종료 알림
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

// 독서 컴포넌트
function Reading({ onAITrigger, selectedPDF, triggerPages, pageNumber, setPageNumber, onEnd, chapterId }) {
    const [numPages, setNumPages] = useState(null); // PDF의 총 페이지 수 상태

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages); // PDF 로드 성공 시 총 페이지 수 설정
    };

    const goToPrevPage = () => {
        setPageNumber((prevPageNumber) => (prevPageNumber > 2 ? prevPageNumber - 2 : prevPageNumber)); // 이전 페이지로 이동
    };

    const goToNextPage = () => {
        setPageNumber((prevPageNumber) => {
            const nextPage = prevPageNumber + 2;
            if (numPages && nextPage <= numPages) {
                if (triggerPages.includes(nextPage)) {
                    onAITrigger(nextPage); // 트리거 페이지일 경우 AI 대화 시작
                }
                return nextPage;
            } else if (numPages && nextPage > numPages) {
                onEnd(); // 마지막 페이지를 넘어가면 종료 처리
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

// 메인 학습 컴포넌트
export default function Learning() {
    const [pageNumber, setPageNumber] = useState(1); // 현재 페이지 번호 상태
    const [showAI, setShowAI] = useState(false); // AI 대화 화면 표시 여부
    const [selectedPDF, setSelectedPDF] = useState(false); // 선택된 PDF 파일 경로
    const [triggerPages, setTriggerPages] = useState([]); // AI 대화 트리거 페이지 목록
    const [showEndMessage, setShowEndMessage] = useState(false); // 종료 메시지 표시 여부
    const [chapterId, setChapterId] = useState(() => {
        // 선택된 책 ID를 기준으로 챕터 ID를 초기화
        const storedBookId = localStorage.getItem('selectedBookId');
        const validBookIds = [1, 2, 3];
        const bookId = storedBookId ? parseInt(storedBookId) : 1;
        return validBookIds.includes(bookId) ? bookId : 1;
    });

    // AI 대화 트리거 처리 함수
    const handleAITrigger = (pageNumber) => {
        if (triggerPages.includes(pageNumber)) {
            setShowAI(true);
        }
    };

    // AI 대화 종료 처리 함수
    const handleAIDone = () => {
        setShowAI(false);
    };

    // PDF 선택 처리 함수
    const handlePDFSelected = (file, pages) => {
        setSelectedPDF(file);
        setTriggerPages(pages);
    };

    // 독서 종료 처리 함수
    const handleEnd = () => {
        setShowEndMessage(true);
    };

    return (
        <div>
            <Link to="/Home"><img className="CIAELogo" src="/CIAE_logo.png" alt="CIAE" /></Link>
            {!selectedPDF ? (
                <PDFSelector onPDFSelected={handlePDFSelected} />
            ) : showAI ? (
                <Ai onDone={handleAIDone} chapterId={chapterId} />
            ) : showEndMessage ? (
                <div className="LearningWon active">
                    <h1 className='End'>끝!</h1>
                    <Link to="/Home">
                        <button className="Home_Button">Home</button>
                    </Link>
                </div>
            ) : (
                <Reading onAITrigger={handleAITrigger} selectedPDF={selectedPDF} triggerPages={triggerPages} pageNumber={pageNumber} setPageNumber={setPageNumber} onEnd={handleEnd} chapterId={chapterId} />
            )}
        </div>
    );
}
