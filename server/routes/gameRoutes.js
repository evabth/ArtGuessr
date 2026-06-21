const express = require("express")
const { random, guess } = require("../controllers/gameController")
const router = express.Router()


router.post("/random", random)

router.post("/guess", guess)



module.exports = router