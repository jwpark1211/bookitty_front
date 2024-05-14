import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './MainPage.css';
import searchIcon from './search-alt-2-svgrepo-com.svg';
import SearchResults from "./Search/SearchResults";

const SearchBar = ({ value, onChange, onKeyPress }) => {
    return (
        <div className="search-bar">
            <img src={searchIcon} alt="Search Icon" className="search-icon" />
            <input
                type="text"
                className="search-input"
                placeholder="북키티와 서재 찾아보기"
                value={value}
                onChange={onChange}
                onKeyPress={onKeyPress}
            />
        </div>
    );
}

const MainPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        if (e.key === 'Enter') {
            // 검색어가 비어 있지 않을 때에만 검색 결과 페이지로 이동
            if (searchTerm.trim() !== '') {
                navigate(`/search?term=${searchTerm}`); // navigate 함수를 호출하여 경로 변경
            }
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`main-page ${isScrolled ? 'scrolled' : ''}`}>
            <h1>북키티가 오늘의 책을<br />추천해준다냥!</h1>
            <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearch}
            />
            {searchResults && searchResults.books.length > 0 && (
                <SearchResults searchResults={searchResults} />
            )}
            {searchResults && searchResults.books.length === 0 && (
                <p>검색 결과가 없습니다.</p>
            )}
        </div>
    );
}

export default MainPage;
