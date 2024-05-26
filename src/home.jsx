import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
  const [showTransition, setShowTransition] = useState(false);
  const backgroundVideoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        setShowTransition(true);
        if (backgroundVideoRef.current) {
          backgroundVideoRef.current.pause();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleTransitionEnd = () => {
    navigate('/photo');
  };

  return (
    <div className="video-container">
      <video
        ref={backgroundVideoRef}
        className={`video-background ${showTransition ? 'fade-out' : 'fade-in'}`}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/background.mp4" type="video/mp4" />
        您的浏览器不支持视频标签。
      </video>
      {showTransition && (
        <video
          className="video-transition fade-in"
          autoPlay
          muted
          playsInline
          onEnded={handleTransitionEnd}
        >
          <source src="/transition.mp4" type="video/mp4" />
          您的浏览器不支持视频标签。
        </video>
      )}
    </div>
  );
};

export default Home;
