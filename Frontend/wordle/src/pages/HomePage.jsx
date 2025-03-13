import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./HomePage.css";

const HomePage = () => {
  const [grid, setGrid] = useState(Array(7).fill(null).map(() => Array(5).fill("")));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [usedLetters, setUsedLetters] = useState({});
  const [lockedRows, setLockedRows] = useState(new Set());
  const [randomWord, setRandomWord] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const inputRefs = useRef([...Array(7)].map(() => Array(5).fill(null)));
  const [gridColors, setGridColors] = useState(Array(7).fill(null).map(() => Array(5).fill("")));
  const [showPopupwin, setShowPopupwin] = useState(false);
  const [showPopuplose, setShowPopuplose] = useState(false);

  const resetGame = async () => {
    setShowPopupwin(false);
    setShowPopuplose(false);
    setGameOver(false);
    setMessage("");
    setGrid(Array(7).fill(null).map(() => Array(5).fill(""))); // Reset the grid
    setGridColors(Array(7).fill(null).map(() => Array(5).fill(""))); // Reset colors
    setUsedLetters({}); // Reset keyboard colors
    setCurrentRow(0);
    setCurrentCol(0);
    setLockedRows(new Set()); // Unlock all rows
  
    try {
      const response = await axios.get("http://localhost:5000/random-word");
      setRandomWord(response.data.word); // Fetch a new word from the server
      console.log("New Random Word:", response.data.word);
    } catch (error) {
      console.error("Error fetching new word:", error);
    }
  
    inputRefs.current[0][0]?.focus(); // Focus on the first input
  };
  

  useEffect(() => {
    inputRefs.current[0][0]?.focus();
  }, []);
  

  useEffect(() => {
    let isMounted = true;
    const fetchRandomWord = async () => {
      try {
        const response = await axios.get("http://localhost:5000/random-word");
        if (isMounted) {
          setRandomWord(response.data.word);
          console.log("Random Word for Game:", response.data.word);
        }
      } catch (error) {
        console.error("Error fetching word:", error);
      }
    };

    fetchRandomWord();

    return () => {
      isMounted = false;
    };
  }, []);

  

  const handleKeyPress = async (key) => {
    if (gameOver || lockedRows.has(currentRow)) return;

    if (key === "Enter") {
      const userWord = grid[currentRow].join("");

      if (userWord.length < 5) {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
        return;
      }

      try {
        const validationResponse = await axios.get(`http://localhost:5000/validate-word/${userWord.toLowerCase()}`);
        if (!validationResponse.data.valid) {
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 2000);
          return;
        }
      } catch (error) {
        console.error("Validation error:", error);
      }

      const newUsedLetters = { ...usedLetters };
      const wordArray = randomWord.split(""); // ✅ Fix for "wordArray is undefined"
      const newGridColors = [...gridColors];

      for (let i = 0; i < 5; i++) {
        const letter = grid[currentRow][i];

        if (letter === wordArray[i]) {
          newUsedLetters[letter] = "green";
          newGridColors[currentRow][i] = "green";
        } else if (wordArray.includes(letter)) {
          newUsedLetters[letter] = "yellow";
          newGridColors[currentRow][i] = "yellow";
        } else {
          newUsedLetters[letter] = "grey";
          newGridColors[currentRow][i] = "grey";
        }
      }

      setGridColors(newGridColors); // ✅ Fix color update
      setUsedLetters((prev) => ({ ...prev, ...newUsedLetters })); // ✅ Fix keyboard color update
      setLockedRows((prev) => new Set(prev).add(currentRow));

      if (userWord === randomWord) {
        setShowPopupwin(true);
        
        setGameOver(true);
        return;
      }

      if (currentRow === 6) {
        setShowPopuplose(true);
        setGameOver(true);
        return;
      } else {
        setCurrentRow((prev) => prev + 1); // ✅ Fix row progression
        setCurrentCol(0); // ✅ Reset column position
      }

      return;
    }

    if (key === "Backspace") {
      if (currentCol === 0 && grid[currentRow][0] === "") return;

      const newGrid = [...grid];
      let colToDelete = currentCol;
      if (newGrid[currentRow][colToDelete] === "" && colToDelete > 0) {
        colToDelete -= 1;
      }
      newGrid[currentRow][colToDelete] = "";
      setGrid(newGrid);
      setCurrentCol(colToDelete);
      return;
    }

    if (/^[a-zA-Z]$/.test(key) && currentCol < 5) {
      const newGrid = [...grid];
      if (newGrid[currentRow][currentCol] === "") {
        newGrid[currentRow][currentCol] = key.toUpperCase();
        setGrid(newGrid);
        setCurrentCol((prev) => (prev < 4 ? prev + 1 : 4));
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => handleKeyPress(e.key);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentRow, currentCol, grid, lockedRows]);

  return (
    <div className="container">
      {showPopup && <div className="popup">Invalid word or incomplete entry!</div>}
      {showPopupwin && (
        <div className="popupwin">🎉 You won! 🎉<br />
          <button className="new-game-btn" onClick={resetGame}>New Game</button>
        </div>
      )}
      {showPopuplose && (
        <div className="popupwin">👎You lose! 👎<br />
          The word was: {randomWord}<br />
          <button className="new-game-btn" onClick={resetGame}>New Game</button>
        </div>
      )}
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((letter, colIndex) => (
              <input
                key={colIndex}
                type="text"
                className={`box ${gridColors[rowIndex][colIndex] || ""}`} // ✅ Use gridColors for coloring
                value={letter}
                maxLength={1}
                readOnly
                ref={(el) => (inputRefs.current[rowIndex][colIndex] = el)}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="keyboard">
        {["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row) => (
          <div key={row} className="keyboard-row">
            {row.split("").map((letter) => (
              <button key={letter} className={usedLetters[letter] || ""} onClick={() => handleKeyPress(letter)}>
                {letter}
              </button>
            ))}
          </div>
        ))}
      </div>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default HomePage;
