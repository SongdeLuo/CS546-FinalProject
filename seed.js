const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bills = mongoCollections.bills;
const bcrypt = require("bcryptjs");
const saltRounds = 10;


async function main() {
    let userCollection = await users();
    let newPost = {
        Username: "admin",
        Password: "qaz123",
        FirstName: "songde",
        LastName: "luo",
        age: 23,
        Mail: "songdeluo@gmail.com",
        Phone: 13757138009,
    };
    newPost.Password = await bcrypt.hash(newPost.Password, saltRounds);
    let insertInfo = await userCollection.insertOne(newPost);
    if (insertInfo.insertedCount === 0) {
        throw 'Could not add user';
    } else {
         let newId = insertInfo.insertedId;
         let userget = await userCollection.findOne({ _id: newId });
         console.log(userget._id);
         let billCollection = await bills();
         const newBill = await billCollection.insertOne({
            userId: userget._id.toString(),
            date: '2021-05-13',
            dateTs: new Date('2021-05-13').getTime(),
            createTime: new Date().getTime(),
            food: 2,
            entertainment: 2,
            transportation: 2,
            other: 2,
            total:8
          });
          const newBill2 = await billCollection.insertOne({
            userId: userget._id.toString(),
            date: '2021-03-13',
            dateTs: new Date('2021-03-13').getTime(),
            createTime: new Date().getTime(),
            food: 22,
            entertainment: 12,
            transportation: 5,
            other: 7,
            total:46
          });
          const newBill3 = await billCollection.insertOne({
            userId: userget._id.toString(),
            date: '2020-08-13',
            dateTs: new Date('2020-08-13').getTime(),
            createTime: new Date().getTime(),
            food: 10,
            entertainment: 10,
            transportation: 5,
            other: 5,
            total:30
          });
          const newBill4 = await billCollection.insertOne({
            userId: userget._id.toString(),
            date: '2021-05-12',
            dateTs: new Date('2021-05-12').getTime(),
            createTime: new Date().getTime(),
            food: 5,
            entertainment: 5,
            transportation: 5,
            other: 5,
            total:20
          });
          const newBill5 = await billCollection.insertOne({
            userId: userget._id.toString(),
            date: '2021-05-11',
            dateTs: new Date('2021-05-11').getTime(),
            createTime: new Date().getTime(),
            food: 1,
            entertainment: 2,
            transportation: 3,
            other: 4,
            total:10
          });
    }
  
}


main();