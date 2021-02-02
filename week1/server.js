//Express is a node module for building HTTP servers
var express=require('express');
var app=express();

//Tell Express to look in the "public" director for any files, first!
app.use(express.static("public"));

// The default route of / and what to do!
app.get("/",function(req,res){
    res.send("<html><body><h1>Hello, Thank you for connecting!</h1></body></html>");
});

app.listen(80);