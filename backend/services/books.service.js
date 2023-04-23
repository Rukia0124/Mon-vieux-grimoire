const Book = require("../models/Book");

class BookService {
  async getAllBooks() {
    try {
      return await Book.find().exec();
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
      return await book.save();
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

      return await Book.findByIdAndUpdate(bookId, updatedBookData, {
        new: true,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async deleteBook(bookId, userId) {
    try {
      const book = await Book.findById(bookId);

      if (!book) {
        throw new Error("Livre non trouvé");
      }
      if (book.userId != userId) {
        throw new Error("L'utilisateur ne peut pas supprimer ce livre");
      }
      await Book.deleteOne({ _id: bookId });
    } catch (error) {
      throw new Error(error);
    }
  }
  async addBookRating(bookId, userId, grade) {
    try {
      const book = await Book.findById(bookId);
      if (!book) {
        throw new Error("Livre non trouvé");
      }
      const existingRating = book.ratings.find(
        (rating) => rating.userId === userId
      );
      if (existingRating) {
        throw new Error("Vous avez déjà noté ce livre");
      }

      book.ratings.push({ userId, grade });
      const ratings = book.ratings;
      const sum = ratings.reduce((acc, rating) => acc + rating.grade, 0);
      const averageRating = parseFloat((sum / ratings.length).toFixed(2));

      book.averageRating = averageRating;
      return await book.save();
    } catch (error) {
      throw new Error(error);
    }
  }
  async bestRating() {
    try {
      return await Book.find().sort({ averageRating: -1 }).limit(3);
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = new BookService();
