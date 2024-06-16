import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CommentSection.css';
import CommentBox from './CommentBox';
import CommentModal from './CommentModal';
import CommentPageModal from './CommentPageModal';

const CommentSection = ({ isbn, accessToken, memberId, isSignedIn, showModal, setShowModal }) => {
    const [comments, setComments] = useState([]);
    const [visibleComments, setVisibleComments] = useState(3);
    const [showAllCommentsModal, setShowAllCommentsModal] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [currentComment, setCurrentComment] = useState(null);
    const [likedComments, setLikedComments] = useState([]);
    const [hasMyComment, setHasMyComment] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [isbn]);

    useEffect(() => {
        const likedCommentsFromStorage = JSON.parse(localStorage.getItem('likedComments'));
        if (likedCommentsFromStorage) {
            setLikedComments(likedCommentsFromStorage);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('likedComments', JSON.stringify(likedComments));
    }, [likedComments]);

    const fetchComments = async () => {
        try {
            const commentsUrl = `http://43.201.231.40:8080/comment/isbn/${isbn}`;
            const response = await fetch(commentsUrl);
            if (!response.ok) {
                throw new Error('서버 응답이 올바르지 않습니다.');
            }
            const responseData = await response.json();
            const { data } = responseData;
            setComments(data.content);

            const myCommentExists = data.content.some(comment => comment.memberId === Number(memberId));
            setHasMyComment(myCommentExists);
        } catch (error) {
            console.error('코멘트 정보를 가져오는 중 오류 발생:', error);
        }
    };

    const handleShowCommentModal = () => {
        setCurrentComment(null);
        if (!isSignedIn) {
            setShowModal(true);
        } else {
            setShowCommentModal(true);
        }
    };

    const handleCloseCommentModal = () => {
        setShowCommentModal(false);
    };

    const handleShowAllComments = () => {
        setShowAllCommentsModal(true);
    };

    const handleCloseAllCommentsModal = () => {
        setShowAllCommentsModal(false);
    };

    const handleEditComment = (comment) => {
        setCurrentComment(comment);
        setShowCommentModal(true);
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const deleteCommentUrl = `http://43.201.231.40:8080/comment/${commentId}`;
            await axios.delete(deleteCommentUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const updatedComments = comments.filter(comment => comment.id !== commentId);
            setComments(updatedComments);
            const myCommentExists = updatedComments.some(comment => comment.memberId === Number(memberId));
            setHasMyComment(myCommentExists);

            console.log('Comment deleted successfully');
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const handleLike = async (commentId) => {
        const isLiked = likedComments.includes(commentId);
        try {
            const action = isLiked ? 'decrease' : 'increase';
            const likeUrl = `http://43.201.231.40:8080/comment/${commentId}/member/${memberId}/like/${action}`;
            const response = await axios.post(
                likeUrl,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            const updatedComments = comments.map(comment => {
                if (comment.id === commentId) {
                    const newLikes = isLiked ? (comment.like_count || 0) - 1 : (comment.like_count || 0) + 1;
                    return { ...comment, like_count: newLikes, liked: !isLiked };
                }
                return comment;
            });
            setComments(updatedComments);

            const updatedLikedComments = isLiked 
                ? likedComments.filter(id => id !== commentId)
                : [...likedComments, commentId];
            
            setLikedComments(updatedLikedComments);
            localStorage.setItem('likedComments', JSON.stringify(updatedLikedComments));

            console.log(`좋아요 ${isLiked ? '취소' : '요청'} 성공:`, response.data);
        } catch (error) {
            console.error(`좋아요 ${isLiked ? '취소' : '요청'} 에러:`, error);
        }
    };

    const handleAddComment = async (content) => {
        setIsLoading(true);
        try {
            const addCommentUrl = `http://43.201.231.40:8080/comment`;
            const response = await axios.post(
                addCommentUrl,
                {
                    content,
                    isbn,
                    memberId: Number(memberId)
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
            setComments([response.data, ...comments]);
            setHasMyComment(true);
            console.log('Comment added successfully:', response.data);
        } catch (error) {
            console.error('Failed to submit comment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="comment-section">
            <h3>코멘트</h3>
            {isSignedIn && !hasMyComment && (
                <button className="comment-button" onClick={handleShowCommentModal} disabled={isLoading}>
                    👉 코멘트 작성하기 
                </button>
            )}
            {comments && comments.length > 0 ? (
                comments.slice(0, visibleComments).map((comment, index) => (
                    <CommentBox
                        key={index}
                        comment={comment}
                        memberId={memberId}
                        isSignedIn={isSignedIn}
                        onEdit={handleEditComment}
                        onDelete={handleDeleteComment}
                        onLike={handleLike}
                        likedComments={likedComments}
                    />
                ))
            ) : (
                <div className="comment-container01">코멘트가 없습니다</div>
            )}
            {comments.length > visibleComments && (
                <button className="more-button" onClick={handleShowAllComments}>더 보기</button>
            )}
            {showCommentModal && (
                <CommentModal
                    onClose={handleCloseCommentModal}
                    accessToken={accessToken}
                    memberId={memberId}
                    isbn={isbn}
                    currentComment={currentComment}
                    setComments={setComments}
                    comments={comments}
                    onAddComment={handleAddComment}
                />
            )}
            {showAllCommentsModal && (
                <CommentPageModal
                    comments={comments}
                    onClose={handleCloseAllCommentsModal}
                    memberId={memberId}
                    isSignedIn={isSignedIn}
                    onEdit={handleEditComment}
                    onDelete={handleDeleteComment}
                    onLike={handleLike}
                    likedComments={likedComments}
                    accessToken={accessToken}
                    isbn={isbn}
                    setComments={setComments}
                />
            )}
        </div>
    );
};

export default CommentSection;
