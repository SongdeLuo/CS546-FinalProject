const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const uuid = require('uuid/v4');

let exportedMethods = {

    async addPost(Username, Password, Mail, Phone) {
        let userCollection = await users();
        if (!Username || typeof Username != 'string' || Username == null || Username == "") {
            throw 'Username is null or Username is not string';
        } else if (await userCollection.findOne({ Username: Username }) != null) {
            throw 'Username is exit';
        } else if (!Password || typeof Password != 'string' || Password == null || Password == "") {
            throw 'Password is null or Password is not string';
        }
        //  else if (!FirstName || typeof FirstName != 'string' || FirstName == null || FirstName == "") {
        //     throw 'FirstName is null or FirstName is not string';
        // } else if (!LastName || typeof LastName != 'string' || LastName == null || LastName == "") {
        //     throw 'LastName is null or LastName is not string';
        // } else if (!age || typeof age != 'number' || age == null || age == "") {
        //     throw 'age is null or age is not number';
        // }
       
        else if ( Mail == null) {
            
            //|| !Mail.match(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/)  在测试邮箱的时候出错我先把这个拿掉 --罗松德
            throw 'Mail is not a Mail format or Mail is null';
        } else if (!Phone || Phone == null) {
            throw 'Phone is not a Phone format or Phone is null';
        } else if (await userCollection.findOne({ Mail: Mail }) != null || await userCollection.findOne({ Phone: Phone }) != null) {
            throw 'Mial or phone is exit';
        } //!Phone.match(/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/) ||

        let newPost = {
            Username: Username,
            Password: Password,
           // FirstName: FirstName,
           // LastName: LastName,
           //age: age,
            Mail: Mail,
            Phone: Phone,
            bills: []
        };
        let insertInfo = await userCollection.insertOne(newPost);
        if (insertInfo.insertedCount === 0) {
            throw 'Could not add user';
        } else {
            let newId = insertInfo.insertedId;
            newId = newId.toString();
            let addm = await this.getUserById(newId);
            return addm;
        }
    },

    async getUserByName(name) {
        if (!name || typeof name != 'string' || name == null || name == "") {
            throw 'Username is null or Username is not string';
        }
        let userCollection = await users();
        let userget = await userCollection.findOne({ Username: name });
        if (userget === null) {
            throw 'No such user';
        } else {
            userget._id = userget._id.toString();
            return userget;
        }
    },

    async checkUserByName(name) {
        if (!name || typeof name != 'string' || name == null || name == "") {
            throw 'Username is null or Username is not string';
        }
        let userCollection = await users();
        let userget = await userCollection.findOne({ Username: name });
        if (userget == null) {
            return false;
        } else {
            return true;
        }
    },

    async getUserByMail(mail) {
        if (!mail || !mail.match(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/) || mail == null) {
            throw 'Mail is not a Mail format or Mail is null';
        }
        let userCollection = await users();
        let userget = await userCollection.findOne({ Mail: mail });
        if (userget === null) {
            throw 'No such user';
        } else {
            userget._id = userget._id.toString();
            return userget;
        }
    },

    async checkUserByMail(mail, phone) {
        if (!mail || !mail.match(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/) || mail == null) {
            throw 'Mail is not a Mail format or Mail is null';
        }

        if (!phone || phone == null) {
            throw 'phone is not a phone format or Phone is null';
        } //!phone.match(/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/) ||
        let userCollection = await users();
        let userget1 = await userCollection.findOne({ Mail: mail });
        let userget2 = await userCollection.findOne({ Phone: phone });
        if (userget1 != null || userget2 != null) {
            let str = 'Mail or phone is used';
            return str;
        } else {
            return null;
        }
    },

    async getUserById(id) {
        if (!id.match(/^([0-9a-fA-F]{24})$/) || !id || id == null) {
            throw 'id is not a id format or id is null';
        }
        let { ObjectId } = require('mongodb');
        let newObjId = ObjectId(id); //creates a new object ID
        let userCollection = await users();
        let userget = await userCollection.findOne({ _id: newObjId });
        if (userget === null) {
            throw 'No such user';
        } else {
            userget._id = userget._id.toString();
            return userget;
        }
    },

    async patchUserById(id, obj) {
        let { ObjectId } = require('mongodb');
        let newObjId = ObjectId(id); //creates a new object ID
        let userCollection = await users();
        let user = await userCollection.findOne({ _id: newObjId });
        if (user === null) {
            throw 'No such book';
        } else {
            let userCollection = await users();
            let { ObjectId } = require('mongodb');
            let newObjId = ObjectId(id);
            if (obj.hasOwnProperty("Username")) {
                if (!obj.Username || typeof obj.Username != 'string' || obj.Username == null || obj.Username == "") {
                    throw 'Username is null or Username is not string';
                } else if (await userCollection.findOne({ Username: obj.Username }) != null) {
                    throw 'Username is exit';
                } else if (obj.Username !== user.Username) {
                    let updateduser = {
                        Username: obj.Username,
                    };

                    let updatedInfo = await userCollection.updateOne({ _id: newObjId }, { $set: updateduser });
                    if (updatedInfo.modifiedCount === 0) {
                        throw 'Can not update Username';
                    }
                }
            }

            if (obj.hasOwnProperty("Password")) {
                if (!obj.Password || typeof obj.Password != 'string' || obj.Password == null || obj.Password == "") {
                    throw 'Password is null or Password is not string';
                } else if (obj.Password !== user.Password) {
                    let updateduser = {
                        Password: obj.Password,
                    };

                    let updatedInfo = await userCollection.updateOne({ _id: newObjId }, { $set: updateduser });
                    if (updatedInfo.modifiedCount === 0) {
                        throw 'Can not update Password';
                    }
                }
            }

            if (obj.hasOwnProperty("FirstName")) {
                if (!obj.FirstName || typeof obj.FirstName != 'string' || obj.FirstName == null || obj.FirstName == "") {
                    throw 'FirstName is null or FirstName is not string';
                } else if (obj.FirstName !== user.FirstName) {
                    let updateduser = {
                        FirstName: obj.FirstName,
                    };

                    let updatedInfo = await userCollection.updateOne({ _id: newObjId }, { $set: updateduser });
                    if (updatedInfo.modifiedCount === 0) {
                        throw 'Can not update FirstName';
                    }
                }
            }

            if (obj.hasOwnProperty("LastName")) {
                if (!obj.LastName || typeof obj.LastName != 'string' || obj.LastName == null || obj.LastName == "") {
                    throw 'LastName is null or LastName is not string';
                } else if (obj.LastName !== user.LastName) {
                    let updateduser = {
                        LastName: obj.LastName,
                    };

                    let updatedInfo = await userCollection.updateOne({ _id: newObjId }, { $set: updateduser });
                    if (updatedInfo.modifiedCount === 0) {
                        throw 'Can not update LastName';
                    }
                }
            }

            if (obj.hasOwnProperty("age")) {
                if (!obj.age || typeof obj.age != 'number' || obj.age == null || obj.age == "") {
                    throw 'age is null or age is not number';
                } else if (obj.age !== user.age) {
                    let updateduser = {
                        age: obj.age,
                    };
                    let updatedInfo = await userCollection.updateOne({ _id: newObjId }, { $set: updateduser });
                    if (updatedInfo.modifiedCount === 0) {
                        throw 'Can not update age';
                    }
                }
            }
            return await this.getUserById(id);
        }
    },

    async patchUserByMail(mail, password) {
        let userCollection = await users();
        let user = await userCollection.findOne({ Mail: mail });
        if (user === null) {
            throw 'No such user';
        } else {

            if (!password || typeof password != 'string' || password == null || password == "") {
                throw 'Password is null or Password is not string';
            } else if (password !== user.Password) {
                let updateduser = {
                    Password: password,
                };

                let updatedInfo = await userCollection.updateOne({ Mail: mail }, { $set: updateduser });
                if (updatedInfo.modifiedCount === 0) {
                    throw 'Can not update Password';
                }
            }

            return await this.getUserByMail(mail);
        }
    },
};

module.exports = exportedMethods;