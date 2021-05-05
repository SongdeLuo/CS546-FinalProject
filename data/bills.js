const mongoCollections = require('../config/mongoCollections');
const bills = mongoCollections.bills;
const users = require('./users');
const uuid = require('uuid/v1');

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
            chartBillData = await billCollection.find({userId:params.userId}).toArray();
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
        //获取当前时间
        //计算范围
        let bill = this.getBill(id);
        //这里需要写方法，获取近三天账单数据
        //获取日期并判断
        for (let i = 0; i < bill.length(); i++) {
            //由于日期是2020-05-05这种格式，所以需要提取需要的字段
            bill[i].data;
            if (bill.data) {}
        }
        //将其存为数组，格式为['日期', 数据1, 数据2,数据3]，这样的四组数据，对应'Food', 'Entertainment', 'Transition', 'Other',再将这四组数据存入一个数组中
    },
    async getBillmonth() {
        //这里需要写方法，获取近一个月账单数据

    },


    async getBillyear() {
        //这里需要写方法，获取近一年账单数据

    },
};

module.exports = exportedMethods;