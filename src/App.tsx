import './App.css';
import React, { useEffect, useState } from 'react';

const App = () => {
  const [grid, setGrid] = useState(new Array());
  const [phrase, setPhrase] = useState(new Set());
  const [four, setFour] = useState(new Array());

  useEffect(() => {
    fetch('/words.txt')
      .then(r => r.text())
      .then(text => {
        const phrase = new Set();
        const four = new Array();
        const words = text.split("\n");
        for(const word of words) {
          if(word.length < 4) {
            phrase.add(word);
          } else {
            four.push(word);
          }
        }

        setPhrase(phrase);
        setFour(four);
      });
  }, []);
  

  const rows = 5;
  const cols = 4;

  return (
    <div className="App">
      <div className="grid">
        {Array.from({ length: rows * cols }).map((_, index) => (
          <button key={index} className="grid-button">
            Button {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
