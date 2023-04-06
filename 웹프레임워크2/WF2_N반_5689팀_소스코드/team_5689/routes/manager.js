const express = require(`express`);
const passport = require('passport');
const mail = require('../mail/mail')
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const bcrypt = require('bcrypt');
// const managerPW = bcrypt.hashSync("manager", 10);
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Hashtag } = require('../models');

const { sequelize } = require('../models');
const { userInfo } = require('os');
const { isNativeError } = require('util/types');

const app = express();
app.set('view engine', 'html');
nunjucks.configure('../views', {
  express: app,
  watch: true,
});
sequelize.sync({ force: false })
.then( () => {
  console.log("DB connected");
})
.catch( (err) => {
  console.error(err);
})
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
  next();
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: 'Profile - prj-name' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: 'Join to - prj-name' });
});

router.get('/',async(req,res,next)=>{
    // console.log("manager.js 실행됨")
    // res.render('manager_page',{});
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
        managername: process.env.GMAIL_ID,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  
router.post('/add',(req,res,next)=>{
console.log(req.body.email);
  try{
    if(req.body.email)
    {
      User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: req.body.passwd,
      });
      res.redirect(`/manager`);
    }
  }
  catch(error)
  {
    console.log(error);
    next(error);
  }
  })
  
  router.post('/view',(req,res,next)=>{
    User.findAll({
      
    })
    .then((data)=>{
      data_length=data.length
      console.log(data_length);
      res.render('manager_view',{
          data:data,
          data_length:data_length,
          managername: process.env.GMAIL_ID,
    })})
    .catch((error)=>{
      console.log(error);
      next(error);
    });
  })
  
  router.post('/delete',(req,res,next)=>{
    console.log(req.body.email_name);
    User.destroy(
      {
        where: {email : req.body.email_name},
      });

      res.redirect(307, '/manager/view');
      //새로고침
  })
  
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

module.exports = router;  