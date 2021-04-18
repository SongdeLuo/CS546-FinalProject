const express = require('express');
const router = express.Router();
const data = require('../data');
//const { checkUserByName, checkUserByMail } = require('../data/users');
const users = data.users;
const bcrypt = require('bcryptjs');
const saltRounds = 10;


// router.get('/', async(req, res) => {
//     try {
//         let user = await users.getAll();
//         res.json(user);
//     } catch (e) {
//         res.status(404).json({ message: e });
//     }
// });


// login
router.post('/login', async(req, res) => {
    let userInfo = req.body
    console.log("我被请求了");
    //console.log(userInfo.Password);
    if (!userInfo.Username || typeof userInfo.Username != 'string' || userInfo.Username == null || userInfo.Username == "") {
        res.status(400).json({ error: 'Username is null or Username is not string' });
        return;
    }

    if (!userInfo.Password || typeof userInfo.Password != 'string' || userInfo.Password == null || userInfo.Password == "") {
        res.status(400).json({ error: 'Password is null or Password is not string' });
        return;
    }
    try {
        let user = await users.getUserByName(userInfo.Username);
        if (user === null) {
            res.status(404).json({ error: 'Not that user' });
            return;
        }
        
        let compareToMerlin = false;
        compareToMerlin = await bcrypt.compare(userInfo.Password, user.Password);
        if (compareToMerlin) {
            // res.json({
            //     code: 200,
            //     msg: 'Login Success'
            // })
            req.session.user ={
               userId:user._id,
               username:userInfo.Username
            }
            res.redirect('new-bill');
        } else {
            res.json({
                code: 403,
                msg: 'Error'
            });
        }
    } catch (e) {
    //    console.log(e);
        res.status(404).json({ error: e });
    }
});

router.get('/login',(req, res) =>{
    //console.log(req.session.user);
    if (req.session.user) {
      res.redirect('new-bill');
    } else{
      res.render('posts/login',{
        title:'LOGIN'
      });
    }
    
  });
  router.get('/register',(req, res) =>{
    res.render('posts/register',{
      title:'Register'
    });
  });

  router.get('/mycenter',(req, res) =>{
    res.render('posts/mycenter',{
      title:'My Center'
    });
  });

  router.get('/new-bill',(req, res) =>{
    
    res.render('posts/new-bill',{
      title:'New Bill'
    });
  });

  router.get('/allbills',(req, res) =>{
    res.render('posts/allbills',{
      title:'All Bills'
    });
  });

  router.get('/logout',(req, res) =>{
    res.clearCookie('AuthCookie');
    res.render('posts/login',{
      title:'All Bills'
    });
  });

// change password
router.post('/password', async(req, res) => {
    let userInfo = req.body

    if (!userInfo.Mail || !userInfo.Mail.match(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/) || userInfo.Mail == null) {
        res.status(400).json({ error: 'Mail is not a Mail format or Mail is null' });
        return;
    }

    if (!userInfo.Password || typeof userInfo.Password != 'string' || userInfo.Password == null || userInfo.Password == "") {
        res.status(400).json({ error: 'Password is null or Password is not string' });
        return;
    }

    try {
        let user = await users.getUserByMail(userInfo.Mail);
        if (user === null) {
            res.status(404).json({ error: 'Not that user' });
            return;
        }
        if (userInfo.Mail === user.Mail) {
            await users.patchUserByMail(user.Mail, userInfo.Password);
            res.json({
                code: 200,
                msg: 'change Success'
            })
        } else {
            res.json({
                code: 403,
                msg: 'Error, no such mail'
            });
        }
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

//get infor
router.get('/:id', async(req, res) => {
    let id = req.params.id;
    if (!id.match(/^([0-9a-fA-F]{24})$/)) {
        res.status(400).json({ message: 'id format error' });
        return;
    }
    try {
        let gbookid = await users.getUserById(id);
        res.json(gbookid);
    } catch (e) {
        res.status(404).json({ message: e });
    }
});


// sign up
router.post('/signUp', async(req, res) => {
    let newuser = req.body;
    console.log("我被请求了");
    console.log(req.body);

    if (newuser == null || typeof newuser != "object") {
        res.status(400).json({ error: 'It is null or It is not object' });
        return;
    }

    if (!newuser.Username || typeof newuser.Username != 'string' || newuser.Username == null || newuser.Username == "") {
        res.status(400).json({ error: 'Username is null or Username is not string' });
        return;
    } else if (await users.checkUserByName(newuser.Username)) {
        res.status(400).json({ error: 'Username is exit' });
        return;
    }

    if (!newuser.Password || typeof newuser.Password != 'string' || newuser.Password == null || newuser.Password == "") {
        res.status(400).json({ error: 'Password is null or Password is not string' });
        return;
    }

    // if (!newuser.FirstName || typeof newuser.FirstName != 'string' || newuser.FirstName == null || newuser.FirstName == "") {
    //     res.status(400).json({ error: 'FirstName is null or FirstName is not string' });
    //     return;
    // }
    //我看前端网页的注册界面只要填账户，密码，邮箱，电话，暂时先把名字啥的注释掉  到时候再看 ---罗松德

    // if (!newuser.LastName || typeof newuser.LastName != 'string' || newuser.LastName == null || newuser.LastName == "") {
    //     res.status(400).json({ error: 'LastName is null or LastName is not string' });
    //     return;
    // }

    // if (!newuser.age || typeof newuser.age != 'number' || newuser.age == null || newuser.age == "") {
    //     res.status(400).json({ error: 'age is null or age is not number' });
    //     return;
    // }

    if (!newuser.Mail || !newuser.Mail.match(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/) || newuser.Mail == null) {
        res.status(400).json({ error: 'Mail is not a Mail format or Mail is null' });
        return;
    }
    //|| !newuser.Phone.match(/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/)
    if (!newuser.Phone || newuser.Phone == null) {
        res.status(400).json({ error: 'Phone is not a Phone format or Phone is null' });
        return;
    }

    if (await users.checkUserByMail(newuser.Mail, newuser.Phone)) {
        res.status(400).json({ error: 'Mial or phone is exit' });
        return;
    }

    //let { Username, Password, FirstName, LastName, age, Mail, Phone } = newuser;
    let { Username, Password, Mail, Phone } = newuser;   //这里也相应把名字啥的注释掉了 ---罗松德
    //let pouserid = await users.addPost(Username, Password, FirstName, LastName, age, Mail, Phone);
    let pouserid = await users.addPost(Username, Password, Mail, Phone);
    res.json(pouserid);

    // try {
    //     let { Username, Password, FirstName, LastName, age, Mail, Phone } = newuser;
    //     let pouserid = await users.addPost(Username, Password, FirstName, LastName, age, Mail, Phone);
    //     res.json(pouserid);
    // } catch (e) {
    //     res.status(404).json({ message: e });
    // }
});



//change infor
router.patch('/:id', async(req, res) => {
    let userpa = req.body;
    let id = req.params.id;

    if (userpa.hasOwnProperty("Username")) {
        if (!userpa.Username || typeof userpa.Username != 'string' || userpa.Username == null || userpa.Username == "") {
            res.status(400).json({ error: 'Username is null or Username is not string' });
            return;
        } else if (await users.checkUserByName(userpa.Username)) {
            res.status(400).json({ error: 'Username is exit' });
            return;
        }
    }

    if (userpa.hasOwnProperty("FirstName")) {
        if (!userpa.FirstName || typeof userpa.FirstName != 'string' || userpa.FirstName == null || userpa.FirstName == "") {
            res.status(400).json({ error: 'FirstName is null or FirstName is not string' });
            return;
        }
    }

    if (userpa.hasOwnProperty("LastName")) {
        if (!userpa.LastName || typeof userpa.LastName != 'string' || userpa.LastName == null || userpa.LastName == "") {
            res.status(400).json({ error: 'LastName is null or LastName is not string' });
            return;
        }
    }

    if (userpa.hasOwnProperty("age")) {
        if (!userpa.age || typeof userpa.age != 'number' || userpa.age == null || userpa.age == "") {
            res.status(400).json({ error: 'age is null or age is not number' });
            return;
        }
    }

    if (id == null || !id || id == "") {
        res.status(400).json({ message: 'id is null' });
        return;
    }

    if (!id.match(/^([0-9a-fA-F]{24})$/)) {
        res.status(400).json({ message: 'id format error' });
        return;
    }

    // try {
    let pauserid = await users.patchUserById(id, userpa);
    res.json(pauserid);
    // } catch (e) {
    //     res.status(404).json({ message: e });
    // }
});

router.get('*', async(req, res) => {
    res.status(404).json({ error: 'Not found' });
});

router.put('*', async(req, res) => {
    res.status(404).json({ error: 'Not found' });
});

router.post('*', async(req, res) => {
    res.status(404).json({ error: 'Not found' });
});

router.patch('*', async(req, res) => {
    res.status(404).json({ error: 'Not found' });
});

router.delete('*', async(req, res) => {
    res.status(404).json({ error: 'Not found' });
});

module.exports = router;