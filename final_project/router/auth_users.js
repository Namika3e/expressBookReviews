const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();  

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    users.forEach(user => {
        if(user.username === username ) {
            return 'username is valid'
        } else {
            return 'username is invalid'
        }
    })
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    users.forEach(user => {
        if (user.username === username && user.password === password) {
            return 'user is registered'

        } else {return 'you are not registered, please signup'}
    })
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here

   const {username, password} = req.body
 
   let user = users.find((user) => user.username === username && user.password === password);
     if (!user) {
         return res.status(401).json({ message: 'Invalid username or password' });
     } else {
         let accessToken = jwt.sign({data: user
         }, 'access', { expiresIn: 60 * 60 });
         req.session.token = accessToken 
         req.session.username = username
         return res.status(200).send("Customer successfully logged in");
        }  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let reviews = req.body.reviews
  let isbn  = req.params.isbn

  if (books[isbn]['reviews']) {
    books[isbn]['reviews'] = reviews;
    return res.status(200).send(`Review for the book with ISBN ${isbn} has been created/updated`)
  } 
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
    let isbn = req.params.isbn;
    let username = req.session.username

    const user = users.find(user => username === user.username)

    if (user) {
    let reviews = books[isbn]['reviews']
    let reviewsArray = [reviews]
    let reviewsLeft = reviewsArray.filter(review=> review != reviews )
    reviews = {reviewsLeft}
    return res.status(200).send(`review under user ${username} has been deleted`)
}

    else {return res.status(404).send("review not found")}
    
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
