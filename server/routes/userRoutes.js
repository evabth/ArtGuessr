const express = require("express")
const { registerUser, loginUser, currentUser, handleLogout, handleRefreshToken } = require("../controllers/userController")
const validateToken = require("../middleware/validateTokenHandler")
const router = express.Router()

router.post("/register",registerUser)

router.post("/login", loginUser)

router.get("/logout", handleLogout)

router.get("/refresh", handleRefreshToken)

router.get("/current", validateToken,currentUser)

module.exports = router