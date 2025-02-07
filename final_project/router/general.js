const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
//Write your code here
  let username = req.body.username;
  let password = req.body.password;

let existingUser = users.find(user => username === user.username);

if (existingUser) {
    return res.status(400).send('user already exists')
}
else {
    users.push({username, password})
     res.status(200).json({message: 'Customer successfully registered. You can login'})
}


  if (!username || !password && username.length === 0 || password.length === 0) {
      return res.status(400).json({message: 'No Username or password passed' })
  }
      
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let myPromise = new Promise((resolve,reject) => {
    if (books) {
        resolve(res.status(200).send(JSON.stringify(books,null,4)))
    }
      else
      {
          reject(res.status(404).json({message:"no books found"}))}
    })

    myPromise.then(res => console.log('resolved'))
    .catch(res => console.log('rejected'))



});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn
  const myPromise = new Promise((resolve, reject) => {
  if(isbn && isbn <= 10 ) {
    resolve( res.status(200).json(books[isbn]));
  }
  else {
      reject( res.status(404).json({message: 'book not found'}))
  }
});

  myPromise.then(res => console.log('resolved'))
  .catch(res => console.log('rejected'))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author
  let bookKeys = Object.keys(books)
  let data = { books:[]}
  let myPromise = new Promise((resolve, reject) => {
      
  bookKeys.forEach(key => {
      if (author === books[key]['author']) {
          data['books'].push(books[key]);
      }
    });

    if (data['books'].length > 0 ) {
       return resolve(res.status(200).json(data))
    } else {
       return reject(res.status(400).json({message:"no book found"}))
    }
})

  myPromise.then(res => console.log('resolved'))
  .catch(err => console.log('rejected'))

      
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title
  let bookKeys = Object.keys(books)
  let bookByTitle = []

    const myPromise = new Promise((resolve, reject) => {
        
        bookKeys.forEach(key => {
            if (title === books[key]['title']) {
                bookByTitle.push(books[key])
            }
        })

        if (bookByTitle.length > 0) {
            resolve (res.status(200).json(bookByTitle))
        } else {
            reject(res.status(404).json({message: 'book with that title does not exist'}))   
        }

    })
    myPromise.then(res => console.log('resolved'))
    .catch(res => console.log('rejected'))
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
    if (isbn && isbn <= 10) {
        return res.status(200).json({reviews: books[isbn].reviews})
    }
    else {
      return res.status(404).json({message: 'not found'})
  
    }
  
});

module.exports.general = public_users;
