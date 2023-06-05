const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

    
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if (users.length > 0 ) {
      users.forEach(user => {
          if (user.username === username) {
            return res.status(400).json({message: "Username already registered"})
          } 
          else {
            users.push({"username" : username, "password" : password})
            return res.status(200).json(users)
        }
      })  
      
  }

  if (!username || !password && username.length === 0 || password.length === 0) {
      return res.status(400).json({message: 'No Username or password passed' })
  }
      
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve,reject) => {
    if (books) {
        resolve(res.status(200).send(JSON.stringify(books,null,4)))
    }
      else
      {
          reject(res.status(404).json({message:"no books found"}))}
    })

    myPromise.then(res => console.log('resolved'))
    myPromise.catch(res => console.log('rejected'))



});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
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
  myPromise.catch(res => console.log('rejected'))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author
  let bookKeys = Object.keys(books)

  const myPromise = new Promise((resolve, reject) => {
  bookKeys.forEach(key => {
      if (author === books[key]['author']) {
          let data = books[key]
      resolve(res.status(200).json(data));
      }
    //   res.status(200).json( books[key] )
      else if(!author === books[key]['author']) {
         reject(res.status(404).json({message:'book not found'}))
      }
  })
  });

  myPromise.then(res => console.log('resolved', res));
  myPromise.catch(err => console.log('rejected', err))

      
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title
  let bookKeys = Object.keys(books)

    const myPromise = new Promise((resolve, reject) => {
        for (let i = 0; i < bookKeys.length; i++) {
            if (title === books[bookKeys[i]]['title'] ) {
              resolve (res.status(200).json(books[bookKeys[i]]))
            }
            else if (!title === books[bookKeys[i]]['title']){
                reject(res.status(404).json({message: 'title does not exist'}))
            }
        }
    })
    myPromise.then(res => console.log('resolved'))
    myPromise.catch(res => console.log('rejected'))
  
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
