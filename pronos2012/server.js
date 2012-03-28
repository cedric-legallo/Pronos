var CONST = require("./CONST");

var pronos = {};
pronos.db={};

//mongoose
var mongoose = require("mongoose"), mongooseTypes = require("mongoose-types"), mongooseAuth = require('mongoose-auth'), mongooseAuthConf = require('./mongooseAuthConf.js');
var express = require('express');

pronos.db.UserSchema = new mongoose.Schema({
    nation: {type : String, enum : CONST.Nations, default:"France"}
    , capital: {type : Number, default:100}
});

//var appHostName="http://localhost:15436";
var appHostName="http://pronos2012.nodester.com";

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
              myHostname :appHostName
            , appId: mongooseAuthConf.fb.appId
            , appSecret: mongooseAuthConf.fb.appSecret
            , redirectPath: '/'
          }
        },
	twitter: {
          everyauth: {
              myHostname: appHostName
            , consumerKey: mongooseAuthConf.twit.consumerKey
            , consumerSecret: mongooseAuthConf.twit.consumerSecret
            , redirectPath: '/'
          }
	},
    github: {
	everyauth: {
            myHostname: appHostName
            , appId: mongooseAuthConf.github.appId
            , appSecret: mongooseAuthConf.github.appSecret
            , redirectPath: '/'
	}
    },
	google: {
	    everyauth: {
		myHostname: appHostName
		, appId: mongooseAuthConf.google.clientId
		, appSecret: mongooseAuthConf.google.clientSecret
		, redirectPath: '/'
		, scope: 'https://www.google.com/m8/feeds'
	    }
	},
	password: {
            loginWith: 'email', 
	    extraParams: {
		avatar: String,
		name: {
                    first: String,
		    last: String
		}
            },
	    everyauth: {
		getLoginPath: '/login',
		postLoginPath: '/login',
		registerView: 'test',
		getRegisterPath: '/register',
		postRegisterPath: '/register',
		registerView: 'test',
		loginSuccessRedirect: '/',
		registerSuccessRedirect: '/'
            }
    }
});
//pronos.db.Pronos = new mongoose.Schema

pronos.db.Matches = new mongoose.Schema({
    "teamA":String,
    "teamB":String,
    "group":String,
    "date":Date
});

pronos.db.Events = new mongoose.Schema({
    "username":String,
    "type":String,
    "data":String,
    "date":Date
});

pronos.db.Posts = new mongoose.Schema({
    "author":String,
    "message":String,
    "date":Date
});

pronos.db.Cotes = new mongoose.Schema({
    "matchid":String,
    "teamA":String,
    "teamB":String,
    "cote1":Number,
    "coteN":Number,
    "cote2":Number
});

pronos.db.Pronos = new mongoose.Schema({
    matchid : String
    , userid : String
    , mise1 : Number
    , mise2 : Number
    , miseN : Number
    , pronoCards : Number
    , miseCards : Number
    , score1 : Number
    , score2 : Number
    , miseMatch : Number
});

mongoose.connect('mongodb://cedobear:1234@ds031417.mongolab.com:31417/pronos');
mongooseTypes.loadTypes(mongoose);

var User = mongoose.model("User", pronos.db.UserSchema);
var Matches = mongoose.model("matches", pronos.db.Matches);
var Events = mongoose.model("events", pronos.db.Events);
var Posts = mongoose.model("posts", pronos.db.Posts);
var Cotes = mongoose.model("cotes", pronos.db.Cotes);
var Pronos = mongoose.model("pronos", pronos.db.Pronos);

var app = express.createServer(
    express.bodyParser()
  , express.static(__dirname + "/public")
  , express.cookieParser()
  , express.session({ secret: 'esoognom4321'})
  , mongooseAuth.middleware()
);

app.configure( function () {
  app.set('views', __dirname + '/views');
  app.set('view options', {layout: false});
  app.set('view engine', 'ejs');
});

app.get('/', function (req, res) {
  res.render('test.ejs');
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.post("/postMessage", function(req, res) {
    var message;
    var name = getUserName(req.user);
    var _d = new Date()+7200000;//serveur à heure solaire
    message = {author:name, message:req.body.message, date:_d};
    var post = new Posts(message);
    var event = new Events({username:name, type : 'comment', date : _d});
    post.save();
    event.save();
    res.send(message);
});

app.get('/events', function(req, res){
    Events.find({}).desc("date").limit(5).run(function (err, docs) {
	res.send(docs);
    });    
});

app.get('/cotes', function(req, res){
    Cotes.findOne({matchid : req.query.matchid}, function (err, cote) {
	if (cote === null) {res.send();return;}
	Pronos.findOne({userid : req.user.id, matchid : req.query.matchid}, function (err, prono) {
	    var ret = {
		"matchid":cote.matchid
		, "teamA":cote.teamA
		, "teamB":cote.teamB
		, "cote1":cote.cote1
		, "coteN":cote.coteN
		, "cote2":cote.cote2
		, "capital" : req.user.capital
	    };
	    if (prono) {
		ret.mise1 = prono.mise1
		ret.mise2 = prono.mise2
		ret.miseN = prono.miseN
		ret.pronoCards = prono.pronoCards
		ret.miseCards = prono.miseCards
		ret.score1 = prono.score1
		ret.score2 = prono.score2
		ret.miseMatch = prono.miseMatch
	    }
	    res.send(ret);
	});
    });    
});

app.post("/prono", function(req, res) {
    Matches.findOne({_id : req.body.matchid}, function (err, match) {
	var user = req.user, _d = new Date(), reqbody = req.body, mise1 = reqbody.mise1, mise2 = reqbody.mise2, miseN = reqbody.miseN, miseCards = reqbody.miseCards, miseMatch = reqbody.miseMatch;
	Pronos.findOne({userid : user.id, matchid : req.body.matchid}, function (err, prono) {
	    
	    if (prono === null){
		prono = new Pronos({
		    matchid : match._id
		    , match : match.teamA+"-"+match.teamB
		    , userid : req.user.id
		    , mise1 : mise1
		    , mise2 : mise2
		    , miseN : miseN
		    , pronoCards : reqbody.pronoCards
		    , miseCards : miseCards
		    , score1 : reqbody.score1
		    , score2 : reqbody.score2
		    , miseMatch : miseMatch
		});
		user.capital -= ((parseInt(mise1,10) || 0) + (parseInt(mise2,10) || 0) + (parseInt(miseN,10) || 0) + (parseInt(miseMatch,10) || 0) + (parseInt(miseCards,10) || 0));
	    }else {
		user.capital += ((parseInt(prono.mise1,10) || 0) + (parseInt(prono.mise2,10) || 0) + (parseInt(prono.miseN,10) || 0) + (parseInt(prono.miseMatch,10) || 0) + (parseInt(prono.miseCards,10) || 0));
		user.capital -= ((parseInt(mise1,10) || 0) + (parseInt(mise2,10) || 0) + (parseInt(miseN,10) || 0) + (parseInt(miseMatch,10) || 0) + (parseInt(miseCards,10) || 0));
		prono.mise1 = mise1;
		prono.mise2 = mise2;
		prono.miseN = miseN;
		prono.pronoCards = reqbody.pronoCards;
		prono.miseCards = miseCards;
		prono.score1 = reqbody.score1;
		prono.score2 = reqbody.score2;
		prono.miseMatch = miseMatch;
	    }
	    user.save();
	    prono.save();
	    var event = new Events({username:getUserName(user), type : 'prono', date : _d, datas : match.teamA+"-"+match.teamB});
	    event.save();
	    res.send();
	});

    });
});


app.get('/home', function(req, res){
    Posts.find({}).desc("date").limit(10).run(function (err, docs) {
	res.send(docs);
    });   
});


app.get('/matches', function(req,res) {
    Matches.find({}, function (err, docs) {
	res.send(docs);
    });
});

app.get('/users', function(req,res) {
    User.find({}, function (err, docs) {//sort alpha
	var _users = [];
	for(var i = docs.length-1; i >= 0; i--){
	    var user = docs[i];
	    var name = getUserName(user);
	    var avatar = getUserImage(user);
	    _users.push({username:name,avatar:avatar,capital:user.capital,team:user.nation});
	}
	res.send(_users);
    });
});

app.get('/usersByRanking', function(req,res) {
    User.find({}).asc("capital").run(function (err, docs) {
	var _users = [];
	for(var i = docs.length-1; i >= 0; i--){
	    var user = docs[i];
	    var name = getUserName(user);
	    var avatar = getUserImage(user);
	    _users.push({username:name,avatar:avatar,capital:user.capital,team:user.nation});
	}
	res.send(_users);
    });
});

app.get('/userPronos', function(req,res) {
    Pronos.find({userid : req.user.id}, function (err, docs) {
	res.send(docs);
    });
});

app.get('/profil', function(req, res){
    var user = req.user;
    var name = getUserName(user);
    var avatar = getUserImage(user);
    res.send({username:name,avatar:avatar,capital:user.capital,team:user.nation});
});

mongooseAuth.helpExpress(app);

app.listen(15436);


function getUserName(user){
    return user.twit.name || [user.name.first," ",user.name.last].join('');//github,google,fb
}

function getUserImage(user){
    return user.twit.profileImageUrl || user.avatar;
}