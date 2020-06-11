var express 	      = require("express"),
    app 		      = express(),
    bodyParser 	      = require("body-parser"),
    mongoose 	      = require("mongoose"),
	passport          = require("passport"),
	LocalStrategy     = require("passport-local"),
	Campground        = require("./models/campground"),
	Comment           = require("./models/comment"),
	User              = require("./models/user"),
	flash             = require("connect-flash"),
	methodOverride    = require("method-override"),
	seedDB            = require("./seeds");

var	commentRoutes 	  = require("./routes/comments"),
	campgroundRoutes  = require("./routes/campgrounds"),
	indexRoutes       = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();

app.locals.moment = require('moment');

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "This is secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error       = req.flash("error");
	res.locals.success     = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(4000, function(){
	console.log("Yelp Camp's server has started");
});