/*
npm install express sqlite3 sqlite


SwatiBD42-HW1/ -- > repel name
└── BD4.2_HW1/ --> parent folder name
    ├── initDB.js
    └── other-files.js

stay at root directory (default shell location /home/runner/SwatiBD42-CW ) and run below

//Run initDB.js to create and populate the database:
node BD4.2_HW1/initDB.js
Start the Express server: (stay at default location inshell /home/runner/SwatiBD42-HW1 )
node BD4.2_HW1/index.js -> dont use start button, use shell( ctrl + c to stop server )
*/

const express = require("express"); // Express framework for creating the web server
const sqlite3 = require("sqlite3").verbose(); // SQLite3 library for database operations
const { open } = require("sqlite"); // SQLite library for async database operations
/*
open from sqlite: A utility to open SQLite databases with async support.
*/

const app = express(); // Create an Express application
const PORT = process.env.PORT || 3000;
let db; // Variable to hold the database connection

(async () => {
  db = await open({
    filename: "./BD4.2_HW1/books_database.sqlite",
    driver: sqlite3.Database,
  });
})();

app.get("/", (req, res) => {
  res.status(200).json({ message: "BD4.2 HW1" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*
Exercise 1: Fetch All Books

Create an endpoint /books return all the books

Create a function getAllBooks to fetch all the books from the database.

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return 404 error if no data is found

API Call:

http://localhost:3000/books

Expected Output:

{
  'books': [
    {
      'id': 1,
      'title': 'To Kill a Mockingbird',
      'author': 'Harper Lee',
      'genre': 'Fiction',
      'publication_year': 1960
    },
    {
      'id': 2,
      'title': '1984',
      'author': 'George Orwell',
      'genre': 'Dystopian',
      'publication_year': 1949
    }
    ...
  ]
}*/

// function to fetch all books

/*
This function is defined as async, which means it can use the await keyword to wait for asynchronous operations (like database queries) to complete.
*/

async function getAllBooks() {
  let query = "SELECT * FROM books";
  try {
    if (!db) throw new Error("Database connection not established"); //validating the database connection before attempting to fetch the data
    let response = await db.all(query, []);
    if (response.length === 0) throw new Error("No Books found");
    return { books: response };
  } catch (error) {
    //The error object contains details about what went wrong.
    console.log("Error in fetching all books", error.message);
    throw error; //This re-throws the error so it can be handled by the calling function (in this case, the endpoint handler).
  }
}

// endpoint to fetch all books
app.get("/books", async (req, res) => {
  try {
    let result = await getAllBooks(); // Call the fetchAllBooks function and await the result
    return res.status(200).json({ books: result }); // Send a 200 OK response with the books data
  } catch (error) {
    if (error.message === "No Books found") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message }); // Send a 500 Internal Server Error response with the error message
    }
  }
});

/*
Exercise 2: Fetch Books by Author

Create an endpoint /books/author/:author return all the books by a specific author.

Create a function getAllBooksByAuthor to fetch all the books by an author from the database.

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return 404 error if no data is found

API Call:

http://localhost:3000/books/author/George%20Orwell

Expected Response:

{
  'books': [
    {
      'id': 2,
      'title': '1984',
      'author': 'George Orwell',
      'genre': 'Dystopian',
      'publication_year': 1949
    },
    {
      'id': 3,
      'title': 'Animal Farm',
      'author': 'George Orwell',
      'genre': 'Political Satire',
      'publication_year': 1945
    }
  ]
}
*/

// function to fetch books by author

async function getAllBooksByAuthor(author) {
  let query = "SELECT * FROM books WHERE author = ?";
  try {
    if (!db) throw new Error(" Database connection no established");

    let result = await db.all(query, [author]);

    if (!result || result.length === 0)
      throw new Error("No books found by the given author");
    return result;
  } catch (error) {
    console.log("Error in fetching books by author", error.message);
    throw error;
  }
}

// endpoint to fetch books by author

app.get("/books/author/:author", async (req, res) => {
  let author = req.params.author;
  try {
    let result = await getAllBooksByAuthor(author);
    return res.status(200).json({ books: result });
  } catch (error) {
    if (error.message === "No books found by the given author") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});

/*
Exercise 3: Fetch Books by Genre

Create an endpoint /books/genre/:genre

Create a function getAllBooksByGenre to fetch all the books based on specific genre.

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return 404 error if no data is found

API Call:

http://localhost:3000/books/genre/Fiction

Expected Response:

{
  'books': [
    {
      'id': 1,
      'title': 'To Kill a Mockingbird',
      'author': 'Harper Lee',
      'genre': 'Fiction',
      'publication_year': 1960
    },
    {
      'id': 4,
      'title': 'Pride and Prejudice',
      'author': 'Jane Austen',
      'genre': 'Fiction',
      'publication_year': 1813
    }
  ]
}
*/

// function to fetch books by genre
async function getAllBooksByGenre(genre) {
  let query = "SELECT * FROM books WHERE genre = ?";
  try {
    if (!db) throw new Error("Database connection not established");

    let result = await db.all(query, [genre]);

    if (!result || result.length === 0) {
      console.log("No books found by the given genre");
      throw new Error("No books found by the given genre");
    }
    return result;
  } catch (error) {
    console.log("Error in fetching books by genre => ", error.message);
    throw error;
  }
}

// endpoint to fetch books by genre
app.get("/books/genre/:genre", async (req, res) => {
  let genre = req.params.genre;
  try {
    let result = await getAllBooksByGenre(genre);
    return res.status(200).json({ books: result });
  } catch (error) {
    if (error.message === "No books found by the given genre") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});

/*
Exercise 4: Fetch Books by Publication Year

Create an endpoint /books/publication_year/:year return all the books

Create a function getAllBooksByPublicationYear to fetch all the books in a specific year.

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return 404 error if no data is found

API Call:

http://localhost:3000/books/publication_year/1960

Expected Response:

{
  'books': [
    {
      'id': 1,
      'title': 'To Kill a Mockingbird',
      'author': 'Harper Lee',
      'genre': 'Fiction',
      'publication_year': 1960
    },
    {
      'id': 5,
      'title': 'Green Eggs and Ham',
      'author': 'Dr. Seuss',
      'genre': 'Children's literature',
      'publication_year': 1960
    }
  ]
}


*/

// function to fetch books by publication year
async function getAllBooksByPublicationYear(year) {
  let query = "SELECT * FROM books WHERE publication_year = ?";
  try {
    if (!db) throw new Error("Database connection not established");

    let result = await db.all(query, [year]);

    if (!result || result.length === 0) {
      console.log("No books found by the given publication year");
      throw new Error("No books found by the given publication year");
    }
    return result;
  } catch (error) {
    console.log("Error in fetching books by publication year", error.message);
    throw error;
  }
}

// endpoint to fetch books by publication year
app.get("/books/publication_year/:year", async (req, res) => {
  let year = req.params.year;
  try {
    let result = await getAllBooksByPublicationYear(year);
    return res.status(200).json({ books: result });
  } catch (error) {
    if (error.message === "No books found by the given publication year") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
