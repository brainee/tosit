var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db;

// 连接到数据库
var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('foo', server);

// 查询Get
db.open(function(err, db) {
    if(!err) {
        console.log("We are connected");
        db.collection('bar', function(err, collection){
            collection.find().toArray(function (error, bars) {
                console.log(bars);
            });
            collection.find({a: 1}).toArray(function (error, bars) {
                console.log(bars);
            });
            collection.findOne({a: 1}, function (error, bar) {
                console.log(bar)
            });

            // Cursors don't run their queries until you actually attempt to retrieve data
            // from them.

            // Find returns a Cursor, which is Enumerable. You can iterate:
            collection.find(function(err, cursor) {
                cursor.each(function(err, item) {
                    if(item != null) console.dir(item);
                });
            });

            // You can turn it into an array
            collection.find(function(err, cursor) {
                cursor.toArray(function(err, items) {
                    console.log("count: " + items.length);
                });
            });
        });
    }
});

// 插入Insert
db.open(function(err, db) {
    if(!err) {
        db.collection('bar', function(err, collection) {
            var doc1 = {a: 1};
            var doc2 = {a: 2, b: 'b2'};
            var docs = [{a:3}, {a:4}];

            collection.insert(doc1);
            collection.insert(doc2, {safe:true}, function(err, result) {});
            collection.insert(docs, {safe:true}, function(err, result) {});
        });
    }
});
