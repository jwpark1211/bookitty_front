import React from "react";
import { Helmet } from "react-helmet";
import Header from './components/Header/header.jsx';
import MainPage from './components/MainPage.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SecondScreen from "./components/SecondScreen.jsx";
import SignUpPage from "./components/LoginPage/SignUpPage.jsx";
import LoginPage from "./components/LoginPage/LoginPage.jsx";
import SearchResults from "./components/Search/SearchResults.jsx";
import BookDetail from "./components/BookDetails/BookDetail.jsx"; // 새로운 컴포넌트 추가

const App = () => {
  return (
    <Router>
      <div className="app">
        <Helmet>
          <title>북키티</title>
        </Helmet>
        <Routes>
          <Route path="/" element={<MainPageWithSecondScreen />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/book/:id" element={<BookDetailPage />} /> 
        </Routes>
      </div>
    </Router>
  );
};

const MainPageWithSecondScreen = () => (
  <>
    <Header />
    <MainPage />
    <SecondScreen />
  </>
);

const SearchResultsPage = () => (
  <>
    <Header />
    <SearchResults />
  </>
);

const BookDetailPage = () => {
  <>
  <Header />
  <BookDetail />
  </>
}

export default App;
