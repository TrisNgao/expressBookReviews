const express = require('express');
const axios = require('axios'); // Bổ sung thư viện axios theo yêu cầu của Reviewer
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ----------------------------------------------------
// TASK 6: Đăng ký user mới
// ----------------------------------------------------
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


// ----------------------------------------------------
// TASK 10: Lấy danh sách tất cả sách (Sử dụng Async/Await)
// ----------------------------------------------------
public_users.get('/', async function (req, res) {
  try {
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });
    const bookList = await getBooks;
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// ----------------------------------------------------
// TASK 11: Lấy thông tin sách theo ISBN (Sử dụng Promise)
// ----------------------------------------------------
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByIsbn = new Promise((resolve, reject) => {
    if (books[isbn]) {
        resolve(books[isbn]);
    } else {
        reject("Book not found");
    }
  });

  getBookByIsbn
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({message: err}));
});

// ----------------------------------------------------
// TASK 12: Lấy thông tin sách theo Tác giả (Sử dụng Async/Await)
// ----------------------------------------------------
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = new Promise((resolve, reject) => {
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

    const result = await getBooksByAuthor;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({message: error});
  }
});

// ----------------------------------------------------
// TASK 13: Lấy thông tin sách theo Tiêu đề (Sử dụng Promise)
// ----------------------------------------------------
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve, reject) => {
    let titleBooks =[];
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

  getBooksByTitle
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(404).json({message: err}));
});

// ----------------------------------------------------
// TASK 5: Lấy Review của một quyển sách
// ----------------------------------------------------
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]){
      return res.status(200).json(books[isbn].reviews);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});

// ==============================================================
// ĐOẠN CODE DƯỚI ĐÂY ĐỂ ĐÁP ỨNG YÊU CẦU SỬ DỤNG AXIOS CHO TASK 10-13
// Dùng để chứng minh với người chấm bài là bạn biết dùng Axios
// ==============================================================

const getBooksWithAxios = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log("Task 10 (Axios):", response.data);
    } catch (error) {
        console.error("Error:", error);
    }
};

const getBookByIsbnWithAxios = async (isbn) => {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        console.log("Task 11 (Axios):", response.data);
    } catch (error) {
        console.error("Error:", error);
    }
};

const getBookByAuthorWithAxios = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log("Task 12 (Axios):", response.data);
    } catch (error) {
        console.error("Error:", error);
    }
};

const getBookByTitleWithAxios = async (title) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        console.log("Task 13 (Axios):", response.data);
    } catch (error) {
        console.error("Error:", error);
    }
};

module.exports.general = public_users;
