const express = require("express");
require("dotenv").config();

const PORT = process.env.PORT || 60000;
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST","OPTIONS", "PUT", "PATCH", "DELETE"],
  },
});
const fileupload = require("express-fileupload");
var cors = require("cors");
app.use(cors());
app.use(fileupload());
app.use(express.static("files"));
app.use("/", express.static("public"));
app.use(express.json({ type: "application/json" }));
app.use(express.urlencoded({ extended: true }));


global.__basedir = __dirname;

// socketManager for socket programming
require("./socketManager/socketManager")(io);

app.get("/welcome", async (req, res, next) => {
  
  res.json({
    message: "Welcome to Fyrlux",
    status: 200,
  });
});

// Server listening
server.listen(PORT, () => {
  console.log(`Express Server listening on ${PORT}`);
});

module.exports = app;
