// JavaScript source code
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var jsonBodyParser = bodyParser.json({limit: "2000kb"});
app.use(jsonBodyParser);
var Datastore = require('nedb');
const Jimp = require("jimp");
const { timeStamp } = require('console');
var db = new Datastore({ filename: 'database.json', autoload: true });
var https = require('https');
var fs = require('fs');
var emailjs = require('./node_modules/emailjs');
var multer  = require('multer');
const { Message } = require('emailjs/smtp/message');
var upload = multer({ dest: 'public/uploads/' })

var client = emailjs.server.connect({
	user: 'jiaolvlu@gmail.com',
	password: fs.readFileSync('gmail.key'),
	host: 'smtp.gmail.com',
	tls: {
		ciphers: 'SSLv3',
	},
});

// send the message and get a callback with an error or details of the message that was sent
// client.send(
// 	{
// 		text: 'i hope this works',
// 		from: 'you <jiaolvlu@gmail.com>',
// 		to: 'someone <786930223@qq.com>',
// 		subject: 'testing emailjs',
// 	},
// 	(err, message) => {
// 		console.log(err || message);
// 	}
// );

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
    var dataToSave = {
        locLat: req.query.locLat,
        locLng: req.query.locLng,
        desLat: req.query.desLat,
        desLng: req.query.desLng,
        locName: req.query.locName,
        desName: req.query.desName,
        message: req.query.message,
        email: req.query.email,
        timeStamp: Date.now()
    }
    db.insert(dataToSave, function(err, newDoc){
        db.find({}).sort({timeStamp:1}).exec(function(err,docs){
            res.send(docs);
            
        })
        
    });
});
app.get('/sendEmail',function(req,res){
    console.log(req.query);
    const message = new Message({
		text: "Your trip ticket is ready",
		from: 'you <jiaolvlu@gmail.com>',
		to: 'someone <'+req.query.emailAddress+'>',
		subject: "Find your tickets in the attatchment",
        attachment: [
            { path: 'public/images/'+req.query.nameString+'.jpg', type: 'image/jpg', name: 'mypicture.jpg' },

        ],
	});
	
    client.send(message, (err, message) => {
        console.log(err || message);
    });
})

app.post('/getPicture', function (req, res) {

    var data = req.body.picture;
    //console.log(data);
    var searchFor = "data:image/png;base64,";
    var strippedImage = data.slice(data.indexOf(searchFor) + searchFor.length);
    var binaryImage = new Buffer(strippedImage, 'base64');
    fs.writeFileSync(__dirname + '/public/images/' + req.body.name+ '.jpg', binaryImage);
    var response={response: "Thanks"};
    res.send(response);
    
    
});

app.get('/ticket', function (req, res) {
    db.find({}).sort({timeStamp:1}).exec(function(err,docs){
        console.log(docs);
        var dataWrapper= {data:docs};
        res.render("ticket.ejs",dataWrapper);
    })
    
});
app.get('/start', function (req, res) {
    console.log("start!!!");
    res.render("start.html");
    
});


var httpsServer = https.createServer(credentials, app);

httpsServer.listen(443);
// app.listen(443, function () {
//     console.log('This website is in Port 443');
// });

