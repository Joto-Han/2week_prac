const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const {Op} = require("sequelize");
const {User} = require("../models");
const {Post} = require("../models");
const {Like} = require("../models")
const authmiddleware = require("../middleware/auth-middleware");

const app = express();
const router = express.Router();

// 좋아요 조회
router.get('/like', authmiddleware, async (req, res) => {
    const userId = res.locals.user;
    const all_like_cnt = await Like.findAll({ where: { userId: userId },
    //   where: {userId: userId},
    //   raw: true,
    //   attributes: [
    //     'userId',
    //     'postId',
    //     'Post.title',
    //     'Post.content',
    //     'Post.like_cnt',
    //     'Post.createdAt',
    //   ],
    //   include: [
    //     {
    //       model: Post,
    //       attributes: [],
    //     },
    //   ],
    //   order: [[Post, 'like_cnt', 'desc']],
    });
    res.status(200).json({all_like_cnt});
  });

// 좋아요 버튼 클릭
router.put('/post/:postId/like', authmiddleware, async(req,res) => {
    const {postId} = req.params;
    const userId = res.locals.user;

    const checkPost = await Like.findOne({
        where: {postId:postId, userId:userId}
    });

    if(!checkPost){
        await Like.create({
            postId:postId,userId:userId
        });
        await Post.increment(
            {like_cnt:1}, {where: {postId:postId}}
            ).then((result) => { 
            console.log(result)
            }).catch((err) => {
            console.log(err)
            });

        res.status(200).json({Message:"게시글 좋아요 등록 완료!"});
        return;
    }

    await Post.decrement({like_cnt:1}, {where: {postId:postId}});
    await Like.destroy({where:{postId:postId}});
    res.status(200).json({Message:"게시글 좋아요 취소하였습니다."})
})

// router.post("/like", async (req, res) => {
//     const { post_Id } = req.body;
//     const { cookie } = req.headers;

//     let post_list = await Post.find({});

//     payload = jwt.verify(cookie, "customized-secret-key");
//     const { name } = await User.findOne({ _id: payload.userId });

//     let { like_user } = await Post.findOne({ post_Id: post_Id })
//     let { like_count } = await Post.findOne({ post_Id: post_Id })

//     console.log("=== 좋아요 시작 ===")
//     console.log(like_user)
//     console.log(name)

//     if (like_user.includes(name) == true) {
//         like_count = like_count -= 1
//         like_user.splice(like_user.indexOf(name), 1);
//         await Post.updateOne({ post_Id }, { $set: { like_user, like_count } });
//         console.log("좋아요 취소야 !!")
//     }
//     else if (like_user.includes(name) == false) {
//         like_count = like_count += 1
//         like_user.push(name)
//         await Post.updateOne({ post_Id }, { $set: { like_user, like_count } });
//         console.log("좋아요 성공 !!")
//     }

//     let post_list2 = await Post.find({});
//     console.log(post_list2)
//     res.send({ post_list: post_list2 })
// });


module.exports = router;