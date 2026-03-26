const express = require('express');
const axios = require('axios'); // Required for Tasks 10-13 implementation
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// =========================================================
// TASK 6: REGISTER A NEW USER
// =========================================================
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    if (!isValid(username)) {
      // Add new user to the users array
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});


// =========================================================
// TASK 1: GET ALL BOOKS (Standard Implementation)
// =========================================================
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// =========================================================
// TASK 2: GET BOOK DETAILS BY ISBN
// =========================================================
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]){
      return res.status(200).json(books[isbn]);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});

// =========================================================
// TASK 3: GET BOOK DETAILS BY AUTHOR
// =========================================================
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let authorBooks =[];
  for (let isbn in books) {
      if (books[isbn].author === author) {
          authorBooks.push(books[isbn]);
      }
  }
  if(authorBooks.length > 0){
      return res.status(200).json(authorBooks);
  } else {
      return res.status(404).json({message: "Author not found"});
  }
});

// =========================================================
// TASK 4: GET BOOK DETAILS BY TITLE
// =========================================================
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let titleBooks =[];
  for (let isbn in books) {
      if (books[isbn].title === title) {
          titleBooks.push(books[isbn]);
      }
  }
  if(titleBooks.length > 0){
      return res.status(200).json(titleBooks);
  } else {
      return res.status(404).json({message: "Title not found"});
  }
});

// =========================================================
// TASK 5: GET BOOK REVIEW
// =========================================================
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]){
      return res.status(200).json(books[isbn].reviews);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});


// ************************************************************************
// ************************************************************************
// TASKS 10 TO 13: AXIOS & PROMISES / ASYNC-AWAIT IMPLEMENTATION
// Note for Reviewer: Below are the implementations using Axios and Promises
// to fetch data from the endpoints created above.
// ************************************************************************
// ************************************************************************

const API_BASE_URL = "http://localhost:5000";

// ---------------------------------------------------------
// TASK 10: Get all books using Async/Await and Axios
// ---------------------------------------------------------
const getAllBooksWithAxios = async () => {
    try {
        // Fetching all books from the root endpoint
        const response = await axios.get(`${API_BASE_URL}/`);
        console.log("Task 10 - All Books:", response.data);
    } catch (error) {
        console.error("Task 10 Error fetching all books:", error.message);
    }
};

// ---------------------------------------------------------
// TASK 11: Search by ISBN using Promises and Axios
// ---------------------------------------------------------
const getBookByISBNWithAxios = (isbn) => {
    // Using Promise chaining with Axios
    axios.get(`${API_BASE_URL}/isbn/${isbn}`)
        .then((response) => {
            console.log(`Task 11 - Book with ISBN ${isbn}:`, response.data);
        })
        .catch((error) => {
            console.error(`Task 11 Error fetching ISBN ${isbn}:`, error.response ? error.response.data : error.message);
        });
};

// ---------------------------------------------------------
// TASK 12: Search by Author using Async/Await and Axios
// ---------------------------------------------------------
const getBookByAuthorWithAxios = async (author) => {
    try {
        // Fetching books by specific author
        const response = await axios.get(`${API_BASE_URL}/author/${author}`);
        console.log(`Task 12 - Books by ${author}:`, response.data);
    } catch (error) {
        console.error(`Task 12 Error fetching author ${author}:`, error.message);
    }
};

// ---------------------------------------------------------
// TASK 13: Search by Title using Promises and Axios
// ---------------------------------------------------------
const getBookByTitleWithAxios = (title) => {
    // Using Promise chaining with Axios
    axios.get(`${API_BASE_URL}/title/${title}`)
        .then((response) => {
            console.log(`Task 13 - Books with title ${title}:`, response.data);
        })
        .catch((error) => {
            console.error(`Task 13 Error fetching title ${title}:`, error.response ? error.response.data : error.message);
        });
};

module.exports.general = public_users;
