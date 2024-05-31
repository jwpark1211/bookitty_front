import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoginModal from './LoginModal';
import './BookState.css';

const BookState = ({ isbn, bookState }) => {
  const [activeButton, setActiveButton] = useState(bookState);
  const [stateId, setStateId] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const accessToken = sessionStorage.getItem('accessToken');
  const [bookStates, setBookStates] = useState([]);
  const memberId = sessionStorage.getItem('memberId');
  const [book, setBook] = useState(null);

  useEffect(() => {
    const loginStatus = sessionStorage.getItem('login');
    setIsSignedIn(!!loginStatus);
    console.log("Login status:", !!loginStatus);
    fetchBookStates();
    fetchBookDetails();
  }, []);

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const baseURL = 'http://43.201.231.40:8080';
  const headers = { 'Authorization': `Bearer ${accessToken}` };

  const fetchStateId = async (state) => {
    const stateUrl = `${baseURL}/state/new`;
    try {
      console.log('Requesting state ID for state:', state);
      console.log('Request JSON:', JSON.stringify({ isbn, memberId, state, categoryName: book.categoryName, bookTitle: book.title, bookAuthor: book.author, bookImgUrl: book.cover }));
      const response = await axios.post(stateUrl, { isbn, memberId, state, categoryName: book.categoryName, bookTitle: book.title, bookAuthor: book.author, bookImgUrl: book.cover }, { headers });
      console.log('Response for state ID request:', response.data);
      return response.data.id;
    } catch (error) {
      console.error('Error fetching state ID:', error);
      throw new Error('Failed to fetch state ID');
    }
  };

  const fetchBookStates = async () => {
    const statesUrl = `${baseURL}/state/isbn/${isbn}`;
    try {
      const response = await axios.get(statesUrl, { headers }); // 인증 헤더 추가
      setBookStates(response.data);
      console.log('Book states:', response.data);
    } catch (error) {
      console.error('Error fetching book states:', error);
    }
  };

  const fetchBookDetails = async () => {
    try {
      const apiUrl = `http://43.201.231.40:8080/open/search/book/${isbn}`;
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

  const handleAddState = async (state) => {
    console.log("Adding state:", state);
    try {
      console.log('Sending request to add state:', state);
      const stateId = await fetchStateId(state);
      setStateId(stateId);
      setActiveButton(state);
      console.log('State added successfully. ID:', stateId);
    } catch (error) {
      console.log('Error adding state:', error);
    }
  };

  const handleUpdateState = async (state) => {
    console.log(`Updating state: state=${state}, stateId=${stateId}`);
    try {
      console.log('Sending request to update state:', state);
      await axios.patch(`${baseURL}/state/${stateId}`, { state }, { headers });
      setActiveButton(state);
      console.log('State updated successfully', state);
    } catch (error) {
      console.log('Error updating state:', error);
    }
  };

  const handleDeleteState = async () => {
    console.log(`Deleting state: stateId=${stateId}`);
    console.log(stateId)
    try {
      console.log('Sending request to delete state:', stateId);
      await axios.delete(`${baseURL}/state/${stateId}`, { headers });
      setActiveButton(null);
      setStateId(null);
      console.log('State deleted successfully');
    } catch (error) {
      console.log('Error deleting state:', error);
    }
  };

  const handleStateChange = async (newState) => {
    console.log("New state:", newState);
    if (!isSignedIn) {
      console.log("User is not signed in.");
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
    <div>
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