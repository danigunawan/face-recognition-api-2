const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : '',
    password : '',
    database : 'face-recognition'
  }
});


const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res)=>{
	res.send(database.users);
})

app.get('/profile/:id', (req, res) => {
	const {id} = req.params;
	db.select('*').from('users')
	.where({id})
	.then(user =>{
		if (user.length) {
			res.json(user[0]);
		}else{
			res.status(400).json('not found');
		}
	})
	.catch(err => res.status(400).json('error getting users'));
})

app.post('/signin', (req, res) => {signin.handleSignIn(req, res, db, bcrypt)})
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

app.put('/image', (req, res)=>{
	const {id} = req.body;
	db('users').where('id', '=', id)
	.increment('entries',1)
	.returning('entries')
	.then(entries =>{
		res.json(entries[0]); 
	})
	.catch(err => res.status(400).json('unable to get entries'));
})


app.listen(3000, ()=>{
	console.log('app is running on port 3000');
})

/*
/--> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/