const { query } = require("express");
const express = require("express");
const router = express.Router();
const data = require("../data");
const billData = data.bills;

// create a new bill
router.post("/newBill", async (req, res) => {
  const billInfo = req.body;
  // if(Array.isArray(billInfo)){
  //   try {
  //       const newBill = await billData.addNewBill(billInfo);
  //       res.send(newBill.ops);
  //   }catch{
  //       res.status(404).json({ error: "Post not found" });
  //   }
  // }
  billInfo.food = parseInt(billInfo.food);
  billInfo.entertainment = parseInt(billInfo.entertainment);
  billInfo.transportation = parseInt(billInfo.transportation);
  billInfo.other = parseInt(billInfo.other);
  billInfo.userId = req.session.user.userId;
  billInfo.userName = req.session.user.username;

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
 
  console.log(billInfo);
  try {
    const newBill = await billData.addNewBill(billInfo);
    if(!newBill){
        throw 'Add Fail ! There is already a bill at this date !'
    }
    // res.render('posts/new-bill',{
    //   title:"New Bill"
    //  });
    // res.send("asadasd");
    console.log(billInfo.date);
    // res.render('posts/new-bill', { layout: null, showlisteach2: newBill });
    var userid = req.session.user.userId;

    var user_req = { userId: userid };
    var chart_billdata = await billData.getBill(user_req);
    console.log(chart_billdata);

    // extraxt the recent three day bills from chart_billdata,
    // the actual format should be same as fake_data
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

router.get("/newBill", async (req, res) => {
  if (req.session.user) {
    //let name = req.session.user.userId;
    const billInfo = req.body;
    //let user = await users.getUserByName(name);
    //   const newBill = await billData.addNewBill(billInfo);
    //   res.render('posts/new-bill',{
    //     //info: user
    //     billechart: newBill
    //   });
    return;
  } else {
    res.render("posts/login", {
      title: "login",
    });
  }
});

router.get("/getBillChart", async (req, res) => {
  const billInfo = req.query;
  if (!billInfo) {
    res.status(400).json({ error: "cannot receive any data " });
    return;
  }
  if (!billInfo.userId || typeof billInfo.userId !== "string") {
    res.status(400).json({ error: "You must provide a  userId and it must be a string  " });
    return;
  }
  //billInfo.dataTs && 松德说加在底下的括号里 但我不明白为啥
  if (billInfo.date && typeof billInfo.dateTs !== "number") {
    res.status(400).json({ error: "type of dateTs  must be a number " });
    return;
  }
  //billInfo.date && 松德说加在底下的括号里 但我不明白为啥
  if (billInfo.date && typeof billInfo.date !== "string") {
    res.status(400).json({ error: "type of date  must be a string " });
    return;
  }
  try {
    
    const billList = await billData.getBill(billInfo);
   // console.log(billList);  //是从这里打印出来的！！！！！！！！！---lsd
    res.json({
      code: 200,
      data: billList,
    });
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.delete("/delete", async (req, res) => {
//   const { date, dateTs } = req.query;
//   if (!date || !dateTs) {
//     res.status(400).json({ error: "you must provide date and dateTs to delete a bill " });
//     return;
//   }
//   console.log(date, dateTs);
//   try {
//     const deleteRes = await billData.deleteBill(date, dateTs);
//     res.json({
//       code: 200,
//       data: deleteRes,
//     });
//   } catch (e) {
//     res.status(404).json({ error: e });
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
    }catch (e) {
        res.status(404).json({ error: e });
    }
});

router.get("/getBillday", async (req, res) => {
  try {
    const daybill = await billData.getBillday();
    res.status(400).json(daybill);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.get("/getBillmonth", async (req, res) => {
  try {
    const monthbill = await billData.getBillmonth();
    res.status(400).json(monthbill);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.get("/getBillyear", async (req, res) => {
  try {
    const yearbill = await billData.getBillyear();
    res.status(400).json(yearbill);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.get("/getAllBill", async (req, res) => {
    try {
      const billInfo = req.query
     // console.log(billInfo);
      const allBill = await billData.getAllBill(billInfo.userId);

      res.status(200).json(allBill);
    } catch (e) {
      res.status(404).json({ error: e });
    }
});

router.post("/newTodoList", async (req, res) => {
    try {
    
      const todoListInfo = req.body
      console.log('************')
      console.log(todoListInfo)

      console.log('************')

      const allTodoList = await billData.newTodoList(todoListInfo);
      res.status(200).json(allTodoList);
    } catch (e) {
      res.status(404).json({ error: e });
    }
});
router.get("/getTodoList", async (req, res) => {
    try {
      const todoListInfo = req.query
      const allTodoList = await billData.getTodoList(todoListInfo.userId);
      res.status(200).json(allTodoList);
    } catch (e) {
      res.status(404).json({ error: e });
    }
});
router.delete("/deleteTodoList", async (req, res) => {
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
