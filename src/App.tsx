import './App.css';
import { useEffect, useState } from 'react';

const App = () => {
  const [grid, setGrid] = useState(new Array());
  const [all, setAll] = useState(new Set());

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

        const all = new Set();
        const chars = new Set();
        loop:
        while(chars.size < 20) {
          const rand = Math.floor(Math.random() * four.length);
          const word = four[rand];
          for(const c of word) {
            if(chars.has(c)) continue loop;
          }
          for(const c of word) {
            chars.add(c);
          }
          all.add(word);
        }

        const grid = new Array();

        for(const char of chars) {
          if(grid.length == 0 || grid[grid.length-1].length == 4) {
            grid.push(new Array());
          }
          grid[grid.length-1].push(char);
        }

        console.log(grid);
        setGrid(grid);
        setAll(all);
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
