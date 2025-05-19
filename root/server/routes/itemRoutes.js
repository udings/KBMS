const express = require("express");
const router = express.Router();

// Import controller functions
const {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem
} = require("../controllers/itemController");

// Import middleware untuk autentikasi dan otorisasi
const { authenticateToken, authorizeRole } = require("../middleware/auth");

// ------------------------
// ✅ PUBLIC: READ ALL ITEMS
// ------------------------
router.get("/", getAllItems);

// ------------------------
// ✅ PUBLIC: READ ITEM BY ID
// ------------------------
router.get("/:id", getItemById);

// ------------------------
// 🔐 PROTECTED: CREATE ITEM (developer only)
// ------------------------
router.post("/", authenticateToken, authorizeRole("developer"), createItem);

// ------------------------
// 🔐 PROTECTED: UPDATE ITEM (developer or manager)
// ------------------------
router.put("/:id", authenticateToken, authorizeRole(["developer", "manager"]), updateItem);

// ------------------------
// 🔐 PROTECTED: DELETE ITEM (developer only)
// ------------------------
router.delete("/:id", authenticateToken, authorizeRole("developer"), deleteItem);

module.exports = router;
