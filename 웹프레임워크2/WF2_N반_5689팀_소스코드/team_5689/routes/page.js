const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Hashtag } = require('../models');


const { sequelize } = require('../models');
const { userInfo } = require('os');
const { isNativeError } = require('util/types');
const bcrypt = require('bcrypt');

const router = express.Router();


sequelize.sync({ force: false })
.then( () => {
  console.log("DB connected");
})
.catch( (err) => {
  console.error(err);
})


router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
  next();
});


router.post('/delete',(req,res,next)=>{
  console.log(req.body.email_name);
  User.destroy(
    {
      where: {email : req.body.email_name},
    }).then(()=>{
      res.redirect('/');
    });
})

router.post('/update1',(req,res,next)=>{
    res.render('update');
})

router.post('/update2',(req,res,next)=>{
  User.findOne({ where: { email: req.body.email_name} }).then((exUser)=>{
    if (exUser) {
      //이미 가입한 사람이면
      console.log("이미 가입한 사람입니다\n")
      return res.redirect('/update3?error=exist');
      //프론트에서 알림을 주도록 리다이렉션
      //리다이렉트 할 때, 뒤에 쿼리스트링을 준다
    }
    else{
      bcrypt.hash(req.body.password, 12).then((hash)=>{
        User.update({
          email: req.body.email_name,
          nick: req.body.nickname,
          password: hash,
        }, {
          where:{email: req.user.email}
        }).then(()=>{
          res.redirect('/');
        });
      })
    }
  })
})

router.get('/update3',(req,res,next)=>{
  res.render('update', { title: 'Join to - prj-name' });
})


router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: 'Profile - prj-name' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: 'Join to - prj-name' });
});

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ['id', 'nick'],
      },
      order: [['createdAt', 'DESC']],
    });
    res.render('main', {
      title: 'prj-name',
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/hashtag', async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }

    return res.render('main', {
      title: `${query} | NodeBird`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 비밀번호 찾기 페이지
router.get('/findPW', (req, res) => {
  res.render('findPW', { title: "비밀번호 찾기" });
});

// 비밀번호 재설정 페이지
router.get('/resetPW', (req, res) => {
  if(req.session['isVerified'] == false) {
    console.log(`Not Verifed Email`);
    res.redirect('/findPW');
  }
  res.render('resetPW', { title: "비밀번호 재설정" });
});

module.exports = router;
