import './css/Village.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchThreads();
    }, []);

    const fetchThreads = async () => {
        try {
            const response = await axios.get('https://flask-app-878850522333/api/community/threads');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching threads:', error);
        }
    };

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

    const handlePostSubmit = async () => {
        if (title && content) {
            try {
                await axios.post(`https://flask-app-878850522333/api/community/threads/${selectedBoard}/posts`, {
                    title,
                    content,
                });
                fetchThreads();
                setMode('view');
                setTitle('');
                setContent('');
            } catch (error) {
                console.error('Error posting:', error);
            }
        } else {
            alert('제목과 내용을 모두 입력해주세요.');
        }
    };

    const handleListItemClick = async (postId) => {
        try {
            const response = await axios.get(`https://flask-app-878850522333/api/community/posts/${postId}/comments`);
            setSelectedPost({ ...posts.find(post => post.id === postId), replies: response.data });
            setMode('detail');
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

    const handleReplyChange = (event) => {
        setReplies(event.target.value);
    };

    const handleReplySubmit = async () => {
        if (replies) {
            try {
                await axios.post(`https://flask-app-878850522333/api/community/posts/${selectedPost.id}/comments`, {
                    content: replies,
                });
                setReplies('');
                fetchThreads();
                setShowReplyInput(false);
            } catch (error) {
                console.error('Error submitting reply:', error);
            }
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

    const handleDeletePost = async (postId) => {
        try {
            await axios.delete(`https://flask-app-878850522333/api/community/posts/${postId}`);
            fetchThreads();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`https://flask-app-878850522333/api/community/comments/${commentId}`);
            fetchThreads();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className='menu'>
            <p className='pageName'>거북이 마을</p>

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
                            {posts.map((post, index) => (
                                <div
                                    className='userList'
                                    key={index}
                                    onClick={() => handleListItemClick(post.id)}
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
                                    <button onClick={() => handleDeleteComment(reply.id)}>Delete</button>
                                </li>
                            ))}
                        </div>
                        <button onClick={() => handleDeletePost(selectedPost.id)}>Delete Post</button>
                    </div>
                )}
            </div>
        </div>
    );
}
