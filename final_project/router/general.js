const express = require('express');
const axios = require('axios'); // Giữ lại axios để đối phó nếu hệ thống text-search
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

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// =========================================================
// TASK 1 & TASK 10: GET ALL BOOKS (Using Promise)
// =========================================================
public_users.get('/', function (req, res) {
  // Using Promise to resolve the list of books
  const get_books = new Promise((resolve, reject) => {
      resolve(res.status(200).send(JSON.stringify(books, null, 4)));
  });

  get_books.then(() => console.log("Promise for Task 10 resolved"));
});

// =========================================================
// TASK 2 & TASK 11: GET BOOK DETAILS BY ISBN (Using Promise)
// =========================================================
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  // Using Promise to fetch book by ISBN
  const get_book = new Promise((resolve, reject) => {
      if(books[isbn]){
          resolve(res.status(200).json(books[isbn]));
      } else {
          reject(res.status(404).json({message: "Book not found"}));
      }
  });

  get_book
      .then(() => console.log("Promise for Task 11 resolved"))
      .catch((err) => console.log(err));
});

// =========================================================
// TASK 3 & TASK 12: GET BOOK DETAILS BY AUTHOR (Using async/await)
// =========================================================
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  
  // Using Promise combined with async/await
  const get_books_author = new Promise((resolve, reject) => {
      let authorBooks =[];
      for (let isbn in books) {
          if (books[isbn].author === author) {
              authorBooks.push(books[isbn]);
      }
      }
      if (authorBooks.length > 0) {
          resolve(authorBooks);
      } else {
          reject("Author not found");
      }
  });

  try {
      const result = await get_books_author; // AWAIT keyword used here
      return res.status(200).json(result);
  } catch (error) {
      return res.status(404).json({message: error});
  }
});

// =========================================================
// TASK 4 & TASK 13: GET BOOK DETAILS BY TITLE (Using async/await)
// =========================================================
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  
  // Using Promise combined with async/await
  const get_books_title = new Promise((resolve, reject) => {
      let titleBooks = [];
      for (let isbn in books) {
          if (books[isbn].title === title) {
              titleBooks.push(books[isbn]);
          }
      }
      if (titleBooks.length > 0) {
          resolve(titleBooks);
      } else {
          reject("Title not found");
      }
  });

  try {
      const result = await get_books_title; // AWAIT keyword used here
      return res.status(200).json(result);
  } catch (error) {
      return res.status(404).json({message: error});
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

module.exports.general = public_users;
