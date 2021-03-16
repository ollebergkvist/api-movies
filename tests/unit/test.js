process.env.NODE_ENV = 'test';
process.env.TEST_SUITE = 'test';
var userToken = '';
var adminToken = '';
var movieID = '';
var userID = '';
var invalidMovieID = '605007a2484b0c0bd8bd6ce2';
var invalidUserID = '605007a2484b0c0bd8bd6ce2';
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const createServer = require('../../models/server.js');
const server = createServer();
// const userSchema = require('../../schemas/user.js');
// const purchaseSchema = require('../../schemas/purchase.js');
// const rentalSchema = require('../../schemas/rent.js');
const movieSchema = require('../../schemas/movie.js');
chai.should();
chai.use(chaiHttp);

before(async function () {
	try {
		await mongoose.connect(
			`mongodb://localhost:27017/${process.env.TEST_SUITE}`,
			{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
		);
	} catch (err) {
		console.log(err);
	}
	try {
		const movie = await new movieSchema({
			title: 'test',
			description: 'test',
			image: 'test',
			stock: 5,
			rental_price: 10,
			sales_price: 20,
			availability: true,
		});
		await movie.save();
		const movie2 = await new movieSchema({
			title: 'test2',
			description: 'test',
			image: 'test',
			stock: 5,
			rental_price: 10,
			sales_price: 20,
			availability: false,
		});
		await movie2.save();
	} catch (err) {
		console.log(err);
	}
});

after(async function () {
	try {
		await mongoose.connection.db.dropDatabase();
		await mongoose.connection.close();
	} catch (err) {
		console.log(err);
	}
});

describe('POST /register', () => {
	it('should get 400 as we do not provide email', (done) => {
		let user = {
			// email: 'test@example.com',
			password: 'Password#1',
		};

		chai
			.request(server)
			.post('/api/register')
			.send(user)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.an('object');

				done();
			});
	});

	it('should get 400 as we do not provide password', (done) => {
		let user = {
			email: 'test@example.com',
			// password: 'Password#1',
		};

		chai
			.request(server)
			.post('/api/register')
			.send(user)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.an('object');

				done();
			});
	});

	it('should get 201 as user was registered', (done) => {
		let user = {
			email: 'test@example.com',
			password: 'Password#1',
		};

		chai
			.request(server)
			.post('/api/register')
			.send(user)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.an('object');

				done();
			});
	});

	it('should get 201 as admin was registered', (done) => {
		let user = {
			email: 'admin@example.com',
			password: 'Password#1',
			admin: 'admin',
		};

		chai
			.request(server)
			.post('/api/register')
			.send(user)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.an('object');

				done();
			});
	});

	it('should get 400 as account with this email already exists', (done) => {
		let user = {
			email: 'test@example.com',
			password: 'Password#1',
		};

		chai
			.request(server)
			.post('/api/register')
			.send(user)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.an('object');

				done();
			});
	});
});

describe('POST /login', () => {
	it('should get 400 as we do not provide email', (done) => {
		let user = {
			//email: "test@example.com",
			password: 'Password#1',
		};

		chai
			.request(server)
			.post('/api/login')
			.send(user)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 400 as we do not provide password', (done) => {
		let user = {
			email: 'test@example.com',
			// password: 'Password#1',
		};

		chai
			.request(server)
			.post('/api/login')
			.send(user)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 400 as user not found', (done) => {
		let user = {
			email: 'nobody@example.com',
			password: 'Password#1',
		};

		chai
			.request(server)
			.post('/api/login')
			.send(user)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 401 incorrect password', (done) => {
		let user = {
			email: 'test@example.com',
			password: 'wrongpassword',
		};

		chai
			.request(server)
			.post('/api/login')
			.send(user)
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 201 user successfully logged in', (done) => {
		let user = {
			email: 'test@example.com',
			password: 'Password#1',
		};

		chai
			.request(server)
			.post('/api/login')
			.send(user)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('object');
				userToken = res.body.token;

				done();
			});
	});

	it('should get 201 admin successfully logged in', (done) => {
		let user = {
			email: 'admin@example.com',
			password: 'Password#1',
		};

		chai
			.request(server)
			.post('/api/login')
			.send(user)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('object');
				adminToken = res.body.token;

				done();
			});
	});
});

describe('GET /movies', () => {
	it('should get 200', (done) => {
		chai
			.request(server)
			.get('/api/movies')
			.end((err, res) => {
				movieID = res.body.document.docs[0]._id;
				res.should.have.status(200);
				res.body.should.be.an('object');
				done();
			});
	});
	it('should get 200', (done) => {
		chai
			.request(server)
			.get('/api/movies?page=2&limit=1&sort=-title')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('object');
				done();
			});
	});
	it('should get 200', (done) => {
		chai
			.request(server)
			.get('/api/movies?page=2')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('object');
				done();
			});
	});
	it('should get 200', (done) => {
		chai
			.request(server)
			.get('/api/movies?limit=1')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('object');
				done();
			});
	});
	it('should get 200', (done) => {
		chai
			.request(server)
			.get('/api/movies?sort=-title')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('object');
				done();
			});
	});
	it('should get 200', (done) => {
		chai
			.request(server)
			.get('/api/movies?sort=-title&limit=1')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('object');
				done();
			});
	});
	it('should get 200', (done) => {
		chai
			.request(server)
			.get('/api/movies?limit=1&page=1')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('object');
				done();
			});
	});
	it('should get 200', (done) => {
		chai
			.request(server)
			.get('/api/movies?sort=title&page=1')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('object');
				done();
			});
	});
	// it('should get 404', (done) => {
	// 	chai
	// 		.request(server)
	// 		.get('/api/movies?sort=title&page=1')
	// 		.end((err, res) => {
	// 			res.should.have.status(404);
	// 			res.body.should.be.an('object');
	// 			done();
	// 		});
	// });
});

describe('GET /admin/movies', () => {
	it('should get 401 as admin was not logged in', (done) => {
		chai
			.request(server)
			.get('/api/admin/movies')
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 200 as admin was logged in', (done) => {
		chai
			.request(server)
			.get('/api/admin/movies')
			.set('x-access-token', adminToken)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('object');
				done();
			});
	});
});

describe('GET /movies/:id', () => {
	it('should get 400 as movie was not found', (done) => {
		chai
			.request(server)
			.get(`/api/movies/${invalidMovieID}`)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.an('object');
				done();
			});
	});
});

describe('GET /admin/movies/:id', () => {
	it('should get 404 as admin was not logged in', (done) => {
		chai
			.request(server)
			.get(`/api/admin/movies/${movieID}`)
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 400 as movie with given id could not be found', (done) => {
		chai
			.request(server)
			.get(`/api/admin/movies/${invalidMovieID}`)
			.set('x-access-token', adminToken)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.an('object');
				done();
			});
	});
});

describe('GET /search', () => {
	it('should get 200', (done) => {
		chai
			.request(server)
			.get('/api/search?title=test')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 404 as movie could not be found', (done) => {
		chai
			.request(server)
			.get('/api/search?title=invalid')
			.end((err, res) => {
				res.should.have.status(404);
				res.body.should.be.an('object');
				done();
			});
	});
});

describe('GET /admin/search', () => {
	it('should get 401 as admin was not logged in', (done) => {
		chai
			.request(server)
			.get('/api/admin/search')
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.an('object');
				done();
			});
	});
	it('should get 401 as admin was not logged in', (done) => {
		chai
			.request(server)
			.get('/api/admin/search')
			.set('x-access-token', userToken)
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.an('object');
				done();
			});
	});
	it('should get 401 as token is invalid', (done) => {
		chai
			.request(server)
			.get('/api/admin/search')
			.set('x-access-token', 'invalid_token')
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.an('object');
				done();
			});
	});
	it('should get 200', (done) => {
		chai
			.request(server)
			.get('/api/admin/search?title=test')
			.set('x-access-token', adminToken)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('object');
				done();
			});
	});
	it('should get 404 as movie could not be found', (done) => {
		chai
			.request(server)
			.get('/api/admin/search?title=invalid')
			.set('x-access-token', adminToken)
			.end((err, res) => {
				res.should.have.status(404);
				res.body.should.be.an('object');
				done();
			});
	});
});

describe('POST /movies', () => {
	it('should get 401 as admin was not logged in', (done) => {
		chai
			.request(server)
			.post('/api/movies')
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 400 as movie already exists', (done) => {
		let movie = {
			title: 'test',
			description:
				'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
			stock: 5,
			rental_price: 10,
			sales_price: 5,
			availability: 'true',
		};
		chai
			.request(server)
			.post('/api/movies')
			.set('x-access-token', adminToken)
			.send(movie)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.an('object');
				done();
			});
	});
});

describe('PUT /movies', () => {
	it('should get 401 as token was not provided', (done) => {
		chai
			.request(server)
			.put('/api/movies/1')
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 204', (done) => {
		let movie = {
			title: 'newtitle',
			description:
				'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
			stock: 5,
			rental_price: 10,
			sales_price: 5,
			availability: 'true',
		};
		chai
			.request(server)
			.put(`/api/movies/${movieID}`)
			.set('x-access-token', adminToken)
			.send(movie)
			.end((err, res) => {
				res.should.have.status(204);
				res.body.should.be.an('object');
				done();
			});
	});
	it("should get 400 as movie with given id don't exist", (done) => {
		let movie = {
			title: 'newtitle',
			description:
				'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
			stock: 5,
			rental_price: 10,
			sales_price: 5,
			availability: 'true',
		};
		chai
			.request(server)
			.put(`/api/movies/${invalidMovieID}`)
			.set('x-access-token', adminToken)
			.send(movie)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.an('object');
				done();
			});
	});
});

describe('DEL /movies', () => {
	it('should get 401 as token was not provided', (done) => {
		chai
			.request(server)
			.del('/api/movies/1')
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.an('object');
				done();
			});
	});
});

describe('GET undefined/', () => {
	it('should get 404 as path dont exits', (done) => {
		chai
			.request(server)
			.put('/api/undefined')
			.end((err, res) => {
				res.should.have.status(404);
				res.body.should.be.an('object');
				done();
			});
	});
});

describe('POST movies/purchase', () => {
	it('should get 401 as token was not provided', (done) => {
		chai
			.request(server)
			.put('/api/availability/1')
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.an('object');
				done();
			});
	});
});

describe('PUT return/:id', () => {
	it('should get 401 as token was not provided', (done) => {
		chai
			.request(server)
			.put('/api/return/1')
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.an('object');
				done();
			});
	});
});

describe('GET users', () => {
	it('should get 401 as token was not provided', (done) => {
		chai
			.request(server)
			.get('/api/users')
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 200 as token was provided', (done) => {
		chai
			.request(server)
			.get('/api/users')
			.set('x-access-token', adminToken)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('object');
				userID = res.body.documents[0]._id;
				done();
			});
	});
});

describe('GET users/:id', () => {
	it('should get 401 as token was not provided', (done) => {
		chai
			.request(server)
			.get('/api/users/1')
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 400 as invalid user id was provided', (done) => {
		chai
			.request(server)
			.get(`/api/users/604fbc5070f89a08466bd66f`)
			.set('x-access-token', adminToken)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 200 as token was provided', (done) => {
		chai
			.request(server)
			.get(`/api/users/${userID}`)
			.set('x-access-token', adminToken)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('object');
				done();
			});
	});
});

describe('GET /', () => {
	it('should get 200', (done) => {
		chai
			.request(server)
			.get('/')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('object');
				done();
			});
	});
});

describe('PUT favorite', () => {
	it('should get 401 as token was not provided', (done) => {
		chai
			.request(server)
			.put('/api/favorite')
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 200', (done) => {
		let favorite = {
			id: userID,
			movie_id: movieID,
		};
		chai
			.request(server)
			.put('/api/favorite')
			.set('x-access-token', userToken)
			.send(favorite)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 400 as movie exists', (done) => {
		let favorite = {
			id: userID,
			movie_id: movieID,
		};
		chai
			.request(server)
			.put('/api/favorite')
			.set('x-access-token', userToken)
			.send(favorite)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.an('object');
				done();
			});
	});

	it("should get 400 as user id don't exist", (done) => {
		let favorite = {
			id: invalidUserID,
			movie_id: movieID,
		};
		chai
			.request(server)
			.put('/api/favorite')
			.set('x-access-token', userToken)
			.send(favorite)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.an('object');
				done();
			});
	});

	it("should get 400 as movie id don't exist", (done) => {
		let favorite = {
			id: userID,
			movie_id: invalidMovieID,
		};
		chai
			.request(server)
			.put('/api/favorite')
			.set('x-access-token', userToken)
			.send(favorite)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.an('object');
				done();
			});
	});
});

describe('PUT users', () => {
	it('should get 401 as token was not provided', (done) => {
		chai
			.request(server)
			.put('/api/users/1')
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 400 as user id is invalid', (done) => {
		let admin = {
			admin: 'admin',
		};
		chai
			.request(server)
			.put(`/api/users/${invalidUserID}`)
			.set('x-access-token', adminToken)
			.send(admin)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 200 as token is set and user has admin rights', (done) => {
		let admin = {
			admin: 'admin',
		};
		chai
			.request(server)
			.put(`/api/users/${userID}`)
			.set('x-access-token', adminToken)
			.send(admin)
			.end((err, res) => {
				res.should.have.status(204);
				res.body.should.be.an('object');
				done();
			});
	});
});

describe('PUT availability/:id', () => {
	it('should get 401 as token was not provided', (done) => {
		chai
			.request(server)
			.put(`/api/availability/${movieID}`)
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.an('object');
				done();
			});
	});

	it("should get 400 as movie with given id don't exist", (done) => {
		chai
			.request(server)
			.put(`/api/availability/${invalidMovieID}`)
			.set('x-access-token', adminToken)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 200', (done) => {
		chai
			.request(server)
			.put(`/api/availability/${movieID}`)
			.set('x-access-token', adminToken)
			.end((err, res) => {
				res.should.have.status(204);
				res.body.should.be.an('object');
				done();
			});
	});
});

describe('POST movies/rent', () => {
	it('should get 401 as token was not provided', (done) => {
		chai
			.request(server)
			.post('/api/movies/rent')
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 201', (done) => {
		let rent = {
			movie_id: movieID,
			customer_id: userID,
			amount: 1,
			cost: 10,
		};
		chai
			.request(server)
			.post('/api/movies/rent')
			.set('x-access-token', adminToken)
			.send(rent)
			.end((err, res) => {
				console.log(movieID);
				res.should.have.status(201);
				res.body.should.be.an('object');
				done();
			});
	});
});

describe('POST movies/purchase', () => {
	it('should get 401 as token was not provided', (done) => {
		chai
			.request(server)
			.post('/api/movies/purchase')
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 201', (done) => {
		let purchase = {
			movie_id: movieID,
			customer_id: userID,
			amount: 1,
			cost: 10,
		};
		chai
			.request(server)
			.post('/api/movies/purchase')
			.set('x-access-token', adminToken)
			.send(purchase)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.an('object');
				done();
			});
	});
});

describe('PUT /remove/:id', () => {
	it('should get 401 as token was not provided', (done) => {
		chai
			.request(server)
			.put('/api/remove/1')
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 204', (done) => {
		chai
			.request(server)
			.put(`/api/remove/${movieID}`)
			.set('x-access-token', adminToken)
			.end((err, res) => {
				res.should.have.status(204);
				res.body.should.be.an('object');
				done();
			});
	});
	it("should get 400 as movie with given id don't exist", (done) => {
		chai
			.request(server)
			.put(`/api/remove/${invalidMovieID}`)
			.set('x-access-token', adminToken)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.an('object');
				done();
			});
	});
});

describe('DEL /movies', () => {
	it('should get 401 as token was not provided', (done) => {
		chai
			.request(server)
			.del('/api/movies/1')
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.an('object');
				done();
			});
	});

	it('should get 204', (done) => {
		chai
			.request(server)
			.del(`/api/movies/${movieID}`)
			.set('x-access-token', adminToken)
			.end((err, res) => {
				res.should.have.status(204);
				res.body.should.be.an('object');
				done();
			});
	});
	it("should get 400 as movie with given id don't exist", (done) => {
		chai
			.request(server)
			.del(`/api/movies/${invalidMovieID}`)
			.set('x-access-token', adminToken)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.an('object');
				done();
			});
	});
});
