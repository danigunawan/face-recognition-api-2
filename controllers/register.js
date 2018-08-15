
const handleRegister = (req, res, db, bcrypt) =>{
	const {email, password, name}= req.body;
	if (!email || !name || !password) {
		return res.status(400).json('incorrect form submission')
	}
	if (password.length < 6 || password.length > 12) {
		return res.status(400).json('password is too short or too long')
	}

	// Store hash in your password DB.
	const hash = bcrypt.hashSync(password);

	db.transaction(trx =>{
		trx.insert({
			hash: hash,
			email: email,
		})
		.into('login')
		.returning('email')
		.then(loginEmail =>{
			return trx('users')
				.returning('*')
				.insert({
					name: name,
					email: loginEmail[0],
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('unable to sign up'));

	// bcrypt.compareSync(someOtherPlaintextPassword, hash); // false
	// bcrypt.hash(password, null, null, function(err, hash) {
	// 	console.log(hash);
 //    // Store hash in your password DB.
	// });
	
} 

module.exports = {
	handleRegister: handleRegister
}