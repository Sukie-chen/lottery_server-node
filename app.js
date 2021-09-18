const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'award'
const collection = 'awardList'

const express = require('express')
const bodyParser = require('body-parser')
//创建服务器
const app = express()
const cors = require("cors");

//连接数据库
const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.listen(5000, ()=>{
    console.log('服务启动了')
})
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    allowHeaders: ['Content-type', 'Authorization']
}))
// app.use(bodyParser.urlencoded([{extended: false}]))  报错body-parser deprecated undefined extended: provide extended option
app.use(bodyParser.json())

app.get('/list', (request, response)=> {
    async function findList() {
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const coll = db.collection(collection);
        const result = await coll.find({}).project({_id: 0, award_id: 1, award_name: 1}).toArray()
        response.send(result)
        return 'done';
    }

    findList()
        .then(console.log)
        .catch(console.error)
        .finally(() => client.close());

})

//奖品确定
app.get('/getAward', (request, response)=> {
    async function getAward (){
        await client.connect();
        const db = client.db(dbName);
        const coll = db.collection(collection);
        const randomNum = Math.random()
        if( randomNum <= 0.01 ) {
            const result = await coll.find({award_weight: 1}).project({award_id: 1}).toArray()
            response.send(result)
        } else if(randomNum <= 0.04) {
            const result = await coll.find({award_weight: 2}).project({award_id: 1}).toArray()
            response.send(result)
        } else if(randomNum <= 0.1) {
            const result = await coll.find({award_weight: 3}).project({award_id: 1}).toArray()
            response.send(result)
        } else if(randomNum <= 0.2) {
            const result = await coll.find({award_weight: 4}).project({award_id: 1}).toArray()
            response.send(result)
        } else if(randomNum <= 0.34) {
            const result = await coll.find({award_weight: 5}).project({award_id: 1}).toArray()
            response.send(result)
        } else if(randomNum <= 0.5) {
            const result = await coll.find({award_weight: 6}).project({award_id: 1}).toArray()
            response.send(result)
        } else if(randomNum <= 0.7) {
            const result = await coll.find({award_weight: 7}).project({award_id: 1}).toArray()
            response.send(result)
        } else if(randomNum < 1) {
            const result = await coll.find({award_weight: 8}).project({award_id: 1}).toArray()
            response.send(result)
        }
        return 'done';
    }
    getAward()
        .then(console.log)
        .catch(console.error)
        .finally(() => client.close());



})
app.get('/live', (request, response)=> {
    async function find() {
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const coll = db.collection(collection);
        const result = await coll.find({award_id: {$ne : 5}}).project({_id: 0, award_id: 1, award_weight: 1, award_name: 1}).toArray()
        response.send(result)
        return 'done';
    }

    find()
        .then(console.log)
        .catch(console.error)
        .finally(() => client.close());

})
app.post('/live',(request, response) => {
    const {upload} = request.body
    response.send('数据已经传送（服务器）')
    async function update() {
        try {
            await client.connect();
            console.log('Connected successfully to server');
            const db = client.db(dbName);
            const coll = db.collection(collection);
            // 循环遍历，不能使用 newList.map() await传不进去，因此update仍然是异步操作 报错 MongoExpiredSessionError: Cannot use a session that has ended
            for(let index = 0; index < upload.length; index++) {
                const item = upload[index]
                if(item['award_weight']) {
                    let prob = 0
                    switch (item['award_weight']){
                        case 1:
                            prob = 0.01
                            break
                        case 2:
                            prob = 0.04
                            break
                        case 3:
                            prob = 0.1
                            break
                        case 4:
                            prob = 0.2
                            break
                        case 5:
                            prob = 0.34
                            break
                        case 6:
                            prob = 0.5
                            break
                        case 7:
                            prob = 0.7
                            break
                        case 8:
                            prob = 1
                            break
                    }
                    await coll.updateOne({award_id: item['award_id']}, {$set:{ award_weight: item['award_weight'], award_prob: prob}})
                }
                if(item['award_name']) {
                    await coll.updateOne({award_id: item['award_id']}, {$set:{award_name: item['award_name']}})
                }
            }

        } finally {
            await client.close() // 同步 close 连接，不能像get里面的promise.finally()
        }

        return 'update done';
    }

    update()
        .then(console.log)
        .catch(console.error)
})
