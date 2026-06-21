const express = require("express");
const connectDB = require("./config/dbConnection");
const cors = require('cors');
const errorHandler = require("./middleware/errorHandler");
const validateToken = require("./middleware/validateTokenHandler")
const dotenv = require("dotenv").config();

connectDB()
const app = express();


const port = process.env.PORT || 3000;

const corsOptions = {
  origin: ['https://yourdomain.com', 'http://localhost:3000','http://localhost:5173'], // Whitelisted domains
  methods: ['GET', 'POST'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/users", require("./routes/userRoutes"))
app.use("/game", validateToken ,require("./routes/gameRoutes"))
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});