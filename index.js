const { default: mongoose } = require("mongoose");
const connectToMongo = require("./config/dbConn");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

//*connect to db
connectToMongo();

app.use(express.json()); // for handling json

//*Available routes
app.use("/api/auth", require("./routes/auth"));

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
});
