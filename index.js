require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

//*connect to db
const { default: mongoose } = require("mongoose");
const connectToMongo = require("./config/dbConn");
const cookieParser = require("cookie-parser");
// const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

//*connect to db
connectToMongo();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(cookieParser());

//*Available routes
app.use("/api/signup", require("./routes/auth/signup"));
app.use("/api/signin", require("./routes/auth/signin"));
app.use("/api/getuser", require("./routes/getUser"));
app.use("/api/signout", require("./routes/auth/signout"));
app.use("/api/google-auth", require("./routes/auth/googleAuth"));
app.use("/api/refresh", require("./routes/auth/refresh"));

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
});
