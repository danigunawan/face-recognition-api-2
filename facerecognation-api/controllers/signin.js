
const handleSignIn = (req, res, db, bcrypt)=>{
	db.select('email', 'hash').from('login')
		.where('email', '=', req.body.email)
		.then(data=>{
			// Load hash from your password DB.
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash); // true
			// console.log(isValid);
			if (isValid) {
				return db.select('*').from('users')
					.where('email', '=', req.body.email)
					.then(user =>{
						// console.log(user);
						res.json(user[0]);
					})
					.catch(err => res.status(400).json('unable to get user'))
			}else{
				res.status(400).json('wrong credentials');
			}
		})
		.catch(err => res.status(400).json('wrong credentials'));
}

module.exports = {
	handleSignIn: handleSignIn
}