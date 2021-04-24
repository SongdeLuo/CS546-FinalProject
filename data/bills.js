const mongoCollections = require('../config/mongoCollections');
const bills = mongoCollections.bills;
const users = require('./users');
const uuid = require('uuid/v4');

const exportedMethods = {

    async addNewBill(billInfo) {
        const billCollection = await bills();
        if (!billInfo) {
            throw `cannot receive any data`;
            return;
        }
        if (!billInfo.date || typeof billInfo.date !== 'string') {
            throw `You must provide a bill date and it must be a string`;
            return;
        }
        // if (!billInfo.userId || typeof billInfo.userId !== 'string') {
        //   throw `You must provide a userId and it must be a string`;
        //   return;
        // }
        if (typeof billInfo.food !== 'number') {
            throw `type of food  must be a number`;
            return;
        }
        if (typeof billInfo.entertainment !== 'number') {
            throw `type of entertainment  must be a number`;
            return;
        }
        if (typeof billInfo.transportation !== 'number') {
            throw `type of transportation  must be a number`;
            return;
        }
        if (typeof billInfo.other !== 'number') {
            throw `type of other  must be a number `;
            return;
        }
        if (typeof billInfo.notes !== 'string') {
            throw `type of notes  must be a string`;
            return;
        }
        const newBill = await billCollection.insertOne({

            userId: billInfo.userId,
            date: billInfo.date,
            dateTs: new Date(billInfo.date).getTime(),
            createTime: new Date().getTime(),
            food: billInfo.food,
            entertainment: billInfo.entertainment,
            transportation: billInfo.transportation,
            other: billInfo.other,
            total: billInfo.food + billInfo.entertainment + billInfo.other + billInfo.transportation,
            notes: billInfo.notes
        });

        return newBill;
    },

    async getBill(params) {
        const billCollection = await bills();
        let chartBillData;
        if (!params) {
            throw `cannot receive any data`;
            return;
        }
        if (!params.userId) {
            console.log('case 0')
            throw 'userId is required'
        } else if (!params.dateTs && !params.date) {

            console.log('case 1');
            chartBillData = await billCollection.find().toArray();
        } else if (params.dateTs) {
            console.log('case 2')
            const ts = params.dateTs;
            const query = { dateTs: { $gte: ts * 1 } };
            chartBillData = await billCollection.find(query).toArray();
        } else if (params.date) {
            chartBillData = await billCollection.findOne({ date: params.date });
        }
        return chartBillData
    },


    async deleteBill(date, dateTs) {
        const billCollection = await bills();
        const deleteInfo = await billCollection.deleteOne({ date: date });
    },

    async getBillday() {
        //这里需要写方法，获取近三天账单数据
    },
    async getBillmonth() {
        //这里需要写方法，获取近一个月账单数据
    },


    async getBillyear() {
        //这里需要写方法，获取近一年账单数据
    },
};

module.exports = exportedMethods;