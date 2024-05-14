import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const SearchResults = () => {
    const [searchResults, setSearchResults] = useState([]);
    const { keyword } = useParams(); 

    useEffect(() => {
        fetch(`http://43.201.231.40:8080/open/search/keyword/${keyword}`, {
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
                console.log('검색 결과 데이터:', data);
                setSearchResults(data); 
            })
            .catch(error => console.error('검색 결과를 가져오는 동안 오류가 발생했습니다:', error));
    }, [keyword]);

    console.log('검색어:', keyword);
    console.log('검색 결과:', searchResults);

    return (
        <div className="search-results">
            <h4>검색 결과</h4>
            {searchResults && searchResults.length > 0 ? (
                <ul>
                    {searchResults.map((result, index) => (
                        <li key={index}>
                            <a href={`/book/${result.id}`} className="book-link">
                                <img src={result.cover} alt={result.title} className="book-cover" />
                                <div className="book-info">
                                    <h3 className="book-title">{result.title}</h3>
                                    <p className="book-author">{result.author}</p>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-results">{`"${keyword}"에 대한 검색 결과가 없습니다.`}</p>
            )}
        </div>
    );
}

export default SearchResults;