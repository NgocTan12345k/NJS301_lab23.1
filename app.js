const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const https = require("https");

const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 4002;
dotenv.config();

const privateKey = fs.readFileSync("server.key");
const certificate = fs.readFileSync("server.cert");

const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

// Helmet: Helmet helps you secure your Express apps by setting various HTTP headers
app.use(helmet());
// Compression:  là một kĩ thuật có thể tích hợp vào web servers và web clients để cải thiện tốc độ truyền và sử dụng băng thông bằng cách nén các file ở server nhằm giảm dung lượng file, giúp quá trình gửi xuống client trở lên nhanh hơn
app.use(compression());
// Morgan: cho bạn biết một số điều khi máy chủ của bạn nhận được yêu cầu. Và cho chúng ta nhiều thông tin hơn về client
app.use(morgan("combined", { stream: accessLogStream }));

app.use(cors());
// app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "images")));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connect successful!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);

app.listen(port, (re, res, next) => {
  console.log(`Server start at port = ${port} `);
});

// https
//   .createServer({ key: privateKey, cert: certificate }, app)
//   .listen(port, (re, res, next) => {
//     console.log(`Server start at port = ${port} `);
//   });
