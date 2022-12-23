const express = require("express");
const {Op} = require("sequelize");
const {User} = require("./models");
const jwt = require("jsonwebtoken");
const authmiddleware = require("./middleware/auth-middleware");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
const likeRouter = require("./routes/like")

const app = express();


app.use(express.json());
app.use("/api", express.urlencoded({extended:false}),[userRouter,postRouter,commentRouter,likeRouter]);
app.use(express.static("assets"));



app.listen(8080,() => {
    console.log("8080 포트로 연결되었습니다.")
})