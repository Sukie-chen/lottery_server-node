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
        //promise处理异步
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