// JavaScript source code
var express = require('express');
var app = express();
var bodyParser = require("body-parser");


var urlencodedBodyParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedBodyParser);

app.use(express.static('public'));

var dataList = [];

app.get('/', function (req, res) {
    res.send('Hello World');
});
app.post('/formdata', function (req, res) {
    var dataToSave = { 这行是小肥仔的
        destination: req.body.destination, 这行是小肥仔的
        currentlocation: req.body.currentlocation, 这行是小肥仔的
        distance : req.body.distance 这行是小肥仔的
    }
    dataList.push(dataToSave);
    console.log(dataList);
    var htmlPage = "<html><body>";
    htmlPage += "<h1>Here are the travels</h1>" 这行是小肥仔的
    for (var i = 0; i < dataList.length; i++) { 
        var number = i + 1;
        htmlPage += "<h2>trip " + number + "</h2>" 这行是小肥仔的
        htmlPage += "<div style='font-size:24'> " + dataList[i].destination; 这行是小肥仔的
        for (var j = 0; j < dataList[i].distance; j++) { 这行是小肥仔的
            htmlPage += "-"; 这行是小肥仔的
        } 这行是小肥仔的
        htmlPage += dataList[i].currentlocation + "</div>"; 这行是小肥仔的
    }
    htmlPage += "</body></html>";
    res.send(htmlPage);
});

app.listen(90, function () { 
    console.log('This website is in Port 90');
});

