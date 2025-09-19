import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import Row from "./components/Row";
import TrailerModal from "./components/TrailerModal";
import requests from "./requests";
import axios from "axios";

export default App;
const API_KEY = "e20a8d9fa24c2edfa061ed09463bd68f";
const BASE_URL = "https://api.themoviedb.org/3";

function App() {
  const [trailerUrl, setTrailerUrl] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fetch trailer from TMDB
  const handleCardClick = async (movie) => {
    let id = movie.id;
    let type = movie.media_type || (movie.title ? "movie" : "tv");
    try {
      const res = await axios.get(
        `${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`
      );
      const trailer = res.data.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      if (trailer) {
        setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1`);
        setShowModal(true);
      } else {
        setTrailerUrl("");
        setShowModal(false);
        alert("Trailer not available");
      }
    } catch (err) {
      setTrailerUrl("");
      setShowModal(false);
      alert("Error fetching trailer");
    }
  };

  return (
    <div className="App">
      <Navbar />
      <Banner />
      <Row
        title="Trending Now"
        fetchUrl={requests.fetchTrending}
        onCardClick={handleCardClick}
      />
      <Row
        title="Netflix Originals"
        fetchUrl={requests.fetchNetflixOriginals}
        isLargeRow
        onCardClick={handleCardClick}
      />
      <Row
        title="Top Rated"
        fetchUrl={requests.fetchTopRated}
        onCardClick={handleCardClick}
      />
      <Row
        title="Action Movies"
        fetchUrl={requests.fetchActionMovies}
        onCardClick={handleCardClick}
      />
      <Row
        title="Comedy Movies"
        fetchUrl={requests.fetchComedyMovies}
        onCardClick={handleCardClick}
      />
      <Row
        title="Horror Movies"
        fetchUrl={requests.fetchHorrorMovies}
        onCardClick={handleCardClick}
      />
      <Row
        title="Romance Movies"
        fetchUrl={requests.fetchRomanceMovies}
        onCardClick={handleCardClick}
      />
      <Row
        title="Documentaries"
        fetchUrl={requests.fetchDocumentaries}
        onCardClick={handleCardClick}
      />
      <TrailerModal show={showModal} trailerUrl={trailerUrl} onClose={() => setShowModal(false)} />
    </div>
  );
}


