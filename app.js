const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const app = express();
const ejs = require('ejs');



app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine','ejs')
app.use(express.static('public'));
mongoose.connect('mongodb://localhost:27017/bbankDB',{useNewUrlParser:true,useUnifiedTopology:true})


app.route('/')
	.get(function(req,res){

	})
	.post(function(req,res){

	})

app.route('/signup/hospital')
	.get(function(req,res){

	})
	.post(function(req,res){

	})

app.route('/signup/individual')
	.get(function(req,res){

	})
	.post(function(req,res){

	})

let username;
app.route('/login')
	.get(function(req,res){

	})
	.post(function(req,res){

	})

// during login use username as dynamic routing, that would be better.

app.route(`/:${username}/home`)
	.get(function(req,res){

	})
	.post(function(req,res){
		
	})




