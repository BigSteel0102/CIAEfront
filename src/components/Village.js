import './css/Village.css';
import React, { useState } from 'react';

function CustomDropdown({ options, selectedOption, onOptionSelect }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="dropdownContainer">
            <img className='dropdown' src='/dropdown.png' alt='drop' onClick={toggleDropdown}></img>
            <div className="dropdownHeader" onClick={toggleDropdown}>
                {selectedOption}
            </div>
            {isOpen && (
                <ul className="dropdownList">
                    {options.map((option) => (
                        <li
                            key={option}
                            className="dropdownItem"
                            onClick={() => {
                                onOptionSelect(option);
                                setIsOpen(false);
                            }}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function Village() {
    const [currentBoard, setCurrentBoard] = useState('자유게시판');
    const [mode, setMode] = useState('view');
    const [searchTerm, setSearchTerm] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedPost, setSelectedPost] = useState(null);
    const [replies, setReplies] = useState('');
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [hasLiked, setHasLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [selectedBoard, setSelectedBoard] = useState('자유게시판'); 
    const [posts, setPosts] = useState({
        자유게시판: [
            { title: '공부하기 너무 싫어요 ㅠㅠㅠㅠㅠㅠ', content: '요즘 집중이 너무 안돼서 공부를 할수 없어요 ㅜㅜ' }
        ],
        정보게시판: [
            {title: '병원 추천좀', content: '저 진짜 이제 병원 안가면 안될것 같아요... 성북구 병원 추천 좀 해 주세요 ㅠㅠ', replies: ['00병원 좋아요! 원장님도 친절하시고...']}
        ],
        고민게시판: [{ title: '학교에서 힘든 일이 있었어요.ㅜㅜ', content: '국어 수업 시간에 선생님께서 소리내어 책을 읽어보라고 하셨는데 글을 집중해서 못 읽어서 친구들에게 창피를 당했어요 ㅠㅠ', replies: ['정말 고생 많았겠다 ㅠㅠ'] }]
    });

    const handleBoardChange = (newBoard) => {
        setCurrentBoard(newBoard);
        setMode('view');
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        console.log(`Searching for: ${searchTerm}`);
    };

    const handlePostClick = () => {
        setMode('post');
    };

    const handlePostSubmit = () => {
        if (title && content) {
            setPosts((prevPosts) => ({
                ...prevPosts,
                [selectedBoard]: [{ title, content, replies: [] }, ...prevPosts[selectedBoard]], // 새 게시물을 앞에 추가
            }));
            setCurrentBoard(selectedBoard);
            setMode('view');
            setTitle('');
            setContent('');
        } else {
            alert('제목과 내용을 모두 입력해주세요.');
        }
    };

    const handleListItemClick = (post) => {
        setSelectedPost(post);
        setMode('detail');
    };

    const handleReplyChange = (event) => {
        setReplies(event.target.value);
    };

    const handleReplySubmit = () => {
        if (replies) {
            setSelectedPost((prevSelectedPost) => ({
                ...prevSelectedPost,
                replies: [...(prevSelectedPost.replies || []), replies],
            }));
    
            setPosts((prevPosts) => ({
                ...prevPosts,
                [currentBoard]: prevPosts[currentBoard].map((post) =>
                    post === selectedPost
                        ? { ...post, replies: [...(post.replies || []), replies] }
                        : post
                ),
            }));
    
            setReplies('');
            setShowReplyInput(false);
        }
    };

    const toggleReplyInput = () => {
        setShowReplyInput(!showReplyInput);
    };

    const handleHeartClick = () => {
        if (!hasLiked) {
            setHasLiked(true);
            setLikeCount(likeCount + 1);
        }
    };

    return (
        <div className='menu'>
            <p className='pageName'>거북이 마을</p>
            <p className='logOut'>로그아웃</p>

            <p className={`FreeBoard ${currentBoard === '자유게시판' ? 'selected' : ''}`}
                onClick={() => handleBoardChange('자유게시판')}>자유게시판</p>

            <p className={`InfoBoard ${currentBoard === '정보게시판' ? 'selected' : ''}`}
                onClick={() => handleBoardChange('정보게시판')}>정보게시판</p>

            <p className={`WorryBoard ${currentBoard === '고민게시판' ? 'selected' : ''}`}
                onClick={() => handleBoardChange('고민게시판')}>고민게시판</p>

            <div className='board'>
                {mode === 'view' && (
                    <div>
                        <div className='searchContainer'>
                            <input
                                type='text'
                                placeholder='#키워드 검색'
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className='searchInput'
                            />
                            <div onClick={handleSearch} className='searchButton'>
                                <img className='SearchImg' src='/Search.png' alt='search' />
                            </div>
                        </div>
                        <div className='contentBorder' />
                        <ul>
                            {posts[currentBoard].map((post, index) => (
                                <div
                                    className='userList'
                                    key={index}
                                    onClick={() => handleListItemClick(post)}
                                >
                                    <img className='mainAvatar' src='/58.png' alt='avatar'></img>
                                    <p className='titleOfContent'>{post.title}</p>
                                </div>
                            ))}
                        </ul>
                        <img className='PostButton' src='/post.png' alt='post' onClick={handlePostClick}></img>
                    </div>
                )}
                {mode === 'post' && (
                    <div>
                        <img className='WritingAvatar' src='/58.png' alt='Avatar'/>
                        <CustomDropdown
                            options={["자유게시판", "정보게시판", "고민게시판"]}
                            selectedOption={selectedBoard}
                            onOptionSelect={(value) => setSelectedBoard(value)}
                        />
                        
                        <div className='dividerS' />
                        <input
                            type="text"
                            placeholder="게시물 제목 작성하기"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="titleInput"
                        />
                        <textarea
                            placeholder="게시글 내용 작성하기"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="contentInput"
                        />
                        <div className="LetsPost" onClick={handlePostSubmit}><p className='Post'>게시하기</p></div>
                    </div>
                )}
                {mode === 'detail' && selectedPost && (
                    <div>
                        <div className="dropdownHeader">
                            {selectedBoard}
                        </div>
                        <div className='dividerS' />
                        <img className='Avatar' src='/58.png' alt='profile'/>
                        <h2 className='viewTitle'>{selectedPost.title}</h2>
                        <div className='viewContent' style={{ whiteSpace: 'pre-wrap' }}>{selectedPost.content}</div>
                        <div onClick={handleHeartClick}>
                            <img 
                                className='Heart' 
                                src={hasLiked ? '/favorite_filled.png' : '/favorite.png'} 
                                alt='heart'
                                style={{ filter: hasLiked ? 'invert(34%) sepia(98%) saturate(7496%) hue-rotate(353deg) brightness(101%) contrast(110%)' : 'none' }}
                            />
                            <p className='HeartNum'>{likeCount}</p>
                        </div>
                        <div onClick={toggleReplyInput}>
                            <img className='UsersendReply' src='/send.png' alt='send'/>
                            <p className='Respond'>댓글달기</p>
                        </div>
                        <div className='divider' />
                        {showReplyInput && (
                            <div className='fixedReply'>
                                <input
                                    className='reply'
                                    placeholder='댓글 달기'
                                    value={replies}
                                    onChange={handleReplyChange}
                                />
                                <img
                                    className='replyPost'
                                    src='/send.png'
                                    alt='send'
                                    onClick={handleReplySubmit}
                                />
                            </div>
                        )}
                        <div className='replyList'>
                            {(selectedPost.replies || []).map((reply, index) => (
                                <li key={index} className='replyItem'>
                                    <img className='ReplyAvatar' src='/58.png' alt='avatar'></img>
                                    <p className='ReplyText'>{reply}</p>
                                </li>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
