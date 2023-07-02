// var data = require("./fetch.js");
// require("dotenv").config();
// const express = require("express");
// const app = express();
// const cors = require("cors");
// const http = require("http");
// // const io = socketio(server);
// const PORT = process.env.PORT || 3000;

// //*connect to db
// const { default: mongoose } = require("mongoose");
// const connectToMongo = require("./config/dbConn");
// const cookieParser = require("cookie-parser");
// const corsOptions = require("./config/corsOptions");
// const setCredentials = require("./middleware/setCredentials");
// const verifyJWT = require("./middleware/verifyJWT");
// // const bodyParser = require("body-parser");

// //*connect to db
// connectToMongo();

// app.use(setCredentials);
// app.use(cors(corsOptions));
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(cookieParser());

// //*Available routes
// app.use("/api/signup", require("./routes/auth/signup"));
// app.use("/api/signin", require("./routes/auth/signin"));
// app.use("/api/signout", require("./routes/auth/signout"));
// app.use("/api/google-auth", require("./routes/auth/googleAuth"));
// app.use("/api/refresh", require("./routes/auth/refresh"));
// app.use("/api/inviteinfo", require("./routes/inviteInfo"));

// //protected
// app.use(verifyJWT);

// app.use("/api/getuser", require("./routes/getUser"));
// app.use("/api/workspaceinfo", require("./routes/workspaceInfo"));
// app.use("/api/createworkspace", require("./routes/createWorkspace"));
// app.use("/api/updateuser", require("./routes/updateuser"));
// app.use("/api/gettaskgrp", require("./routes/getTaskGrp"));
// app.use("/api/createtaskgrp", require("./routes/createTaskgrp"));
// app.use("/api/createtask", require("./routes/createTask"));
// app.use("/api/deletetask", require("./routes/deleteTask"));
// app.use("/api/dragsettle", require("./routes/dragSettle"));
// app.use("/api/gettasks", require("./routes/getTask"));
// app.use("/api/updateworkspace", require("./routes/updateWorkspace"));
// app.use("/api/addmember", require("./routes/addMember"));
// app.use("/api/removemember", require("./routes/removeMember"));
// app.use("/api/acceptinvite", require("./routes/acceptInvite"));
// app.use("/api/cancelinvite", require("./routes/removeInvite"));

// mongoose.connection.once("open", () => {
//   console.log("Connected to MongoDB");
//   const server = app.listen(PORT, () => {
//     console.log(`Server running on PORT ${PORT}`);
//     const io = require("socket.io")(server);

//     io.on("connection", (client) => {
//       client.on("getData", (interval) => {
//         console.log("client is subscribing to timer with interval ", interval);

//         setInterval(() => {
//           MongoClient.connect("MONGO_URI", function (err, db) {
//             if (err) {
//               throw err;
//               client.emit("data", err);
//             } else {
//               data.getData(db, (err, result) => {
//                 if (err) {
//                   client.emit("data", err);
//                 } else {
//                   ans = result;
//                   client.emit("data", ans);
//                 }
//               });
//             }
//             db.close();
//           });
//         }, interval);
//       });
//     });
//   });
// });
