require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;

//*connect to db
const { default: mongoose } = require("mongoose");
const connectToMongo = require("./config/dbConn");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const setCredentials = require("./middleware/setCredentials");
const verifyJWT = require("./middleware/verifyJWT");

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
app.use("/api/inviteinfo", require("./routes/inviteInfo")); //TODO: refactoring left

//protected
app.use(verifyJWT);

app.use("/api/getuser", require("./routes/getUser"));
app.use("/api/workspaceinfo", require("./routes/workspaceInfo"));
app.use("/api/createworkspace", require("./routes/createWorkspace"));
app.use("/api/updateuser", require("./routes/updateuser"));
app.use("/api/gettaskgrp", require("./routes/getTaskGrp")); //& NOT IN USE
app.use("/api/createtaskgrp", require("./routes/createTaskgrp"));
app.use("/api/createtask", require("./routes/createTask"));
app.use("/api/updateTaskGroupName", require("./routes/updateTaskGroupName"));
app.use("/api/deletetask", require("./routes/deleteTask"));
app.use("/api/dragsettle", require("./routes/dragSettle"));
app.use("/api/gettasks", require("./routes/getTask"));
app.use("/api/updateworkspace", require("./routes/updateWorkspace"));
app.use("/api/addmember", require("./routes/addMember"));
app.use("/api/removemember", require("./routes/removeMember"));
app.use("/api/acceptinvite", require("./routes/acceptInvite"));
app.use("/api/cancelinvite", require("./routes/removeInvite"));

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  const server = app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
  const io = require("socket.io")(server, {
    pingTimeout: 600000,
    cors: { corsOptions },
  });
  io.on("connection", (socket) => {
    console.log("connected to socket.io ");

    socket.on("setup", (user) => {
      socket.join(user?._id);
      console.log("setup event , user -->", user?._id);
    });

    socket.on("joinWorkspace", (workspaceId) => {
      socket.join(workspaceId);
      console.log("user joined workspace,", workspaceId);
    });

    socket.on("changeEmitted", (details) => {
      socket.broadcast
        .to(details.workspaceId)
        .emit("changeRecieved", details.workspaceId);
    });

    socket.on("disconnect", (reason) => {
      console.log("user disconnected", reason);
    });

    socket.off("setup", (user) => {
      socket.leave(user?._id);
      console.log("setup leave , user -->", user?._id);
    });
  });
});
