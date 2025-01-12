import './App.css';
import { useEffect, useState } from 'react';

const App = () => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [aboveGrid, setAboveGrid] = useState<string[]>([]);
  const [buttonPositions, setButtonPositions] = useState<Map<string, { row: number, col: number }>>(new Map());
  const [all, setAll] = useState<Set<string>>(new Set());
  const [score, setScore] = useState<number>(0);
  const [rank, setRank] = useState<string>("老外");
  const [rows, setRows] = useState<number>(0);

  const points = [0, 1, 2, 4, 8];

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

    let max = 40;
    for(const word of allWords) {
      max += points[word.length];
    }

    return max >= 120;
  };

  useEffect(() => {
    fetch('./text/words.txt')
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

        console.log(allWords);

        const chars = Array.from(charSet);
        for (let i = chars.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [chars[i], chars[j]] = [chars[j], chars[i]];
        }
        
        const gridArray: string[][] = [];
        let row: string[] = [];
        let positionMap = new Map<string, { row: number, col: number }>();

        for (let i = 0; i < chars.length; i++) {
          row.push(chars[i]);
          positionMap.set(chars[i], { row: Math.floor(i / 4), col: i % 4 });
          if (row.length === 4) {
            gridArray.push(row);
            row = [];
          }
        }

        setGrid(gridArray);
        setButtonPositions(positionMap);
        setAll(allWords);
      })
      .catch((error) => console.error('Error loading words.txt:', error));
  }, []);

  // Handle button click (remove word from grid, keep button in place)
  const handleGridClick = (word: string, index: number) => {
    if(!word) {
      const row = Math.floor(index / 4);
      const col = index % 4;
      for(const s of aboveGrid) {
        if(buttonPositions.get(s)?.row == row && buttonPositions.get(s)?.col == col) {
          handleAboveGridClick(s);
        }
      }
      return;
    }
    if(aboveGrid.length == 4) return;
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map(row => row.map(cell => (cell === word ? '' : cell)));
      return newGrid;
    });
    setAboveGrid((prevAboveGrid) => [...prevAboveGrid, word]);
  };

  // Handle button click (move word back to grid from above grid)
  const handleAboveGridClick = (word: string) => {
    setAboveGrid((prevAboveGrid) => prevAboveGrid.filter(item => item !== word));

    setGrid((prevGrid) => {
      const gridClone = [...prevGrid];
      const position = buttonPositions.get(word);
      if (position) {
        gridClone[position.row][position.col] = word;
      }
      return gridClone;
    });
  };

  const handleSubmitClick = () => {
    let word = "";
    for(const s of aboveGrid) {
      word += s;
    }

    setAboveGrid([]);
    const nextGrid = [...grid];
    for(const entry of buttonPositions) {
      const pos = entry[1];
      nextGrid[pos.row][pos.col] = entry[0];
    }

    let nextScore = score;

    if(all.has(word)) {
      if(word.length == 4) {
        for(let i = 0; i < 4; i++) {
          const c = word[i];
          const pos = buttonPositions.get(c)!;
          buttonPositions.set(grid[4-rows][i], pos);
          buttonPositions.set(c, {row: 4 - rows, col: i});
          nextGrid[pos.row][pos.col] = nextGrid[4-rows][i];
          nextGrid[4-rows][i] = c;
        }
        if(rows == 4) {
          nextScore += 40;
        }
        setRows((prev) => prev + 1);
      }
      nextScore += points[word.length];
      all.delete(word);
    }

    setGrid(nextGrid);

    if(nextScore >= 100) {
      setRank("高手");
    } else if(nextScore >= 50) {
      setRank("专家");
    } else if(nextScore >= 30) {
      setRank("学者");
    } else if(nextScore >= 15) {
      setRank("徒弟");
    } else if(nextScore >= 5) {
      setRank("新手");
    } else {
      setRank("老外");
    }

    setScore(nextScore);
  };

  return (
      <div className="app-container">
        <div className="header-container">
        <h1 className="left-heading">{rank}</h1>
        <h1 className="right-heading">{score}</h1>
      </div>

        {/* Render the buttons above the grid */}
        <div className="top-container">
          {aboveGrid.map((word, index) => (
            <button 
              key={index}
              className="grid-button"
              onClick={() => handleAboveGridClick(word)}
            >
              {word}
            </button>
          ))}
        </div>

        {/* Render the grid */}
        <div className="grid-container">
          {grid.map((row, rowIndex) =>
            row.map((word, colIndex) => {
              if(rowIndex + rows > 4) {
                return <button
                  key={`${rowIndex}-${colIndex}`}
                  className="success-button"
                  onClick={() => handleGridClick(word, rowIndex*4 + colIndex)}
                >
                  {word || ' '}
                </button>;
              } else {
                return <button
                  key={`${rowIndex}-${colIndex}`}
                  className="grid-button"
                  onClick={() => handleGridClick(word, rowIndex*4 + colIndex)}
                >
                  {word || ' '}
                </button>;
              }
            })
          )}
        </div>

        <button className="submit-button" onClick={() => handleSubmitClick()}>
          ✓
        </button>
      </div>
  );
};

export default App;
