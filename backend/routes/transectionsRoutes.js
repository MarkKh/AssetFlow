const express = require("express");
const router = express.Router();
const transectionsController = require("../controllers/transectionsController");

router.get("/api/transections", transectionsController.getAllTransections);
router.get("/api/transection/:id", transectionsController.getTransectionById);
router.post("/apitransections/", transectionsController.createTransection);
router.put("/api/transection/:id", transectionsController.updateTransection);
router.delete("/api/transection/:id", transectionsController.deleteTransection);

module.exports = router;
