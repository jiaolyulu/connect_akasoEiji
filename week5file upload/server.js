// JavaScript source code
var express = require('express');
var fs = require("fs");
var app = express();
var bodyParser = require("body-parser");
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' })
var Datastore = require('nedb');
const { timeStamp } = require('console');
var db = new Datastore({ filename: 'database.json', autoload: true });

var urlencodedBodyParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedBodyParser);

app.use(express.static('public'));

app.set('view engine', 'ejs');

var dataList = [];

app.get('/', function (req, res) {
    res.send('Hello World');
});
app.get('/displayRecord', function (req, res) {
	db.find({_id:req.query._id},function(err,newDoc){
        var dataWrapper={data:newDoc[0]};
        console.log(newDoc[0]);
        res.render("linkTemplate.ejs",dataWrapper);
    })
});
app.post('/formdata', upload.single('photo'), function (req, res) {
    
	
	console.log(req.file);
	if (req.file.mimetype=="image/jpeg"||req.file.mimetype=="image/png"){
		var dataToSave = {
			destination: req.body.destination,
			currentlocation: req.body.currentlocation,
			distance : req.body.distance,
			photo: req.file
		}
		dataList.push(dataToSave);
		console.log(dataList);
		var dataWrapper = {data: dataList};
		db.insert(dataToSave, function(err, newDoc){
			db.find({}).sort({timeStamp:1}).exec(function(err,docs){
				var dataWrapper = {data:docs};
				res.render("outputTemplate.ejs",dataWrapper);
			})
			
		});
	}
	else{
		fs.unlink(req.file.path, function(err){
			if (err) {
				throw err;
				console.log(err);
			}
		});
		res.send("NOT an Image");
	}
});


app.listen(100, function () {
    console.log('This website is in Port 100');
});

