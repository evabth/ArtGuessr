const express = require("express");
const connectDB = require("./config/dbConnection");
const cors = require('cors');
const errorHandler = require("./middleware/errorHandler");
const validateToken = require("./middleware/validateTokenHandler");
const cookieParser = require("cookie-parser");
const allowedOrigins = require("./config/allowedOrigins");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const dotenv = require("dotenv").config();
const {loadPaintingIDs} = require('./config/metCache.js');

loadPaintingIDs();
connectDB()
const app = express();

const port = process.env.PORT || 3000;
app.use(credentials)
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/users", require("./routes/userRoutes"))
app.use("/game", validateToken ,require("./routes/gameRoutes"))
app.use(errorHandler)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});