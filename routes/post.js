const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const {Op} = require("sequelize");
const {Post} = require("../models");
const authmiddleware = require("../middleware/auth-middleware");

const app = express();
const router = express.Router();

// 전체 게시글 보기
router.get('/post', async(req,res) => {
    const all_post = await Post.findAll({});
    res.status(200).json({all_post});
});

// 게시글 작성
// router.post("/post", async(req,res) => { // 로그인 기능이 작동하면 이줄 완전 삭제!
router.post("/post",authmiddleware, async(req,res) => { // 로그인 기능이 작동하면 주석 해제
    // const {title,content,userId} = req.body; // 로그인 기능이 작동하면 이줄 완전 삭제!
    const {title,content} = req.body; // 로그인 기능이 작동하면 주석 해제
    const userId = res.locals.user // 로그인 기능이 작동하면 주석 해제

    if(title === undefined){
        res.status(400).json({errorMessage:"제목이 올바르지 않습니다."});
        return;
    }
    if(content === undefined){
        res.status(400).json({errorMessage:"내용이 올바르지 않습니다."});
        return;
    }
    
    await Post.create({title:title, content:content, userId:userId})
    res.status(200).json({Message:"게시글 작성이 완료되었습니다."})
});

// 게시글 삭제
router.delete('/post/:postId', async (req,res) => { // 로그인 기능이 작동하면 이줄 완전 삭제!
// router.delete('/post/:postId',authmiddleware, async (req,res) => {// 로그인 기능이 작동하면 주석 해제
    const {postId} = req.params;
    await Post.destroy({
      where: { postId: postId },
  });
    res.status(200).json({success:"댓글을 삭제하였습니다."});
  });


  // 게시글 수정
router.put('/post/:postId', async (req,res) => { // 로그인 기능이 작동하면 이줄 완전 삭제!
    // router.put('/post/:postId',authmiddleware, async (req,res) => {// 로그인 기능이 작동하면 주석 해제
    const {postId} = req.params;
    const {title,content} = req.body;
  
    if (content === undefined){
        return res.status(400).json({errorMessage:"수정할 내용을 입력해주세요."});
    };
    await Post.update({title: title,content: content}, {
            where: { postId: postId },
        });
    res.status(200).json({success:"댓글을 수정하였습니다."});
  });


module.exports = router;