const express = require("express");
const router = express.Router();
const data = require("../data");
//const { checkUserByName, checkUserByMail } = require('../data/users');
const users = data.users;
const bcrypt = require("bcryptjs");
const svgCaptcha = require("svg-captcha");
const saltRounds = 10;


// login
router.post("/login", async(req, res) => {
    let userInfo = req.body;

    const { VerificationCode } = req.body;
    if (VerificationCode.toLocaleUpperCase() !== req.session.img_code) {
        res.render("posts/login", {
            title: "LOGIN",
            warn: "Verification code error",
        });
        return;
    }

    //console.log(userInfo);
    if (!userInfo.Username ||
        typeof userInfo.Username != "string" ||
        userInfo.Username == null ||
        userInfo.Username == ""
    ) {
        res.render("posts/login", {
            title: "LOGIN",
            warn: "Username is null or Username is not string",
        });
        return;
    }

    if (!userInfo.Password ||
        typeof userInfo.Password != "string" ||
        userInfo.Password == null ||
        userInfo.Password == ""
    ) {

        res.render("posts/login", {
            title: "LOGIN",
            warn: "Password is null or Password is not string",
        });
        return;
    }

    if (userInfo.Username.length > 18) {
        res.render("posts/login", {
            title: "LOGIN",
            warn: "UserName is too long, must less 18 word",
        });
        return;
    }

    if (userInfo.Password.length > 18 || userInfo.Password.length < 6) {
        res.render("posts/login", {
            title: "LOGIN",
            warn: "Password must less 18 or more than 6 ",
        });
        return;
    }
    try {
        let user = await users.getUserByName(userInfo.Username);
        if (user === null) {

            res.render("posts/login", {
                title: "LOGIN",
                warn: "Not that user",
            });
            return;
        }

        let compareToMerlin = false;
        compareToMerlin = await bcrypt.compare(userInfo.Password, user.Password);
        if (compareToMerlin) {
            // res.json({
            //     code: 200,
            //     msg: 'Login Success'
            // })
            req.session.user = {
                userId: user._id,
                username: userInfo.Username,
            };
            res.redirect("new-bill");
        } else {
            res.render("posts/login", {
                title: "LOGIN",
                warn: "password is wrong",
            });
        }
    } catch (e) {
        //    console.log(e);
        res.status(404).json({ error: e });
    }
});

router.get("/login", (req, res) => {
    //console.log(req.session.user);
    if (req.session.user) {
        res.redirect("new-bill");
    } else {
        res.render("posts/login", {
            title: "LOGIN",
        });
    }
});

//获取验证码的接口
router.get("/login_img_code", (req, res) => {
    const captcha = svgCaptcha.create({
        noise: 3, // 干扰线条的数量
        background: "#ff5033", // 背景颜色
    });
    // 将图片的验证码存入到 session 中
    req.session.img_code = captcha.text.toLocaleUpperCase(); // 将验证码装换为大写
    res.type("svg");
    res.status(200).send(captcha.data);
});

router.get("/register", (req, res) => {
    res.render("posts/register", {
        title: "Register",
    });
});


router.get('/mycenter', async(req, res) => {
    //ruiqi0505
    if (req.session.user) {
        let name = req.session.user.username;


        let user = await users.getUserByName(name);
        res.render('posts/mycenter', {
            info: user
        });
        return;
    } else {
        res.render('posts/login', {
            title: 'login'
        });
    }

});


router.get('/new-bill', async(req, res) => { //ruiqi0505
    if (req.session.user) {
        res.render('posts/new-bill', {
            userId: req.session.user.userId
        });
        return;
    } else {
        res.render('posts/login', {
            title: 'login'
        });
    }

});


router.get('/allbills', async(req, res) => { //ruiqi0505
    if (req.session.user) {
        res.render('posts/allbills', {
            userId: req.session.user.userId
        });
        return;
    } else {
        res.render('posts/login', {
            title: 'login'
        });
    }

});

router.get('/todolist', async(req, res) => { //ruiqi0505
    if (req.session.user) {
        res.render('posts/todolist', {
            userId: req.session.user.userId
        });
        return;
    } else {
        res.render('posts/login', {
            title: 'login'
        });
    }

});

router.post('/todo', function(request, response) {
    todoData.makeToDo(xss(request.body.name), xss(request.body.description));
    // response.json({ success: true, message: request.body.description });
    response.json({ success: true, message: xss(request.body.description) });
});

router.post('/todo/complete/:id', function(request, response) {
    const updatedData = todoData.finishToDo(parseInt(request.params.id));
    response.render('partials/todo_item', { layout: null, ...updatedData });
});

router.post('/todo.html', function(request, response) {
    const newTodo = todoData.makeToDo(xss(request.body.name), xss(request.body.description));
    response.render('partials/todo_item', { layout: null, ...newTodo });
});


router.get("/logout", (req, res) => {
    res.clearCookie("AuthCookie");
    res.render("posts/login", {
        title: "All Bills",
    });
});

// change password
router.post("/password", async(req, res) => {
    let userInfo = req.body;

    if (!userInfo.Mail ||
        !userInfo.Mail.match(
            /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
        ) ||
        userInfo.Mail == null
    ) {
        res
            .status(400)
            .json({ error: "Mail is not a Mail format or Mail is null" });
        return;
    }

    if (!userInfo.Password ||
        typeof userInfo.Password != "string" ||
        userInfo.Password == null ||
        userInfo.Password == ""
    ) {
        res
            .status(400)
            .json({ error: "Password is null or Password is not string" });
        return;
    }

    try {
        let user = await users.getUserByMail(userInfo.Mail);
        if (user === null) {
            res.status(404).json({ error: "Not that user" });
            return;
        }
        if (userInfo.Mail === user.Mail) {
            await users.patchUserByMail(user.Mail, userInfo.Password);
            res.json({
                code: 200,
                msg: "change Success",
            });
        } else {
            res.json({
                code: 403,
                msg: "Error, no such mail",
            });
        }
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

//get infor
router.get("/:id", async(req, res) => {
    let id = req.params.id;
    if (!id.match(/^([0-9a-fA-F]{24})$/)) {
        res.status(400).json({ message: "id format error" });
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
router.post("/signUp", async(req, res) => {
    let newuser = req.body;
    console.log(req.body);

    if (newuser == null || typeof newuser != "object") {
        res.render("posts/Register", {
            title: "Register",
            warn: "It is null or It is not object",
        });

        return;
    }

    if (!newuser.Username ||
        typeof newuser.Username != "string" ||
        newuser.Username == null ||
        newuser.Username == ""
    ) {

        res.render("posts/Register", {
            title: "Register",
            warn: "Username is null or Username is not string",
        });
        return;
    } else if (await users.checkUserByName(newuser.Username)) {

        res.render("posts/Register", {
            title: "Register",
            warn: "Username is exit",
        });
        return;
    }

    if (!newuser.Password ||
        typeof newuser.Password != "string" ||
        newuser.Password == null ||
        newuser.Password == ""
    ) {

        res.render("posts/Register", {
            title: "Register",
            warn: "Password is null or Password is not string",
        });

        return;
    }


    if (!newuser.Mail ||
        !newuser.Mail.match(
            /^[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
        ) ||
        newuser.Mail == null
    ) {

        res.render("posts/Register", {
            title: "Register",
            warn: "Mail is not a Mail format or Mail is null",
        });

        return;
    }
    //|| !newuser.Phone.match(/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/)
    if (!newuser.Phone || newuser.Phone == null) {
        res.render("posts/Register", {
            title: "Register",
            warn: "Phone is not a Phone format or Phone is null",
        });

        return;
    }

    if (await users.checkUserByMail(newuser.Mail, newuser.Phone)) {
        res.render("posts/Register", {
            title: "Register",
            warn: "Mial or phone is exit",
        });
        return;
    }

    if (newuser.Username.length > 18) {
        res.render("posts/Register", {
            title: "Register",
            warn: "userName is too long, must less 18 word",
        });
        return;
    }

    if (newuser.Password.length > 18 || newuser.Password.length < 6) {
        res.render("posts/Register", {
            title: "Register",
            warn: "Password must less 18 or more than 6 ",
        });
        return;
    }

    let isnum = /^\d+(\.\d+)?$/.test(newuser.Phone);
    if (!isnum) {
        res.render("posts/Register", {
            title: "Register",
            warn: "Password must be number ",
        });
        return;
    }


    try {
        let { Username, Password, Mail, Phone } = newuser;
        let pouserid = await users.addPost(Username, Password, Mail, Phone);
        res.redirect("login");
    } catch (e) {
        res.status(404).json({ message: e });
    }
});


router.post("/editUserInfo", async(req, res) => {
    let requestBody = req.body;
    let id = req.session.user.userId;
    let updatedObject = {};
    try {
        const oldInfo = await users.getUserByName(requestBody.username);

        if (requestBody.firstName && requestBody.firstName !== oldInfo.FirstName && requestBody.firstName != " ") {
            if (requestBody.firstName.length > 18) {
                //console.log("Firstname")
                res.status(400).json({ error: "Firstname too long, must less than 18 letter" });
                return;
            }
            let isletter = /^[a-zA-Z]+$/.test(requestBody.firstName);
            if (!isletter) {
                //console.log("firstName")
                res.status(400).json({ error: "firstName must be letter " });
                return;
            }
            updatedObject.FirstName = requestBody.firstName;
        }


        if (requestBody.lastName && requestBody.lastName !== oldInfo.LastName && requestBody.lastName != " ") {
            if (requestBody.lastName.length > 18) {
                //console.log("lastname")
                res.status(400).json({ error: "lastname too long, must less than 18 letter" });
                return;
            }
            let isletter = /^[a-zA-Z]+$/.test(requestBody.lastName);
            if (!isletter) {
                //console.log("lastname")
                res.status(400).json({ error: "lastname must be letter " });
                return;
            }
            updatedObject.LastName = requestBody.lastName;
        }


        if (requestBody.age && requestBody.age !== oldInfo.age && requestBody.age != " ") {
            if (requestBody.age.length > 2) {
                //console.log("age")
                res.status(400).json({ error: "age must less than 3 letter" });
                return;
            }

            let isnum = /^\d+(\.\d+)?$/.test(requestBody.age);
            if (!isnum) {
                //console.log("age")
                res.status(400).json({ error: "age must be number" });
                return;
            }
            updatedObject.age = requestBody.age;
        }

    } catch (e) {
        res.status(404).json({ error: 'Post not found' });
        return;
    }

    try {
        const updatedInfo = await users.updateInfo(
            id,
            updatedObject
        );
        // if (updatedInfo) {
        //     res.status(200).json({ message: "Add successful" });
        // }
    } catch (e) {
        res.status(500).json({ error: e });
    }
});


router.get("*", async(req, res) => {
    res.status(404).json({ error: "Not found" });
});

router.put("*", async(req, res) => {
    res.status(404).json({ error: "Not found" });
});

router.post("*", async(req, res) => {
    res.status(404).json({ error: "Not found" });
});

router.patch("*", async(req, res) => {
    res.status(404).json({ error: "Not found" });
});

router.delete("*", async(req, res) => {
    res.status(404).json({ error: "Not found" });
});

module.exports = router;