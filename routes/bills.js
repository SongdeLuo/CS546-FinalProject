const { query } = require("express");
const express = require("express");
const router = express.Router();
const data = require("../data");
const billData = data.bills;
const xss = require("xss");

// create a new bill
router.post("/newBill", async(req, res) => {
    const billInfo = req.body;

    options = {
        whiteList: {

        }
    }; // 自定义规则
    myxss = new xss.FilterXSS(options);

    billInfo.food = parseInt(billInfo.food);
    billInfo.entertainment = parseInt(billInfo.entertainment);
    billInfo.transportation = parseInt(billInfo.transportation);
    billInfo.other = parseInt(billInfo.other);
    billInfo.userId = req.session.user.userId;
    billInfo.userName = req.session.user.username;
    billInfo.notes = myxss.process(billInfo.notes);
    console.log(billInfo.notes);

    if (!billInfo) {
        res.status(400).json({ error: "cannot receive any data " });
        return;
    }
    if (!billInfo.date || typeof billInfo.date !== "string") {
        res.status(400).json({ error: "You must provide a bill date and it must be a string " });
        return;
    }
    if (typeof billInfo.food !== "number") {
        res.status(400).json({ error: "type of food  must be a number " });
        return;
    }
    if (typeof billInfo.entertainment !== "number") {
        res.status(400).json({ error: "type of entertainment  must be a number " });
        return;
    }
    if (typeof billInfo.transportation !== "number") {
        res.status(400).json({ error: "type of transportation  must be a number " });
        return;
    }
    if (typeof billInfo.other !== "number") {
        res.status(400).json({ error: "type of other  must be a number " });
        return;
    }
    if (typeof billInfo.notes !== "string") {
        res.status(400).json({ error: "type of notes  must be a string " });
        return;
    }

    if (billInfo.notes.length > 50) {
        res.status(400).json({ error: "type of notes  must be less 50 letter " });
        return;
    }

    if (billInfo.other < 0 || billInfo.transportation < 0 || billInfo.entertainment < 0 || billInfo.food < 0) {
        res.status(400).json({ error: "must more than 0 " });
        return;
    }

    if (billInfo.other > 100000 || billInfo.transportation > 100000 || billInfo.entertainment > 100000 || billInfo.food > 100000) {
        res.status(400).json({ error: "must less than 100000 " });
        return;
    }

    console.log(billInfo);

    try {
        const newBill = await billData.addNewBill(billInfo);
        if (!newBill) {
            throw 'Add Fail ! There is already a bill at this date !'
        }
        console.log(billInfo.date);
        // res.render('posts/new-bill', { layout: null, showlisteach2: newBill });
        var userid = req.session.user.userId;

        var user_req = { userId: userid };
        var chart_billdata = await billData.getBill(user_req);
        console.log(chart_billdata);

        var fake_data = [
            [
                ["Food", billInfo.food],
                ["Entertainment", billInfo.entertainment],
                ["Transition", billInfo.transportation],
                ["Other", billInfo.other],
            ],
        ];
        res.send(fake_data);
        return;
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.get("/newBill", async(req, res) => {
    if (req.session.user) {
        const billInfo = req.body;
        return;
    } else {
        res.render("posts/login", {
            title: "login",
        });
    }
});

router.get("/getBillChart", async(req, res) => {
    const billInfo = req.query;
    if (!billInfo) {
        res.status(400).json({ error: "cannot receive any data " });
        return;
    }
    if (!billInfo.userId || typeof billInfo.userId !== "string") {
        res.status(400).json({ error: "You must provide a  userId and it must be a string  " });
        return;
    }

    if (billInfo.date && typeof billInfo.dateTs !== "number") {
        res.status(400).json({ error: "type of dateTs  must be a number " });
        return;
    }

    if (billInfo.date && typeof billInfo.date !== "string") {
        res.status(400).json({ error: "type of date  must be a string " });
        return;
    }
    try {

        const billList = await billData.getBill(billInfo);

        res.json({
            code: 200,
            data: billList,
        });
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.delete("/delete", async(req, res) => {
    const id = req.body.id
    if (!id) {
        res.status(400).json({ error: "you must provide id to delete a bill " });
        return;
    }
    try {
        const deleteRes = await billData.deleteBill(id);
        res.json({
            code: 200,
            data: deleteRes,
        });
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.get("/getBillday", async(req, res) => {
    try {
        const daybill = await billData.getBillday();
        res.status(400).json(daybill);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.get("/getBillmonth", async(req, res) => {
    try {
        const monthbill = await billData.getBillmonth();
        res.status(400).json(monthbill);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.get("/getBillyear", async(req, res) => {
    try {
        const yearbill = await billData.getBillyear();
        res.status(400).json(yearbill);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.get("/getAllBill", async(req, res) => {
    try {
        const billInfo = req.query
            // console.log(billInfo);
        const allBill = await billData.getAllBill(billInfo.userId);

        res.status(200).json(allBill);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.post("/newTodoList", async(req, res) => {
    try {
        options = {
            whiteList: {

            }
        }; // 自定义规则
        myxss = new xss.FilterXSS(options);
        const todoListInfo = req.body
        todoListInfo.content = myxss.process(todoListInfo.content)
        console.log('************')
        console.log(todoListInfo)

        console.log('************')

        const allTodoList = await billData.newTodoList(todoListInfo);
        res.status(200).json(allTodoList);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});
router.get("/getTodoList", async(req, res) => {
    try {
        const todoListInfo = req.query
        const allTodoList = await billData.getTodoList(todoListInfo.userId);
        res.status(200).json(allTodoList);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});
router.delete("/deleteTodoList", async(req, res) => {
    try {
        const id = req.body.id
        console.log('***********')
        console.log(id)
        console.log('***********')

        const deleteRes = await billData.deleteTodoList(id);
        res.status(200).json({
            code: 200,
            data: deleteRes
        });
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

module.exports = router;