
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Required for Task 10-13

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json({books: books});
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
});
  
// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksbyauthor = [];
  for (let isbn in books) {
    if (books[isbn].author === author) {
      booksbyauthor.push({"isbn":isbn, ...books[isbn]});
    }
  }
  return res.status(200).json({booksbyauthor: booksbyauthor});
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booksbytitle = [];
  for (let isbn in books) {
    if (books[isbn].title === title) {
      booksbytitle.push({"isbn":isbn, ...books[isbn]});
    }
  }
  return res.status(200).json({booksbytitle: booksbytitle});
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json({reviews: books[isbn].reviews});
});

// -----------------------------------------------------------------
// TASKS 10-13: ASYNC / AWAIT / PROMISES WITH AXIOS
// -----------------------------------------------------------------

// Task 10: Get all books - Async/Await
public_users.get('/async/books', async function (req,res) {
    try {
        let response = await Promise.resolve(books);
        return res.status(200).json({books: response});
    } catch (error) {
        return res.status(500).json({message: "Error fetching books"});
    }
});

// Task 11: Get book details by ISBN - Promises
public_users.get('/async/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    let getBook = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });

    getBook.then(
        (book) => res.status(200).json(book),
        (error) => res.status(404).json({message: error})
    );
});

// Task 12: Get book details by Author - Async/Await
public_users.get('/async/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        let booksbyauthor = [];
        let response = await Promise.resolve(books);
        for (let isbn in response) {
            if (response[isbn].author === author) {
                booksbyauthor.push({"isbn":isbn, ...response[isbn]});
            }
        }
        return res.status(200).json({booksbyauthor: booksbyauthor});
    } catch (error) {
        return res.status(500).json({message: "Error finding author"});
    }
});

// Task 13: Get book details by Title - Async/Await
public_users.get('/async/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        let booksbytitle = [];
        let response = await Promise.resolve(books);
        for (let isbn in response) {
            if (response[isbn].title === title) {
                booksbytitle.push({"isbn":isbn, ...response[isbn]});
            }
        }
        return res.status(200).json({booksbytitle: booksbytitle});
    } catch (error) {
        return res.status(500).json({message: "Error finding title"});
    }
});

module.exports.general = public_users;
