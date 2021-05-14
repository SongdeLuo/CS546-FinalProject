const mongoCollections = require("../config/mongoCollections");
const bills = mongoCollections.bills;
const todoList = mongoCollections.todoList;
const users = require("./users");
const uuid = require("uuid/v1");
const { ObjectId } = require('mongodb');


const exportedMethods = {
    async addNewBill(billInfo) {
        const billCollection = await bills();
        if (!billInfo) {
            throw `cannot receive any data`;
            return;
        }
        if (!billInfo.date || typeof billInfo.date !== "string") {
            throw `You must provide a bill date and it must be a string`;
            return;
        }
        if (typeof billInfo.food !== "number") {
            throw `type of food  must be a number`;
            return;
        }
        if (typeof billInfo.entertainment !== "number") {
            throw `type of entertainment  must be a number`;

            return;
        }
        if (typeof billInfo.transportation !== "number") {
            throw `type of transportation  must be a number`;
            return;
        }
        if (typeof billInfo.other !== "number") {
            throw `type of other  must be a number `;
            return;
        }
        if (typeof billInfo.notes !== "string") {
            throw `type of notes  must be a string`;
            return;
        }

        if (billInfo.notes.length > 50) {
            throw `type of notes  must be less 50 letter`;
            return;
        }

        if (billInfo.other < 0 || billInfo.transportation < 0 || billInfo.entertainment < 0 || billInfo.food < 0) {
            throw "must more than 0 ";
            return;
        }

        if (billInfo.other > 100000 || billInfo.transportation > 100000 || billInfo.entertainment > 100000 || billInfo.food > 100000) {
            throw "must less than 100000 ";
            return;
        }
        // 添加之前查一下库，如果日期有了就不添加
        const hasDate = await billCollection.findOne({ date: billInfo.date, userId: billInfo.userId });
        if (hasDate) {
            return
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
            total: billInfo.food +
                billInfo.entertainment +
                billInfo.other +
                billInfo.transportation,
            notes: billInfo.notes,
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
            console.log("case 0");
            throw "userId is required";
        } else if (!params.dateTs && !params.date) {
            console.log("case 1");
            chartBillData = await billCollection.find({ userId: params.userId }).sort({ dateTs: 1 }).toArray();
        } else if (params.dateTs) {
            console.log("case 2");
            const ts = params.dateTs;
            const query = {
                dateTs: { $gte: ts * 1 },
                userId: params.userId
            };
            chartBillData = await billCollection.find(query).sort({ dateTs: 1 }).toArray();
        } else if (params.date) {
            chartBillData = await billCollection.findOne({ date: params.date, userId: params.userId });
        }
        return chartBillData;
    },
    async deleteBill(id) {
        const billCollection = await bills();
        return await billCollection.deleteOne({ _id: ObjectId(id) })
    },


    async formatDate(val) {
        // 格式化时间
        let start = new Date(val)
        let y = start.getFullYear()
        let m = (start.getMonth() + 1) > 10 ? (start.getMonth() + 1) : '0' + (start.getMonth() + 1)
        let d = start.getDate() > 10 ? start.getDate() : '0' + start.getDate()
        return y + '-' + m + '-' + d
    },


    async mistiming(sDate1, sDate2) {
        // 计算开始和结束的时间差
        let aDate, oDate1, oDate2, iDays
        aDate = sDate1.split('-')
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
        aDate = sDate2.split('-')
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)
        return iDays + 1
    },


    async countDate(start, end) {
        // 判断开始和结束之间的时间差是否在90天内
        let days = mistiming(start, end)
        let stateT = days > 90 ? Boolean(0) : Boolean(1)
        return {
            state: stateT,
            day: days
        }
    },

    async timeForMat(count) {
        // 拼接时间
        let time1 = new Date()
        time1.setTime(time1.getTime() - (24 * 60 * 60 * 1000))
        let Y1 = time1.getFullYear()
        let M1 = ((time1.getMonth() + 1) > 10 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
        let D1 = (time1.getDate() > 10 ? time1.getDate() : '0' + time1.getDate())
        let timer1 = Y1 + '-' + M1 + '-' + D1 // 当前时间
        let time2 = new Date()
        time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * count))
        let Y2 = time2.getFullYear()
        let M2 = ((time2.getMonth() + 1) > 10 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
        let D2 = (time2.getDate() > 10 ? time2.getDate() : '0' + time2.getDate())
        let timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的7天或者30天
        return {
            t1: timer1,
            t2: timer2
        }
    },

    async yesterday(start, end) {
        // 校验是不是选择的昨天
        let timer = timeForMat(1)
        return timer
    },

    async getBillday() {
        // 获取最近1天
        let timer = timeForMat(1);
        let bill = this.getBill(id);
        return timer
    },

    async getBillmonth() {
        // 获取最近30天
        let timer = timeForMat(30)
        return timer
    },

    async getBillyear() {
        //获取最近一年
        let timer = timeForMat(365)
        return timer
    },

    async getAllBill(userId) {
        const billCollection = await bills();
        return await billCollection.find({ userId: userId }).toArray();
    },
    async newTodoList(todoListInfo) {
        const todoListCollection = await todoList();
        return await todoListCollection.insertOne({
            userId: todoListInfo.userId,
            date: todoListInfo.date,
            content: todoListInfo.content
        });
    },
    async getTodoList(userId) {
        const todoListCollection = await todoList();
        return await todoListCollection.find({ userId: userId }).toArray();
    },
    async deleteTodoList(id) {
        console.log('************data delet')
        console.log(id)
        console.log('************data delet')

        const todoListCollection = await todoList();
        const deleteRes = await todoListCollection.deleteOne({ _id: ObjectId(id) })
        console.log(deleteRes)
        return deleteRes
    }
};
module.exports = exportedMethods;