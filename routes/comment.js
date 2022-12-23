const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const {Op} = require("sequelize");
const {Comment} = require("../models");
const authmiddleware = require("../middleware/auth-middleware");

const app = express();
const router = express.Router();

// 모든 댓글 보기
router.get('/comment', async(req,res) => {
    const all_comment = await Comment.findAll({});
    res.status(200).json({all_comment});
})

// 댓글 작성
// router.post("/comment/:postId", async(req,res) => { // 로그인 기능이 작동하면 이줄 완전 삭제!
router.post("/comment/:postId",authmiddleware, async(req,res) => { // 로그인 기능이 작동하면 주석 해제
    // const {content,userId} = req.body; // 로그인 기능이 작동하면 이줄 완전 삭제!
    const {postId} = req.params;
    const {content} = req.body; // 로그인 기능이 작동하면 주석 해제
    const userId = res.locals.user // 로그인 기능이 작동하면 주석 해제

    if(content === undefined){
        res.status(400).json({errorMessage:"내용이 올바르지 않습니다."});
        return;
    }
    
    await Comment.create({content:content,postId:postId,userId:userId})
    res.status(200).json({Message:"댓글 작성이 완료되었습니다."})
});


// 댓글 삭제 아직 로그인 기능 미구현...
router.delete("/comment/:commentId", async(req,res) => {
    const {commentId} = req.params;

    await Comment.destroy({where: {commentId:commentId}
    });
    res.status(200).json({Message:"댓글 삭제가 완료되었습니다."});
});

// 댓글 수정 아직 로그인 기능 미구현...
router.put("/comment/:commentId", async(req,res) => {
    const {commentId} = req.params;
    const {content} = req.body;
    
    if(content === undefined){
        res.status(400).json({errorMessage:"내용이 올바르지 않습니다."});
        return;
    }

    await Comment.update({content:content},
        {where: {commentId:commentId}}
        );
    res.status(200).json({Message:"댓글 수정이 완료되었습니다."})
})


module.exports = router;