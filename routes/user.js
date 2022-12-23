const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const {Op} = require("sequelize");
const {User} = require("../models");
const authmiddleware = require("../middleware/auth-middleware");

const app = express();
const router = express.Router();

// 회원 가입
router.post("/users", async (req, res) => {
    const { nickname, password, confirmPassword } = req.body;
    const rex = /^(?=.*[0-9]+)[a-zA-Z][a-zA-Z0-9]{5,10}$/g;

    if (password !== confirmPassword) {
        res.status(400).send({
            errorMessage: "패스워드가 패스워드 확인란과 다릅니다."
        });
        return;
    }
    
    if (!rex.test(nickname)) {
        res.status(412).json({errorMessage:"닉네임 형식이 올바르지 않습니다."});
        return;
    };

    if (nickname.length < 3){
        res.status(400).send({
            errorMessage: "닉네임은 최소 3글자 이상이어야 합니다."
        });
        return;
    }

    if (password.length < 4) {
        res.status(400).send({
            errorMessage: "비밀번호는 최소 4자 이상이어야 합니다."
        });
        return;
    }
    if (password.includes(nickname) === true) {
        res.status(400).send({
            errorMessage: "비밀번호 안에 닉네임이 포함될 수 없습니다."
        });
        return;
    }
  
    // email or nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
    const existsUsers = await User.findAll({
      where: { nickname: nickname },
    });
    if (existsUsers.length) {
      res.status(400).send({
        errorMessage: "닉네임이 이미 사용중입니다.",
      });
      return;
    }
  
    await User.create({ nickname, password });
    res.status(201).json({message:"회원가입 완료!"});
  }); 


// 로그인
router.post("/auth", async (req, res) => { 
    const { nickname, password } = req.body;
  
    const user = await User.findOne({
      where: { nickname:nickname },
    });
  
    // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
    if (!user || password !== user.password) {
      res.status(400).send({
        errorMessage: "닉네임 또는 패스워드가 틀렸습니다.",
      });
      return;
    };
    const token = jwt.sign({ userId: user.userId }, "customized-secret-key");
    res.cookie('token', token);

    res.json({token:token})

  }); 

module.exports = router;