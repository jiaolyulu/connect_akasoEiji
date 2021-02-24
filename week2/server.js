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
    var dataToSave = {
        destination: req.body.destination,
        currentlocation: req.body.currentlocation,
        distance : req.body.distance
    }
    dataList.push(dataToSave);
    console.log(dataList);
    var htmlPage = "<html><body>";
    htmlPage+="<h1>Here are the travels</h1>"
    for (var i = 0; i < dataList.length; i++) {
        var number = i + 1;
        htmlPage += "<h2>trip "+number+"</h2>"
        htmlPage += "<div style='font-size:24'> " + dataList[i].destination;
        for (var j = 0; j < dataList[i].distance; j++) {
            htmlPage += "-";
        }
        htmlPage+=dataList[i].currentlocation + "</div>" ;
    }
    htmlPage += "</body></html>";
    res.send(htmlPage);
});

app.listen(90, function () {
    console.log('This website is in Port 90');
});

