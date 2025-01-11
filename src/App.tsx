import './App.css';
import { useEffect, useState } from 'react';

const App = () => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [all, setAll] = useState<Set<string>>(new Set());

  const createGrid = (four: string[], allWords: Set<string>): Set<string> => {
    const chars = new Set<string>();

    // Select words and characters until we have 20 unique characters
    loop:
    while (chars.size < 20) {
      const rand = Math.floor(Math.random() * four.length);
      const word = four[rand];
      for (const c of word) {
        if (chars.has(c)) continue loop;
      }
      for (const c of word) {
        chars.add(c);
      }
      allWords.add(word);
    }

    return chars;
  };

  const check = (chars: Set<string>, phrases: Set<string>, allWords: Set<string>): boolean => {
    loop:
    for(const phrase of phrases) {
      for(const char of phrase) {
        if(!chars.has(char)) continue loop;
      }
      allWords.add(phrase);
    }

    let max = 0;
    for(const word of allWords) {
      max += word.length - 2;
    }

    return true;
  };

  useEffect(() => {
    fetch('/words.txt')
      .then(r => r.text())
      .then(text => {
        const phrases = new Set<string>();
        const four: string[] = [];
        const words = text.split("\n");

        for (const word of words) {
          if (word.length < 4) {
            phrases.add(word);
          } else {
            four.push(word);
          }
        }

        let allWords;
        let charSet;
        do {
          allWords = new Set<string>();
          charSet = createGrid(four, allWords);
        } while(!check(charSet, phrases, allWords));

        const chars = Array.from(charSet);
        for (let i = chars.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [chars[i], chars[j]] = [chars[j], chars[i]];
        }
        
        const gridArray: string[][] = [];
        let row: string[] = [];

        for (const char of chars) {
          row.push(char);
          if (row.length === 4) {
            gridArray.push(row);
            row = [];
          }
        }

        setGrid(gridArray);
        setAll(allWords);
        console.log(allWords);
      })
      .catch((error) => console.error('Error loading words.txt:', error));
  }, []);

  const rows = 5;
  const cols = 4;

  return (
    <div className="App">
      <div className="grid">
        {Array.from({ length: rows * cols }).map((_, index) => (
          <button key={index} className="grid-button">
            {grid[Math.floor(index / 4)]?.[index % 4] || ''}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
