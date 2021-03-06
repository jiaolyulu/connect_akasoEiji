// JavaScript source code
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var Datastore = require('nedb');
const { timeStamp } = require('console');
var db = new Datastore({ filename: 'database.json', autoload: true });
var https = require('https');
var fs = require('fs');

var credentials = {
    key: fs.readFileSync('star_itp_io.key'),
    cert: fs.readFileSync('star_itp_io.pem')
  };

var urlencodedBodyParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedBodyParser);

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));

var dataList = [];

app.get('/', function (req, res) {
    res.send("helloworld");
});


app.get('/data', function (req, res) {
    console.log(req.body);
    

    var dataToSave = {
        locLat: req.query.locLat,
        locLng: req.query.locLng,
        desLat: req.query.desLat,
        desLng: req.query.desLng,
        locName: req.query.locName,
        desName: req.query.desName,
        message: req.query.message,
        timeStamp: Date.now()
    }
    db.insert(dataToSave, function(err, newDoc){
        db.find({}).sort({timeStamp:1}).exec(function(err,docs){
            res.send(docs);
            
        })
        
    });
    

    
    
});
app.get('/ticket', function (req, res) {
    db.find({}).sort({timeStamp:1}).exec(function(err,docs){
        console.log(docs);
        var dataWrapper= {data:docs};
        res.render("ticket.ejs",dataWrapper);
    })
    
});
var httpsServer = https.createServer(credentials, app);

app.listen(140, function () {
    console.log('This website is in Port 140');
});

