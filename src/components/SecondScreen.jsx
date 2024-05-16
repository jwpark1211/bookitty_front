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

    useEffect(() => {
        fetch('http://43.201.231.40:8080/open/bestseller', {
            method: 'GET',
            headers: {
                'Accept': '*/*'
            }
        })
            .then(response => response.json())
            .then(data => {
                setBestsellers(data.item); 
            })
            .catch(error => console.error('Error fetching bestsellers:', error));
    }, []);

    useEffect(() => {
        fetch('http://43.201.231.40:8080/open/bestseller/newBook', {
            method: 'GET',
            headers: {
                'Accept': '*/*'
            }
        })
            .then(response => response.json())
            .then(data => {
                setNewBooks(data.item); 
            })
            .catch(error => console.error('Error fetching new books:', error));
    }, []);

    useEffect(() => {
        fetch('http://43.201.231.40:8080/open/bestseller/blogChoice', {
            method: 'GET',
            headers: {
                'Accept': '*/*'
            }
        })
            .then(response => response.json())
            .then(data => {
                setBlogChoices(data.item); 
            })
            .catch(error => console.error('Error fetching blog choices:', error));
    }, []);

    useEffect(() => {
        fetch('http://43.201.231.40:8080/open/bestseller/category/170', {
            method: 'GET',
            headers: {
                'Accept': '*/*'
            }
        })
            .then(response => response.json())
            .then(data => {
                setEconomicBooks(data.item); 
            })
            .catch(error => console.error('Error fetching blog choices:', error));
    }, []);

    useEffect(() => {
        fetch('http://43.201.231.40:8080/open/bestseller/category/1', {
            method: 'GET',
            headers: {
                'Accept': '*/*'
            }
        })
            .then(response => response.json())
            .then(data => {
                setLiterature(data.item); 
            })
            .catch(error => console.error('Error fetching blog choices:', error));
    }, []);

    useEffect(() => {
        fetch('http://43.201.231.40:8080/open/bestseller/category/987', {
            method: 'GET',
            headers: {
                'Accept': '*/*'
            }
        })
            .then(response => response.json())
            .then(data => {
                setScience(data.item); 
            })
            .catch(error => console.error('Error fetching blog choices:', error));
    }, []);

    useEffect(() => {
        fetch('http://43.201.231.40:8080/open/bestseller/category/656', {
            method: 'GET',
            headers: {
                'Accept': '*/*'
            }
        })
            .then(response => response.json())
            .then(data => {
                setHumanities(data.item); 
            })
            .catch(error => console.error('Error fetching blog choices:', error));
    }, []);

    useEffect(() => {
        fetch('http://43.201.231.40:8080/open/bestseller/category/336', {
            method: 'GET',
            headers: {
                'Accept': '*/*'
            }
        })
            .then(response => response.json())
            .then(data => {
                setImprove(data.item); 
            })
            .catch(error => console.error('Error fetching blog choices:', error));
    }, []);

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
                    <Link to={`/book/${bestseller.id}`} className="title">
                        <div className="title">
                            <p>{bestseller.title}</p>
                        </div>
                    </Link>
                    <p className="author">{bestseller.author}</p>
                </div>
            ))}
        </Slider>

            <h2>🆕 신간 베스트셀러</h2>
<Slider {...settings}>
    {newBooks.map((newBooks, index) => (
        <div key={index} className="new-book-item">
            <img src={newBooks.cover} alt={newBooks.title} className="new-book-image" />
            <a href={`/book/${newBooks.id}`} className="title">{/* <-- 수정 */}
                <div className="title">
                <p>{newBooks.title}</p>
                </div>
            </a>
            <p className="author">{newBooks.author}</p>
        </div>
    ))}
</Slider>

            <h2>✔ Blog Choice 베스트셀러</h2>
            <Slider {...settings}>
                {blogChoices.map((blogChoice, index) => (
                    <div key={index} className="blog-choice-item">
                        <div className="rank01">{blogChoice.bestRank}</div>
                        <img src={blogChoice.cover} alt={blogChoice.title} className="blog-choice-image" />
                        <a href={`/book/${blogChoice.id}`} className="title">
                        <div className="title">
                        <p>{blogChoice.title}</p>
                        </div>
                        </a>
                        <p className="author">{blogChoice.author}</p>
                    </div>
                ))}
            </Slider>


            <h2>📔경영경제 베스트셀러</h2>
            <Slider {...settings}>
                {economicBooks.map((economicBooks, index) => (
                    <div key={index} className="economic-books-item">
                        <div className="rank02">{economicBooks.bestRank}</div>
                        <img src={economicBooks.cover} alt={economicBooks.title} className="econmoic-books-image" />
                        <a href={`/book/${economicBooks.id}`} className="title">
                        <div className="title">
                        <p>{economicBooks.title}</p>
                        </div>
                        </a>
                        <p className="author">{economicBooks.author}</p>
                    </div>
                ))}
            </Slider>


            <h2>📚 문학 베스트셀러</h2>
            <Slider {...settings}>
                {literature.map((literature, index) => (
                    <div key={index} className="literature-books-item">
                        <div className="rank03">{literature.bestRank}</div>
                        <img src={literature.cover} alt={literature.title} className="literature-books-image" />
                        <a href={`/book/${literature.id}`} className="title">
                        <div className="title">
                        <p>{literature.title}</p>
                        </div>
                        </a>
                        <p className="author">{literature.author}</p>
                    </div>
                ))}
            </Slider>


            <h2>🧪 과학 베스트셀러</h2>
            <Slider {...settings}>
                {science.map((science, index) => (
                    <div key={index} className="science-books-item">
                        <div className="rank03">{science.bestRank}</div>
                        <img src={science.cover} alt={science.title} className="science-books-image" />
                        <a href={`/book/${science.id}`} className="title">
                        <div className="title">
                        <p>{science.title}</p>
                        </div>
                        </a>
                        <p className="author">{science.author}</p>
                    </div>
                ))}
            </Slider>


            <h2>👥 인문 베스트셀러</h2>
            <Slider {...settings}>
                {humanities.map((humanities, index) => (
                    <div key={index} className="humanities-books-item">
                        <div className="rank03">{humanities.bestRank}</div>
                        <img src={humanities.cover} alt={humanities.title} className="humanities-books-image" />
                        <a href={`/book/${humanities.id}`} className="title">
                        <div className="title">
                        <p>{humanities.title}</p>
                        </div>
                        </a>
                        <p className="author">{humanities.author}</p>
                    </div>
                ))}
            </Slider>


            <h2>💪 자기계발 베스트셀러</h2>
            <Slider {...settings}>
                {improve.map((improve, index) => (
                    <div key={index} className="improve-books-item">
                        <div className="rank03">{improve.bestRank}</div>
                        <img src={improve.cover} alt={improve.title} className="improve-books-image" />
                        <a href={`/book/${improve.id}`} className="title">
                        <div className="title">
                        <p>{improve.title}</p>
                        </div>
                        </a>
                        <p className="author">{improve.author}</p>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default SecondScreen;