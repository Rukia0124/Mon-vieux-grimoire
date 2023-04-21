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
  const book = bookService
    .createBook(bookData)
    .then(() => {
      res.status(201).json({ message: "Livre créé ! " });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getBook = async (req, res, next) => {
  const bookId = req.params.id;
  const book = bookService
    .getBook(bookId)
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json(error));
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Livre modifié!" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.addBookRating = (req, res, next) => {
  const bookId = req.params.id;
  const userId = req.auth.userId;
  const grade = req.body.rating;

  averageRating = () => {};

  Book.findById(bookId)
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }

      const rating = book.ratings.find((rating) => rating.userId === userId);
      if (rating) {
        return res
          .status(400)
          .json({ message: "Vous avez déjà noté ce livre" });
      }

      book.ratings.push({ userId, grade });
      const ratings = book.ratings;
      let sum = 0;
      for (let i = 0; i < ratings.length; i++) {
        sum += ratings[i].grade;
      }

      const averageRating = sum / ratings.length;

      book.averageRating = averageRating.toFixed(2);

      book
        .save()
        .then((savedBook) => res.status(201).json(savedBook))
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.bestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(404).json(error));
};
