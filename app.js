const express = require("express");
const dontenv = require("dotenv");
const cors = require("cors");

//load env variables from .env file
dontenv.config();

const app = express();
const port = process.env.PORT || 3002;

//middleware
app.use(cors());
app.use(express.json());

//routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

//mount routes to path
app.use("/user", userRoutes);
app.use("/post", postRoutes);

//start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
