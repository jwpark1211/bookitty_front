import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header02 from './components/Header/header02.jsx'; // 수정
import Header from './components/Header/header.jsx';
import MainPage from './components/MainPage.jsx';
import SecondScreen from "./components/SecondScreen.jsx";
import SignUpPage from "./components/LoginPage/SignUpPage.jsx";
import LoginPage from "./components/LoginPage/LoginPage.jsx";
import SearchResults from "./components/Search/SearchResults.jsx";
import BookDetail from "./components/BookDetails/BookDetail.jsx";
import MyPage from "./components/MyPage/MyPage.jsx";

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [name, setName] = useState('');

  return (
    <Router>
      <div className="app">
        <Helmet>
          <title>북키티</title>
        </Helmet>
        {isSignedIn ? (
          <Header02 isSignedIn={isSignedIn} name={name} />
        ) : (
          <Header />
        )}
        <Routes>
          <Route path="/" element={<MainPageWithSecondScreen />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsSignedIn} />} />
          <Route path="/signup" element={<SignUpPage setIsSignIn={setIsSignedIn} />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/book/:id" element={<BookDetailPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </div>
    </Router>
  );
};

const MainPageWithSecondScreen = () => (
  <>
    <MainPage />
    <SecondScreen />
  </>
);

const SearchResultsPage = () => (
  <>
    <SearchResults />
  </>
);

const BookDetailPage = () => (
  <>
    <BookDetail />
  </>
);

export default App;
