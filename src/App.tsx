// No need to import React
import './App.css';

const App = () => {
  const rows = 5;
  const columns = 4;

  return (
    <div className="App">
      <div className="grid">
        {Array.from({ length: rows * columns }).map((_, index) => (
          <button key={index} className="grid-button">
            Button {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
