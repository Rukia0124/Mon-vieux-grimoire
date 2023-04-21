const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/book");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");

router.get("/", bookCtrl.getAllBooks);
router.post("/", auth, multer, bookCtrl.createBook);
router.get("/bestrating", bookCtrl.bestRating);
router.get("/:id", bookCtrl.getOneBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.put("/:id", auth, multer, bookCtrl.modifyBook);
router.post("/:id/rating", auth, bookCtrl.addBookRating);

module.exports = router;
