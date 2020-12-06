const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose')
// const cookieSession = require('cookie-session')



app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine','ejs')
app.use(express.static('public'));
mongoose.connect('mongodb://localhost:27017/bbankDB',
	{useNewUrlParser:true,useUnifiedTopology:true})

// Hospital model & schema

const hospitalSchema = new mongoose.Schema({
	name:String,
	// id will serve as password, since unique to every hospital
	id:String,
	address:String,
	city:String,
	state:String,
	phno:Number,
	avail:{
		Apos:Number,
		Aneg:Number,
		Bpos:Number,
		Bneg:Number,
		Opos:Number,
		Oneg:Number,
		ABpos:Number,
		ABneg:Number
	}
})

const Hospital = mongoose.model('Hospital',hospitalSchema)

// User model & schema

const userSchema = new mongoose.Schema({
	name:String,
	pwd:String,
	bgrp:String,
	address:String,
	city:String,
	state:String,
	phno:Number,
	gndr:String,
	requested:{
		bgreq:String,
		units:Number
	}

})

const User = mongoose.model('User',userSchema)

// Requests model and schema

const reqSchema = new mongoose.Schema({
	name:String,
	userId:String,
	bgrp:String,
	address:String,
	city:String,
	state:String,
	phno:Number,
	requested:{
		bgreq:String,
		units:Number
	}

})

const Request = mongoose.model('Request',reqSchema)

let isAuthorizedHospital = false;
let isAuthorizedRequestee = false;
let uid;
app.route('/')
	.get(function(req,res){
		res.render('homepage')
	})

app.route('/signup/hospital')
	.get(function(req,res){
		res.render('signupHospital')
	})
	.post(function(req,res){

		Hospital.find({id:req.body.id},(err,result) =>{
			if(err){
				console.log(err)
			}else{
				if(result[0] == undefined){
					let newHospital = new Hospital({
						name:req.body.name,
						id:req.body.id,
						address:req.body.address,
						city:req.body.city,
						state:req.body.state,
						phno:req.body.phno,
						avail:{
							Apos:0,
							Aneg:0,
							Bpos:0,
							Bneg:0,
							Opos:0,
							Oneg:0,
							ABpos:0,
							ABneg:0
						}
					})

					uid = newHospital._id;
					newHospital.save();
					isAuthorizedHospital = true;
					isAuthorizedRequestee = false;
					uname = req.body.name;
					res.redirect(`/${req.body.name}/Home`)
				}
				else{
					res.send('Already registered, try to login');
				}
			}
		})

		
	})

app.route('/signup/requestee')
	.get(function(req,res){
		res.render('signupRequestee')
	})
	.post(function(req,res){
		let username = req.body.name;
		let pwd = req.body.pwd;
		
		User.find({name:username,pwd:pwd},(err,result) =>{
			if(err){
				console.log(err)
			}
			else{
				if(result[0] == undefined){
					let newUser = new User({
						name:req.body.name,
						pwd:req.body.pwd,
						bgrp:req.body.bgrp,
						address:req.body.address,
						city:req.body.city,
						state:req.body.state,
						phno:req.body.phno,
						gndr:req.body.gndr,
						requested:{
							bgreq:'null',
							units:0
						}
					})

					uid = newUser._id;
					newUser.save();
					isAuthorizedRequestee = true;
					isAuthorizedHospital = false;
					uid = req.body.pwd;
					res.redirect(`/${req.body.name}/Home`)
				}
			}
		})

	})

let username;
app.route('/login')
	.get(function(req,res){
		// res.render('login')
		res.render('login')
	})
	.post(function(req,res){
		let username = req.body.name;
		let pwd = req.body.pwd;

		Hospital.find({name:username,id:pwd},(err,hospital)=>{
			if(err){
				console.log(err);
			}
			else{
				if(hospital[0] == undefined){
					User.find({name:username,pwd:pwd},(err,user)=>{
						if(err){
							console.log(err)
						}
						else{
							if(user[0] == undefined){
								console.log('Sorry no such Hospital or User Exists');
								res.redirect('/');
							}
							else{
								uid = user[0]._id ;
								isAuthorizedRequestee = true;
								isAuthorizedHospital = false;
								res.redirect(`/${user[0].name}/home`)
							}
						}
					})
				}else{
					uid = hospital[0]._id ;
					isAuthorizedHospital = true;
					isAuthorizedRequestee = false;
					res.redirect(`/${hospital[0].name}/home`)
				}
			}
		})

	})


app.route('/:visitor/home')
	.get(function(req,res){
		username = req.params.visitor;
		if(isAuthorizedHospital == true){
			// An authorized Hospital
			// use uid to identify the document.
			// res.send('Welcoming Hospital -'+' '+req.params.visitor)

			Hospital.findById(uid,(err,hospital) =>{
				res.render('hospitalDashboard',{result:hospital})
			})
		}
		if(isAuthorizedRequestee == true){	
			// An authorized Individual
			// use uid to identify the document.
			// res.send('Welcoming Individual -'+' '+req.params.visitor)

			// let	user = req.params.visitor;
			User.findById(uid,(err,user) =>{
				res.render('userDashboard',{result:user})
			})

		}
		if(isAuthorizedRequestee == false && isAuthorizedHospital == false){
			console.log("Sorry couldn't recognize you!!")
			res.redirect('/login')
		}
		// res.send('this is -'+req.params.visitor+'s page')
	})
	.post(function(req,res){
		// update user request
		// update gloabl requests	
		
		if(isAuthorizedRequestee == true){

			User.findById(uid,(err,user)=>{
						user.requested.bgreq = req.body.bgreq ;
						user.requested.units = req.body.units ;
						isAuthorizedRequestee = true;
						isAuthorizedHospital = false;
						user.save();
		
						let newRequest = new Request({
							name:user.name,
							userId:uid,
							bgrp:user.bgrp,
							address:user.address,
							city:user.city,
							state:user.state,
							phno:user.phno,
							requested:{
								bgreq:user.requested.bgreq,
								units:user.requested.units
							}
		
						})
						newRequest.save();
		
					res.redirect(`/${user.name}/home`)
				})
		}
		if(isAuthorizedHospital == true){

		}

	})

app.route('/logout')
	.get((req,res) =>{
		isAuthorizedHospital = false;
		isAuthorizedRequestee = false;
		res.redirect('/')
	})
	.post((req,res) =>{

	})

app.route('/hospital/:hospital')
	.get((req,res)=>{
		let hospital = req.params.hospital;
		// Hospital.findById(uid,(err,hospital) =>{
			res.render('hospitalDashboard',{result:hospital})
		// })
	})
	.post((req,res) =>{

	})


app.listen('8000',(req,res) =>{
	console.log('server online on port 8000')
})




