const express = require("express");
const router = express.Router();
const stockController = require("../controllers").stockController;

router.get("/", stockController.getStock);

router.post("/", stockController.addStock);

router.patch("/:id", stockController.editStock);

router.delete("/:id", stockController.deleteStock);

module.exports = router;
