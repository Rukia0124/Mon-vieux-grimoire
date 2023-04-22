const Book = require("../models/Book");
const fs = require("fs");
const bookService = require("../services/books.service");

exports.getAllBooks = (req, res, next) => {
  const books = bookService
    .getAllBooks()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(404).json(error));
};

exports.createBook = (req, res, next) => {
  const bookData = JSON.parse(req.body.book);
  bookData.imageUrl = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;
  bookService
    .createBook(bookData)
    .then(() => {
      res.status(201).json({ message: "Livre créé ! " });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getBook = async (req, res, next) => {
  const bookId = req.params.id;
  bookService
    .getBook(bookId)
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json(error));
};

exports.modifyBook = (req, res, next) => {
  const userId = req.auth.userId;
  const bookId = req.params.id;
  const bookData = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  bookService
    .modifyBook(bookId, bookData, userId)
    .then((updatedBook) => {
      res.status(200).json({ message: "Livre modifié!", book: updatedBook });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  const bookId = req.params.id;
  const userId = req.auth.userId;
  bookService
    .getBook(bookId)
    .then((book) => {
      const filename = book.imageUrl.split("/images/")[1];
      bookService
        .deleteBook(bookId, userId)
        .then(() => {
          fs.unlink(`images/${filename}`, () => {
            res.status(200).json({ message: "Livre supprimé !" });
          });
        })
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.addBookRating = (req, res, next) => {
  const bookId = req.params.id;
  const userId = req.auth.userId;
  const grade = req.body.rating;

  bookService
    .addBookRating(bookId, userId, grade)
    .then((updatedBook) => {
      res.status(201).json(updatedBook);
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.bestRating = (req, res, next) => {
  bookService
    .bestRating()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(404).json(error);
    });
};
