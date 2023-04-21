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
}

const bookService = new BookService();

module.exports = bookService;
