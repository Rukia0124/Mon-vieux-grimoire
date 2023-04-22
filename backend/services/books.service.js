const Book = require("../models/Book");

class BookService {
  async getAllBooks() {
    try {
      const books = await Book.find().exec();
      return books;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createBook(bookData) {
    try {
      const book = new Book({
        userId: bookData.userId,
        title: bookData.title,
        author: bookData.author,
        year: bookData.year,
        genre: bookData.genre,
        ratings: bookData.ratings,
        imageUrl: bookData.imageUrl,
        averageRating: bookData.averageRating,
      });
      await book.save();
      return book;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getBook(bookId) {
    try {
      return await Book.findOne({ _id: bookId });
    } catch (error) {
      throw new Error(error);
    }
  }
  async modifyBook(bookId, bookData, userId) {
    try {
      const book = await Book.findById(bookId);

      if (!book) {
        throw new Error("Livre non trouvé");
      }

      if (book.userId !== userId) {
        throw new Error("Utilisateur non autorisé à modifier ce livre");
      }

      const updatedBookData = {
        title: bookData.title || book.title,
        author: bookData.author || book.author,
        year: bookData.year || book.year,
        genre: bookData.genre || book.genre,
        ratings: bookData.ratings || book.ratings,
        imageUrl: bookData.imageUrl || book.imageUrl,
        averageRating: bookData.averageRating || book.averageRating,
      };

      const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        updatedBookData,
        { new: true }
      );

      return updatedBook;
    } catch (error) {
      throw new Error(error);
    }
  }
}

const bookService = new BookService();

module.exports = bookService;
