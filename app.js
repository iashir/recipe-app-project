//Requiring modules
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const users = require("./routes/user");
const like = require("./routes/like");
const comment = require("./routes/comments");
const admin = require("./routes/admin");
const categories = require("./routes/categories");
const subscribe = require("./routes/subscribe");

const connectDB = require("./config/db");
const main = require("./routes/main");

//Load config
dotenv.config({ path: "./config/config.env" });

//Connecting to database
connectDB();
// ssd
//Development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Static folder
app.use(express.static("./client/src/public"));
app.use(express.static(path.join(__dirname, "client", "build")));

//Routes
app.use("/api/recipes", require("./routes/recipes"));
app.use("/api/users", users);
app.use("/api/comment", comment);
app.use("/api/admin", admin);
app.use("/api/categories", categories);
app.use("/api/subscribe", subscribe);
app.use("/api/like", like);

app.use("/api/", main);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
//Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running  on port ${PORT}`));
