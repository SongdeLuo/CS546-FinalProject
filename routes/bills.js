const express = require('express');
const router = express.Router();
const data = require('../data');
const billData = data.bills;

// create a new bill
router.post('/newBill', async (req, res) => {
  const billInfo = req.body

  billInfo.food = parseInt( billInfo.food);
  billInfo.entertainment = parseInt( billInfo.entertainment);
  billInfo.transportation = parseInt( billInfo.transportation);
  billInfo.other = parseInt( billInfo.other);
 
 
 
  if (!billInfo ) {
    res.status(400).json({ error: 'cannot receive any data ' });
    return;
}
  if (!billInfo.date || typeof billInfo.date !== 'string' ) {
    res.status(400).json({ error: 'You must provide a bill date and it must be a string ' });
    return;
}
// if (!billInfo.userId || typeof billInfo.userId !== 'string' ) {
//   res.status(400).json({ error: 'You must provide a userId and it must be a string ' });
//   return;
// }
//先注释掉，目前还没想怎么获取到用户id --罗松德
if ( typeof billInfo.food !== 'number' ) {
  
  res.status(400).json({ error: 'type of food  must be a number ' });
  return;
}
if ( typeof billInfo.entertainment !== 'number' ) {
 
  res.status(400).json({ error: 'type of entertainment  must be a number ' });
  return;
}
if ( typeof billInfo.transportation !== 'number' ) {
  
  res.status(400).json({ error: 'type of transportation  must be a number ' });
  return;
}
if ( typeof billInfo.other !== 'number' ) {
 
  res.status(400).json({ error: 'type of other  must be a number ' });
  return;
}
if ( typeof billInfo.notes !== 'string' ) {
 
  res.status(400).json({ error: 'type of notes  must be a string ' });
  return;
}
 // console.log(billInfo);
  try {
    const newBill = await billData.addNewBill(billInfo);
    // res.render('posts/new-bill',{
    //   title:"New Bill"
    //  });
    res.send("asadasd");
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: 'Post not found' });
  }
});


router.get('/getBillChart', async (req, res) => {
  const billInfo = req.query
  if (!billInfo ) {
    res.status(400).json({ error: 'cannot receive any data ' });
    return;
}
if (!billInfo.userId || typeof billInfo.userId !== 'string'  ) {
  res.status(400).json({ error: 'You must provide a  userId and it must be a string  ' });
  return;
}

if (typeof billInfo.dateTs !== 'number'  ) {
  res.status(400).json({ error: 'type of dateTs  must be a number ' });
  return;
}
if (typeof billInfo.date !== 'string'  ) {
  res.status(400).json({ error: 'type of date  must be a string ' });
  return;
}
  try {
    const billList = await billData.getBill(billInfo);
    console.log(billList)
    res.json({
      code: 200,
      data: billList
    });
  } catch (e) {
    res.status(404).json({ error: e });
  }
});


router.delete('/delete', async (req, res) => {
  const {date, dateTs} = req.query
  if (!date || !dateTs ) {
    res.status(400).json({ error: 'you must provide date and dateTs to delete a bill ' });
    return;
  }
  console.log(date, dateTs)
  try {
    const deleteRes = await billData.deleteBill(date, dateTs);
    res.json({
      code: 200,
      data: deleteRes
    });
  } catch (e) {
    res.status(404).json({ error: e });
  }
});





module.exports = router;
