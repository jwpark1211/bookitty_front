import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './SecondScreen.css';
import { Link } from 'react-router-dom';

const SecondScreen = () => {
    const [bestsellers, setBestsellers] = useState([]);
    const [newBooks, setNewBooks] = useState([]);
    const [blogChoices, setBlogChoices] = useState([]);
    const [economicBooks, setEconomicBooks] = useState([]);
    const [literature, setLiterature] = useState([]);
    const [science, setScience] = useState([]);
    const [humanities, setHumanities] = useState([]);
    const [improve, setImprove] = useState([]);
    const [recommend, setRecommend] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 기본적으로 로그아웃된 상태로 설정
    const [loggedInMemberId, setLoggedInMemberId] = useState(''); // 하드코딩된 멤버 ID

    const fetchData = (url, setState) => {
        console.log(`Fetching data from ${url}`);
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': '*/*'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data && data.item) {
                    setState(data.item);
                } else {
                    console.error('Invalid data format:', data);
                    setState([]);  
                }
            })
            .catch(error => console.error(`Error fetching data from ${url}:`, error));
    };

    useEffect(() => {
        // 로그인 여부 확인
        const loginStatus = sessionStorage.getItem('login') === 'true';
        setIsLoggedIn(loginStatus);

        // 로그인되어 있으면 멤버 아이디 설정
        if (loginStatus) {
            const memberId = sessionStorage.getItem('memberId');
            setLoggedInMemberId(memberId);
        }
    }, []);

    useEffect(() => {
        if (loggedInMemberId) {
            console.log("Logged in member ID:", loggedInMemberId);
        }
    }, [loggedInMemberId]);
    
    useEffect(() => {
        fetchData('http://43.201.231.40:8080/open/bestseller', setBestsellers);
        fetchData('http://43.201.231.40:8080/open/bestseller/newBook', setNewBooks);
        fetchData('http://43.201.231.40:8080/open/bestseller/blogChoice', setBlogChoices);
        fetchData('http://43.201.231.40:8080/open/bestseller/category/170', setEconomicBooks);
        fetchData('http://43.201.231.40:8080/open/bestseller/category/1', setLiterature);
        fetchData('http://43.201.231.40:8080/open/bestseller/category/987', setScience);
        fetchData('http://43.201.231.40:8080/open/bestseller/category/656', setHumanities);
        fetchData('http://43.201.231.40:8080/open/bestseller/category/336', setImprove);
    }, []); // 최초 렌더링 시에만 실행되도록 빈 배열 전달

    useEffect(() => {
        // 로그인 상태인 경우에만 도서 추천 API 호출
        if (isLoggedIn && loggedInMemberId) {
            fetch(`http://43.201.231.40:8080/open/recommend/members/${loggedInMemberId}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.response && data.response.docs) {
                        setRecommend(data.response.docs); // API 응답 데이터에서 도서 목록 추출하여 상태 업데이트
                    } else {
                        console.error('Invalid data format:', data);
                    }
                })
                .catch(error => console.error('Error fetching recommend data:', error));
        }
    }, [isLoggedIn, loggedInMemberId]); 

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="second-screen">
            <h2>⭐ 오늘의 베스트셀러 </h2>
            <Slider {...settings}>
                {bestsellers.map((bestseller, index) => (
                    <div key={index} className="bestseller-item">
                        <div className="rank">{bestseller.bestRank}</div>
                        <img src={bestseller.cover} alt={bestseller.title} className="bestseller-image" />
                        <Link to={`/book/${bestseller.isbn13}`} className="title">
                            <div className="title">
                                <p>{bestseller.title}</p>
                            </div>
                        </Link>
                        <p className="author">{bestseller.author}</p>
                    </div>
                ))}
            </Slider>


            {isLoggedIn && (
    <>
        <h2>🍀 추천하는 도서 Top 10 </h2>
        <Slider {...settings}>
            {recommend.map((recommend, index) => (
                <div key={index} className="recommend-item">
                    <div className="rank">{recommend.doc.ranking}</div>
                    <img src={recommend.doc.bookImageURL} alt={recommend.doc.bookname} className="recommend-image" />
                    <Link to={`/book/${recommend.doc.isbn13}`} className="title">
                        <div className="title">
                            <p>{recommend.doc.bookname}</p>
                        </div>
                    </Link>
                    <p className="author">{recommend.doc.authors}</p>
                </div>
            ))}
        </Slider>
    </>
)}


            <h2>🆕 신간 베스트셀러</h2>
            <Slider {...settings}>
                {newBooks.map((newBook, index) => (
                    <div key={index} className="new-book-item">
                        <img src={newBook.cover} alt={newBook.title} className="new-book-image" />
                        <Link to={`/book/${newBook.isbn13}`} className="title">
                            <div className="title">
                                <p>{newBook.title}</p>
                            </div>
                        </Link>
                        <p className="author">{newBook.author}</p>
                    </div>
                ))}
            </Slider>

            <h2>✔ Blog Choice 베스트셀러</h2>
            <Slider {...settings}>
                {blogChoices.map((blogChoice, index) => (
                    <div key={index} className="blog-choice-item">
                        <div className="rank01">{blogChoice.bestRank}</div>
                        <img src={blogChoice.cover} alt={blogChoice.title} className="blog-choice-image" />
                        <Link to={`/book/${blogChoice.isbn13}`} className="title">
                            <div className="title">
                                <p>{blogChoice.title}</p>
                            </div>
                        </Link>
                        <p className="author">{blogChoice.author}</p>
                    </div>
                ))}
            </Slider>

            <h2>📔경영경제 베스트셀러</h2>
            <Slider {...settings}>
                {economicBooks.map((economicBook, index) => (
                    <div key={index} className="economic-books-item">
                        <div className="rank02">{economicBook.bestRank}</div>
                        <img src={economicBook.cover} alt={economicBook.title} className="econmoic-books-image" />
                        <Link to={`/book/${economicBook.isbn13}`} className="title">
                            <div className="title">
                                <p>{economicBook.title}</p>
                            </div>
                        </Link>
                        <p className="author">{economicBook.author}</p>
                    </div>
                ))}
            </Slider>

            <h2>📚 문학 베스트셀러</h2>
            <Slider {...settings}>
                {literature.map((literatureBook, index) => (
                    <div key={index} className="literature-books-item">
                        <div className="rank03">{literatureBook.bestRank}</div>
                        <img src={literatureBook.cover} alt={literatureBook.title} className="literature-books-image" />
                        <Link to={`/book/${literatureBook.isbn13}`} className="title">
                            <div className="title">
                                <p>{literatureBook.title}</p>
                            </div>
                        </Link>
                        <p className="author">{literatureBook.author}</p>
                    </div>
                ))}
            </Slider>

            <h2>🧪 과학 베스트셀러</h2>
            <Slider {...settings}>
                {science.map((scienceBook, index) => (
                    <div key={index} className="science-books-item">
                        <div className="rank03">{scienceBook.bestRank}</div>
                        <img src={scienceBook.cover} alt={scienceBook.title} className="science-books-image" />
                        <Link to={`/book/${scienceBook.isbn13}`} className="title">
                            <div className="title">
                                <p>{scienceBook.title}</p>
                            </div>
                        </Link>
                        <p className="author">{scienceBook.author}</p>
                    </div>
                ))}
            </Slider>

            <h2>👥 인문 베스트셀러</h2>
            <Slider {...settings}>
                {humanities.map((humanitiesBook, index) => (
                    <div key={index} className="humanities-books-item">
                        <div className="rank03">{humanitiesBook.bestRank}</div>
                        <img src={humanitiesBook.cover} alt={humanitiesBook.title} className="humanities-books-image" />
                        <Link to={`/book/${humanitiesBook.isbn13}`} className="title">
                            <div className="title">
                                <p>{humanitiesBook.title}</p>
                            </div>
                        </Link>
                        <p className="author">{humanitiesBook.author}</p>
                    </div>
                ))}
            </Slider>

            <h2>💪 자기계발 베스트셀러</h2>
            <Slider {...settings}>
                {improve.map((improveBook, index) => (
                    <div key={index} className="improve-books-item">
                        <div className="rank03">{improveBook.bestRank}</div>
                        <img src={improveBook.cover} alt={improveBook.title} className="improve-books-image" />
                        <Link to={`/book/${improveBook.isbn13}`} className="title">
                            <div className="title">
                                <p>{improveBook.title}</p>
                            </div>
                        </Link>
                        <p className="author">{improveBook.author}</p>
                    </div>
                ))}
            </Slider>


</div>
    );
}

export default SecondScreen;
