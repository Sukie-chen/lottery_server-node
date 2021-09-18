<!--
 * @Author: Sukie-Chen
 * @Description:幸运抽奖服务器接口--node
 * @Date: 2021-09-18 16:19:38
-->
### 功能
- [x] get/post请求
- [x] 服务端抽奖返回前台 id
- [x] 连接MongoDB数据库，find update
- [x] 封装Dao层（未使用，需完善）
  
### 攻克点
1. 封装MongoDB
```JavaScript
function MongoDB (MongoClient, url, dbName, collectionName) {
    this.MongoClient = MongoClient
    this.url = url
    this.db = dbName
    this.collection = collectionName
}
// 连接数据库
MongoDB.prototype.goConnect = function (url, callback) {
    if (!url) {
        return
    }
    this.MongoClient.connect(url, (err, db) => {
        //promise处理异步 （有问题）
        new Promise((resolve)=>{
             return callback(err, db)
        }).then(()=>{
            db.close().then(res => console.log(res))
        })
    })
}
// 查找数据
MongoDB.prototype.find = function (whereStr, callback){
    const dbName = this.db
    const collectionName = this.collection
    this.goConnect(this.url, (err, db_name) => {
        if (err) throw err
        const client = db_name.db(dbName)
        return client.collection(collectionName).find(whereStr).toArray((err, res) => {
            if (err) throw err
            console.log(res)
            if(callback){
                callback(err, res)
            }
        })
    })
}
// 更新数据
MongoDB.prototype.update = function (filter, updateDoc) {
    const dbName = this.db
    const collectionName = this.collection
    this.goConnect(this.url, (err, db_name) => {
        if (err) throw err
        const client = db_name.db(dbName)
        client.collection(collectionName).update(filter, updateDoc)
    })
}

module.exports = MongoDB
```
2. 连接数据库版本2
```JavaScript
//封装的Dao 报错： MongoExpiredSessionError: Cannot use a session that has ended
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'award'
const collection = 'awardList'
const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

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
```
3. 服务端处理跨域
  ```JavaScript
  app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST'],
  allowHeaders: ['Content-type', 'Authorization']
}))
  ```
4. 解析客户端发送的post数据
```JavaScript
// app.use(bodyParser.urlencoded([{extended: false}]))  报错body-parser deprecated undefined extended: provide extended option
app.use(bodyParser.json())
```
