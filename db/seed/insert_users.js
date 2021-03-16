// Module to seed db with users
// Not needed in case the db is restored from /db/dump/movies.archive

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/movies');
const userSchema = require('../../schemas/user.js');
const bcrypt = require('bcryptjs');

// Try to hash password and insert users
const insertUsers = async (req, res) => {
	const saltRounds = 10;

	// Try to hash password
	try {
		var hashedPassword = await bcrypt.hash('Password#1', saltRounds);
	} catch (err) {
		console.log(error);
	}

	// Try to create user
	try {
		const newUser = new userSchema({
			email: 'admin@admin.com',
			admin: true,
			password: hashedPassword,
		});

		const newUser2 = new userSchema({
			email: 'user@user.com',
			password: hashedPassword,
		});

		// Save users
		await newUser.save();
		await newUser2.save();
		console.log('Users inserted in db');
	} catch (err) {
		console.log(err);
	}
};

insertUsers();
