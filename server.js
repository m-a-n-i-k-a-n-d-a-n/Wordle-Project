const express = require("express");
const fs = require("fs");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const USERS_FILE = "users.json";
const RANDOM_WORD_API = "https://random-word-api.herokuapp.com/word?number=1&length=5";
const DICTIONARY_API = "https://api.dictionaryapi.dev/api/v2/entries/en/";

// Fetch a random 5-letter word
app.get("/random-word", async (req, res) => {
  try {
    const response = await axios.get(RANDOM_WORD_API);
    const word = response.data[0].toUpperCase();
    console.log("Random Word Sent to Client:", word); 
    res.json({ word });
  } catch (error) {
    console.error("Error fetching random word:", error.message);
    res.status(500).json({ error: "Failed to fetch a random word" });
  }
});


// Check if a word is a valid English word
app.get("/validate-word/:word", async (req, res) => {
  try {
    const word = req.params.word.toLowerCase();
    const response = await axios.get(`${DICTIONARY_API}${word}`);
    if (response.data && response.data.length > 0) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  } catch (error) {
    res.json({ valid: false }); // If API fails, assume it's invalid
  }
});

app.get("/users", (req, res) => {
  fs.readFile(USERS_FILE, (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading users." });
    res.json(JSON.parse(data));
  });
});

app.post("/users", (req, res) => {
  const { email, password } = req.body;

  fs.readFile(USERS_FILE, (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading users." });

    const users = JSON.parse(data);
    users.push({ email, password });

    fs.writeFile(USERS_FILE, JSON.stringify(users), (err) => {
      if (err) return res.status(500).json({ error: "Error saving user." });
      res.json({ message: "User registered successfully." });
    });
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
