import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './photo.css';

const Photo = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const transitionVideoRef = useRef(null);
  const [videoZIndex, setVideoZIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    };

    getUserMedia();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      canvasRef.current.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('image', blob, 'capture.jpg');

        try {
          const response = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData,
          });
          if (response.ok) {
            const resultText = await response.text();
            if (transitionVideoRef.current) {
              setVideoZIndex(10);  // Change z-index to 10
              transitionVideoRef.current.play();
              transitionVideoRef.current.onended = () => {
                if (resultText === '眼镜') {
                  navigate('/glasses');
                } else if(resultText === '耳机'){
                  navigate('/erji');
                }
                 else {
                  navigate('/analysis', { state: { resultText } });
                }
              };
            } else {
              if (resultText === '眼镜') {
                navigate('/glasses');
              } else {
                navigate('/analysis', { state: { resultText } });
              }
            }
          } else {
            console.error('Image upload failed');
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }, 'image/jpeg');
    }
  };

  return (
    <div
      className="image-container"
      style={{ backgroundImage: `url('/photo1.jpg')` }}
    >
      <video ref={videoRef} className="webcam-feed" autoPlay></video>
      <canvas ref={canvasRef} className="snapshot-canvas" width="690" height="520"></canvas>
      <video ref={transitionVideoRef} className="transition-video" src="/transition2.mp4" style={{ zIndex: videoZIndex }}></video>
      <button className="capture-button" onClick={captureImage}>Start Scanning</button>
    </div>
  );
};

export default Photo;
