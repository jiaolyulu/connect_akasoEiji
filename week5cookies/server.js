var express = require('express');
var app = express();
var session = require('express-session');

// Session store
var nedbstore = require('nedb-session-store')(session);

// User database
var Datastore = require('nedb');
var db = new Datastore({ filename: 'users.db', autoload: true });

// npm install bcrypt-nodejs
var bcrypt = require('bcrypt-nodejs');

// https://github.com/kelektiv/node-uuid
// npm install node-uuid
const uuidV1 = require('uuid');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true }); // for parsing form data
app.use(urlencodedParser);

app.use(
	session(
		{
			secret: 'secret',
			cookie: {
				 maxAge: 365 * 24 * 60 * 60 * 1000   // e.g. 1 year
				},
			store: new nedbstore({
			filename: 'sessions.db'
			})
		}
	)
);

function generateHash(password) {
	return bcrypt.hashSync(password);
}

function compareHash(password, hash) {
    return bcrypt.compareSync(password, hash);
}


// Main page
app.get('/', function(req, res) {
	console.log(req.session.username);

	if (!req.session.username) {
		res.render('login.ejs', {}); 
	} else {
		// Give them the main page
  		//res.send('session user-id: ' + req.session.userid + '. ');
		res.render('main.ejs', req.session);
	}
});

app.get('/registration', function(req, res) {
	res.render('registration.ejs', {});
});

app.post('/register', function(req, res) {
	var passwordHash = generateHash(req.body.password);
	var registration = {
		"username": req.body.username,
		"password": passwordHash
	};

	db.insert(registration);
	console.log("inserted " + registration);
	res.send("Registered <a href=\"/\">Sign In</a>" );
	
});

app.get('/logout', function(req, res) {
	delete req.session.username;
	res.redirect('/');
});

// Post from login page
app.post('/login', function(req, res) {

	// Check username and password in database
	db.findOne({"username": req.body.username},
		function(err, doc) {
			if (doc != null) {
				
				// Found user, check password				
				if (compareHash(req.body.password, doc.password)) {				
					// Set the session variable
					req.session.username = doc.username;

					// Put some other data in there
					req.session.lastlogin = Date.now();

					res.redirect('/');
					
				} else {

					res.send("Invalid <a href=\"/\">Try again</a>");

				}
			} 
		}
	);
	

});

app.listen(8080);
