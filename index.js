require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

//*connect to db
const { default: mongoose } = require("mongoose");
const connectToMongo = require("./config/dbConn");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const setCredentials = require("./middleware/setCredentials");
const verifyJWT = require("./middleware/verifyJWT");
// const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

//*connect to db
connectToMongo();

app.use(setCredentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//*Available routes
app.use("/api/signup", require("./routes/auth/signup"));
app.use("/api/signin", require("./routes/auth/signin"));
app.use("/api/signout", require("./routes/auth/signout"));
app.use("/api/google-auth", require("./routes/auth/googleAuth"));
app.use("/api/refresh", require("./routes/auth/refresh"));
app.use("/api/inviteinfo", require("./routes/inviteInfo"));

//protected
app.use(verifyJWT);

app.use("/api/getuser", require("./routes/getUser"));
app.use("/api/workspaceinfo", require("./routes/workspaceInfo"));
app.use("/api/createworkspace", require("./routes/createWorkspace"));
app.use("/api/updateuser", require("./routes/updateuser"));
app.use("/api/gettaskgrp", require("./routes/getTaskGrp"));
app.use("/api/createtaskgrp", require("./routes/createTaskgrp"));
app.use("/api/createtask", require("./routes/createTask"));
app.use("/api/gettasks", require("./routes/getTask"));
app.use("/api/updateworkspace", require("./routes/updateWorkspace"));
app.use("/api/addmember", require("./routes/addMember"));
app.use("/api/removemember", require("./routes/removeMember"));
app.use("/api/acceptinvite", require("./routes/acceptInvite"));
app.use("/api/cancelinvite", require("./routes/removeInvite"));
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
});
