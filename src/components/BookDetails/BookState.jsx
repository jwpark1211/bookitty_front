import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoginModal from './LoginModal';
import './BookState.css';

const BookState = ({ isbn }) => {
  const [activeButton, setActiveButton] = useState(null);
  const [stateId, setStateId] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const accessToken = sessionStorage.getItem('accessToken');
  const memberId = sessionStorage.getItem('memberId');
  const [book, setBook] = useState(null);

  useEffect(() => {
    const loginStatus = sessionStorage.getItem('login');
    setIsSignedIn(!!loginStatus);
    fetchBookDetails();
    fetchCurrentState();
  }, []);

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const baseURL = 'http://43.201.231.40:8080';
  const headers = { 'Authorization': `Bearer ${accessToken}` };

  const fetchBookDetails = async () => {
    try {
      const apiUrl = `${baseURL}/open/search/book/${isbn}`;
      const response = await axios.get(apiUrl);
      if (response.data && response.data.item && response.data.item.length > 0) {
        setBook(response.data.item[0]);
      } else {
        throw new Error('책 정보가 없습니다.');
      }
    } catch (error) {
      console.error('책 정보를 가져오는 중 오류 발생:', error);
    }
  };

  const fetchCurrentState = async () => {
    try {
      const response = await axios.get(`${baseURL}/state/isbn/${isbn}/member/${memberId}`, { headers });
      if (response.data && response.data.data.state) {
        setActiveButton(response.data.data.state);
        setStateId(response.data.data.id);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('No current state found for the book.');
        setActiveButton(null);
        setStateId(null);
      } else {
        console.error('Error fetching current state:', error);
      }
    }
  };

  const fetchStateId = async (state) => {
    try {
      const stateUrl = `${baseURL}/state/new`;
      const response = await axios.post(stateUrl, {
        isbn,
        memberId,
        state,
        categoryName: book.categoryName,
        bookTitle: book.title,
        bookAuthor: book.author,
        bookImgUrl: book.cover
      }, { headers });
      return response.data.data.id;
    } catch (error) {
      console.error('Error fetching state ID:', error);
      throw new Error('Failed to fetch state ID');
    }
  };

  const handleAddState = async (state) => {
    try {
      const newStateId = await fetchStateId(state);
      setActiveButton(state);
      setStateId(newStateId);
    } catch (error) {
      console.error('Error adding state:', error);
    }
  };

  const handleUpdateState = async (state) => {
    try {
      await axios.patch(`${baseURL}/state/${stateId}`, { state }, { headers });
      setActiveButton(state);
    } catch (error) {
      console.error('Error updating state:', error);
    }
  };

  const handleDeleteState = async () => {
    try {
      await axios.delete(`${baseURL}/state/${stateId}`, { headers });
      setActiveButton(null);
      setStateId(null);
    } catch (error) {
      console.error('Error deleting state:', error);
    }
  };

  const handleStateChange = async (newState) => {
    if (!isSignedIn) {
      setShowLoginModal(true);
      return;
    }

    if (newState === activeButton) {
      handleDeleteState();
    } else {
      if (stateId) {
        handleUpdateState(newState);
      } else {
        handleAddState(newState);
      }
    }
  };

  return (
    <div className="book-state-container">
      <button
        className={`button ${activeButton === 'READ_ALREADY' ? 'active' : ''}`}
        onClick={() => handleStateChange('READ_ALREADY')}
      >
        읽음
      </button>
      <button
        className={`button ${activeButton === 'WANT_TO_READ' ? 'active' : ''}`}
        onClick={() => handleStateChange('WANT_TO_READ')}
      >
        읽고 싶어요
      </button>
      <button
        className={`button ${activeButton === 'READING' ? 'active' : ''}`}
        onClick={() => handleStateChange('READING')}
      >
        읽는 중
      </button>
      {!isSignedIn && showLoginModal && <LoginModal onClose={handleCloseLoginModal} />}
    </div>
  );
};

export default BookState;
