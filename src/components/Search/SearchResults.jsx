import React, { useState, useEffect } from "react";
import './SearchResults.css';
import { useSearchParams } from "react-router-dom";

const SearchResults = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        fetch(`http://43.201.231.40:8080/open/search/keyword/${searchParams.get("term")}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('서버에서 데이터를 가져오지 못했습니다.');
                }

                return response.json();
            })
            .then(data => {
                console.log(data);
                setSearchResults(data.item);
            })
            .catch(error => console.error('검색 결과를 가져오는 동안 오류가 발생했습니다:', error));
    }, []);


    return (
        <div className="search-results">
            <h4>"{searchParams.get("term")}"에 대한 검색 결과</h4>
            <div className="book-container">
                {searchResults && searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                        <div key={index} className="book-item">
                            <img src={result.cover} alt={result.title} className="book-cover" />
                            <a href={`/book/${result.id}`} className="book-link">
                                <div className="book-info">
                                    <h3 className="book-title">{result.title}</h3>
                                    <p className="book-author">{result.author}</p>
                                </div>
                            </a>
                        </div>
                    ))
                ) : (
                    <p className="no-results">{`"${searchParams.get("term")}"에 대한 검색 결과가 없습니다.`}</p>
                )}
            </div>
        </div>
    );
}

export default SearchResults;