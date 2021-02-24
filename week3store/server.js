// JavaScript source code
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var Datastore = require('nedb');
const { timeStamp } = require('console');
var db = new Datastore({ filename: 'database.json', autoload: true });

var urlencodedBodyParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedBodyParser);

app.use(express.static('public'));

app.set('view engine', 'ejs');

var dataList = [];

app.get('/', function (req, res) {
    res.render('index.ejs',{});
});
app.get('/link', function (req, res) {
    db.find({_id:req.query._id},function(err,newDoc){
        var dataWrapper={data:newDoc[0]};
        console.log(newDoc[0]);
        res.render("linkTemplate.ejs",dataWrapper);
    })
});
app.get('/search', function (req, res) {
    var searchItem=req.query.search;
    console.log(searchItem);
    var query = new RegExp(searchItem,'i');
    db.find({"destination": query},function(err,docs){
        var dataWrapper={data:docs}
        res.render('outputTemplate.ejs',dataWrapper);
    })
    
});
app.post('/formdata', function (req, res) {
    var dataLength;
    db.find({},function(err,docs){
        dataLength=docs.length;
        console.log(dataLength);
    })
    var dataToSave = {
        destination: req.body.destination,
        currentlocation: req.body.currentlocation,
        distance : req.body.distance,
        longtext : req.body.longtext,
        timeStamp: Date.now()
    }

    db.insert(dataToSave, function(err, newDoc){
        db.find({}).sort({timeStamp:1}).exec(function(err,docs){
            var dataWrapper = {data:docs};
            res.render("outputTemplate.ejs",dataWrapper);
        })
        
    });
    //dataList.push(dataToSave);
    //console.log(dataList);
    //var dataWrapper = {data: dataList};
    //var htmlPage = "<html><body>";
    //htmlPage+="<h1>Here are the travels</h1>"
    //for (var i = 0; i < dataList.length; i++) {
    //    var number = i + 1;
    //    htmlPage += "<h2>trip "+number+"</h2>"
    //    htmlPage += "<div style='font-size:24'> " + dataList[i].destination;
    //    for (var j = 0; j < dataList[i].distance; j++) {
    //        htmlPage += "-";
    //    }
    //    htmlPage+=dataList[i].currentlocation + "</div>" ;
    //}
    //htmlPage += "</body></html>";
    //res.render("outputTemplate.ejs",dataWrapper);
});

app.listen(100, function () {
    console.log('This website is in Port 100');
});

