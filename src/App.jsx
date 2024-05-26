import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';
import Photo from './photo'; // Ensure this import is correct
import Analysis from './analysis';
import Glasses from './glasses';
import Erji from './erji';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/photo" element={<Photo />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/glasses" element={<Glasses />} />
        <Route path="/erji" element={<Erji />} />
        {/* Other routes can be added here */}
      </Routes>
    </Router>
  );
}

export default App;
