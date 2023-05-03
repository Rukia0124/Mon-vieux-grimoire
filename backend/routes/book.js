const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/book");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");
const imageCompression = require("../middlewares/imageCompression");

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Récupère tous les livres
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Les livres ont été récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Books'
 *       404:
 *         description: Les livres n'ont pas été trouvés
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", bookCtrl.getAllBooks);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Crée un livre
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       201:
 *         description: Le livre a été créé avec succès
 *       400:
 *         description: Les informations fournies sont incorrectes ou incomplètes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", auth, multer, imageCompression, bookCtrl.createBook);

/**
 * @swagger
 * /api/books/bestrating:
 *   get:
 *     summary: Récupère les trois livres avec la meilleure note moyenne
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Les livres ont été récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Books'
 *       404:
 *         description: Les livres n'ont pas été trouvés
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/bestrating", bookCtrl.bestRating);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Récupère un livre par son identifiant
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du livre
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Le livre a été récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Le livre n'a pas été trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", bookCtrl.getBook);

/**
 * @swagger
 * /book/{id}:
 *   delete:
 *     summary: Supprime un livre par son identifiant si l'utilisateur l'a créé.
 *     tags:
 *       - Livres
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant du livre à supprimer.
 *     responses:
 *       200:
 *         description: Le livre a été supprimé avec succès.
 *       400:
 *         description: Le livre n'a pas pu être supprimé.
 *       401:
 *         description: Vous n'êtes pas autorisé à supprimer ce livre.
 *       404:
 *         description: Le livre est introuvable.
 */
router.delete("/:id", auth, bookCtrl.deleteBook);

/**
 * @swagger
 * /book/{id}:
 *   put:
 *     summary: Modifie un livre par son identifiant si l'utilisateur a créé le livre.
 *     tags:
 *       - Livres
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant du livre à modifier.
 *       - in: formData
 *         name: book
 *         required: true
 *         type: string
 *         description: Les informations du livre à modifier.
 *       - in: formData
 *         name: image
 *         type: file
 *         description: L'image du livre à modifier.
 *     responses:
 *       200:
 *         description: Le livre a été modifié avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Le livre n'a pas pu être modifié.
 *       401:
 *         description: Vous n'êtes pas autorisé à modifier ce livre.
 *       404:
 *         description: Le livre est introuvable.
 */
router.put("/:id", auth, multer, imageCompression, bookCtrl.modifyBook);

/**
 * @swagger
 * /books/:id/rating:
 *   post:
 *     summary: Ajouter une note à un livre existant
 *     description: Ajoute une note à un livre existant en utilisant l'ID du livre.
 *     tags:
 *       - Livres
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du livre à noter
 *       - in: body
 *         name: rating
 *         schema:
 *           type: object
 *           required:
 *             - rating
 *           properties:
 *             rating:
 *               type: integer
 *               description: Note attribuée au livre (entre 1 et 5)
 *               minimum: 1
 *               maximum: 5
 *     responses:
 *       '201':
 *         description: La note a été ajoutée avec succès.
 *       '400':
 *         description: Mauvaise requête. L'ID du livre est manquant ou la note est absente.
 *       '401':
 *         description: Non autorisé. L'utilisateur doit être connecté.
 *       '500':
 *         description: Erreur interne du serveur. La note n'a pas pu être ajoutée.
 */
router.post("/:id/rating", auth, bookCtrl.addBookRating);

module.exports = router;
