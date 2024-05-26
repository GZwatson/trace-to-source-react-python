import React, { useEffect } from 'react';
import './analysis.css';

const Analysis = () => {
  useEffect(() => {
    const text = document.querySelector('.text');
    const textContent = text.textContent;
    let displayText = '';
    let index = 0;

    const animateText = () => {
      if (index < textContent.length) {
        displayText += textContent[index];
        text.textContent = displayText;
        index++;
        setTimeout(animateText, 400); // Adjust the speed of the animation here
      } else {
        setTimeout(() => {
          displayText = '';
          index = 0;
          text.textContent = displayText;
          animateText();
        }, 1000); // Adjust the delay before repeating the animation here
      }
    };

    animateText();
  }, []);

  return (
    <div className="analysis-container">
      <div className="box"></div>
      <div className="text">溯源生产 {">>>"}</div>
      <button className="capture-button2">Start</button>
    </div>
  );
};

export default Analysis;
