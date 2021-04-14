POST    api/user/signUp
    { 
        "userName": "Kai Li",
        "passWord": "123456",
        "phone": 13637064092,
        "mail": "likaistevens@gmail.com"
    }

POST    api/user/login
    { 
        "userName": "Kai Li",
        "passWord": "123456",
    }




POST    api/bills/newBill
    {   
        "userId": "e40add9d-38f1-45fd-aabe-5c315bdaa1be"
        "createTime": "1633046400000",
        "date": "2020-10-01",
        "food": 10,
        "entertainment": 20,
        "other": 30,
        "total": 60,
        "notes":"Today is my girlfriend’s birthday"
    }

DELETE  api/bills/delete?date=2020-01-2&dateTs=10000
// lsd
//ztz