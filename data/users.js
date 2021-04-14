const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const uuid = require('uuid/v4');

let exportedMethods = {

  async signUp(userInfo) {
    const userCollection = await users();
    const newUser = await userCollection.insertOne({
      _id: uuid(),
      ...userInfo
    });
    return newUser;
  },





};

module.exports = exportedMethods;
