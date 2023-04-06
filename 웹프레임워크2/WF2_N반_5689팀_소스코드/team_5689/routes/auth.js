const express = require('express');
const passport = require('passport');

const dotenv = require('dotenv');
dotenv.config();

const bcrypt = require('bcrypt');
const mail = require('../mail/mail')
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  if(req.session.hasOwnProperty('randomCode') == false || 
    req.session.hasOwnProperty('isVerified') == false ||
    req.session.hasOwnProperty('receiverEmail') == false ||
    req.session['isVerified'] == false ){
      console.error(`Invalid Session Error`);
      req.session.destroy();
      return res.status(403).send();
  }

  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.status(400).send();
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }


      if(user.email == process.env.GMAIL_ID)
      {
        //console.log("user.email "+ user.email);
        return res.redirect("/manager");
      }

      
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.post('/mail/dupcheck', isNotLoggedIn, async (req, res) => {
  const email = req.body.dupCheckEmail;

  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      console.log(`'${email}' is already exist`);
      return res.status(400).send();
    }
    return res.status(200).send();
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
});

router.post('/mail', isNotLoggedIn, async (req, res) => {
  const maxTimeOut = 180000;
  const receiverEmail = req.body.receiverEmail;
  
  const generateRandomCode = (min, max) => {
    let randomNumber = (Math.floor(Math.random() * (max-min+1)) + min).toString();
    return randomNumber.padStart(6, '0');
  }

  try {
    const randomCode = generateRandomCode(0, 999999);
    
    mail(receiverEmail, randomCode);

    if(req.session.hasOwnProperty('receiverEmail') == false){
      req.session['receiverEmail'] = receiverEmail;
    }
    req.session['isVerified'] = false;
    req.session['randomCode'] = randomCode;
    console.log(`RandomCode is ${randomCode}`);
    req.session.cookie.expires = new Date(Date.now() + maxTimeOut);
    
    return res.status(200).send();
  } catch(err){
    return res.status(500).send();
  }
});

router.post('/mail/check', isNotLoggedIn, async (req, res) => {
  const clientSendRandomCode = req.body.randomCode;

  if(req.session.hasOwnProperty('randomCode') == false || 
      req.session.hasOwnProperty('isVerified') == false ||
      req.session.hasOwnProperty('receiverEmail') == false ){
        console.error(`Invalid Session Error`);
        req.session.destroy();
        return res.status(403).send();
  }

  if(req.session['randomCode'] == clientSendRandomCode){
    req.session.cookie.expires = 1800000;
    if(req.session['isVerified'] === true){
      console.log(`Mail is already Verified`);
      return res.redirect('/resetPW');
    }
    req.session['isVerified'] = true;
    console.log(`'${req.session['receiverEmail']}' Mail Auth is successfully Passed`);
    return res.status(200).send();
  } else {
    console.log(`'${req.session['receiverEmail']}' Mail Auth is Failed`)
    return res.status(400).send();
  }
})

router.post('/reset', isNotLoggedIn, async (req, res) => {
  if(req.session.hasOwnProperty('randomCode') == false || 
      req.session.hasOwnProperty('isVerified') == false ||
      req.session.hasOwnProperty('receiverEmail') == false ||
      req.session['isVerified'] == false ){
        console.error(`Invalid Session Error`);
        req.session.destroy();
        return res.status(403).send();
  }

  const email = req.session['receiverEmail'];

  try {
    const exUser = await User.findOne({ where: { email } });
    if (!exUser) {
      console.error(`'${email}' user is doesn't exist`);
      res.session.destroy();
      return res.status(404).send();
    }

    const { password } = req.body;
    const hash = await bcrypt.hash(password, 12);
    
    await User.update({ password: hash }, { where: { email }});

    console.log(`Password Successfully Changed`)
    req.session.destroy();
    return res.status(200).send();
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;
