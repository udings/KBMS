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
const authenticate = require("../middleware/auth");
const authorizeRoles = require("../middleware/roleCheck");

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
router.post("/", authenticate, authorizeRoles("developer"), createItem);

// ------------------------
// 🔐 PROTECTED: UPDATE ITEM (developer or manager)
// ------------------------
router.put("/:id", authenticate, authorizeRoles("developer", "manager"), updateItem);

// ------------------------
// 🔐 PROTECTED: DELETE ITEM (developer only)
// ------------------------
router.delete("/:id", authenticate, authorizeRoles("developer"), deleteItem);

module.exports = router;
