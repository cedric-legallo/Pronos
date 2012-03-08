var CONST = require("./CONST");

var pronos = {};
pronos.db={};

//mongoose
var mongoose = require("mongoose"), mongooseTypes = require("mongoose-types"), mongooseAuth = require('mongoose-auth'), mongooseAuthConf = require('./mongooseAuthConf.js');

pronos.db.UserSchema = new mongoose.Schema({
   nation: {type : String, enum : CONST.Nations}
});
pronos.db.UserSchema.plugin(mongooseAuth, {
	// Here, we attach your User model to every module
        everymodule: {
          everyauth: {
              User: function () {
                return User;
              }
          }
        },
	facebook: {
          everyauth: {
              myHostname: 'http://localhost:3000'
            , appId: mongooseAuthConf.fb.appId
            , appSecret: mongooseAuthConf.fb.appSecret
            , redirectPath: '/'
          }
        },
	twitter: {
          everyauth: {
              myHostname: 'http://localhost:3000'
            , consumerKey: mongooseAuthConf.twit.consumerKey
            , consumerSecret: mongooseAuthConf.twit.consumerSecret
            , redirectPath: '/'
          }
	},
	google: {
	    everyauth: {
		myHostname: 'http://localhost:3000'
		, appId: mongooseAuthConf.google.clientId
		, appSecret: mongooseAuthConf.google.clientSecret
		, redirectPath: '/'
		, scope: 'https://www.google.com/m8/feeds'
	    }
	},
	password: {
            loginWith: 'email', 
	    extraParams: {
		name: {
                    first: String,
		    last: String
		}
            },
	    everyauth: {
		getLoginPath: '/login',
		postLoginPath: '/login',
		loginView: 'login.jade',
		getRegisterPath: '/register',
		postRegisterPath: '/register',
		registerView: 'register.jade',
		loginSuccessRedirect: '/',
		registerSuccessRedirect: '/'
            }
    }
});
//pronos.db.Pronos = new mongoose.Schema

// Adds login: String
mongoose.connect('mongodb://localhost/pronos');
mongooseTypes.loadTypes(mongoose);

var User = mongoose.model("User", pronos.db.UserSchema);

var express = require('express'), jade = require('jade');

var app = express.createServer(
    express.bodyParser()
  , express.static(__dirname + "/public")
  , express.cookieParser()
  , express.session({ secret: 'esoognom'})
  , mongooseAuth.middleware()
);

app.configure( function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
});

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/toto', function(req, res){
	res.send({hello : 'hello world'});
});

mongooseAuth.helpExpress(app);

app.listen(15436);
