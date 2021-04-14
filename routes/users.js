const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;

// sign up
router.post('/signUp', async (req, res) => {
  const userInfo = req.body
  console.log(userInfo)
  try {
    let user = await userData.signUp(userInfo);
    res.json(user);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

// login
router.post('/login', async (req, res) => {
  const userInfo = req.body
  try {
    let user = await userData.getUserByName(userInfo.userName);
    if(userInfo.passWord === user.passWord){
      res.json({
        code: 200,
        msg: 'Login Success'
      })
    }else{
      res.json({
        code: 403,
        msg: 'Error'
      });
    }
  } catch (e) {
    res.status(404).json({ error: e });
  }
});












module.exports = router;
