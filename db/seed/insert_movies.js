// Module to seed db with movies
// Not needed in case the db is restored from /db/dump/movies.archive

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/movies');

const Movie = require('../../schemas/movie.js');

// Movie documents
const movie1 = new Movie({
	title: 'The Shawshank Redemption',
	description:
		'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
	image:
		'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UX182_CR0,0,182,268_AL_.jpg',
	stock: 1,
	availability: false,
});

const movie2 = new Movie({
	title: 'The Godfather',
	description:
		"An organized crime dynasty's aging patriarch transfers control of his clandestine empire to his reluctant son.",
	image:
		'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY268_CR3,0,182,268_AL_.jpg',
	stock: 7,
	likes: 5,
	availability: false,
});

const movie3 = new Movie({
	title: 'The Godfather: Part II',
	description:
		'The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.',
	image:
		'https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY268_CR3,0,182,268_AL_.jpg',
	stock: 10,
});

const movie4 = new Movie({
	title: 'The Dark Knight',
	description:
		'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
	image:
		'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_UX182_CR0,0,182,268_AL_.jpg',
});

const movie5 = new Movie({
	title: '12 Angry Men',
	description:
		'A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.',
	image:
		'https://m.media-amazon.com/images/M/MV5BMWU4N2FjNzYtNTVkNC00NzQ0LTg0MjAtYTJlMjFhNGUxZDFmXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_UX182_CR0,0,182,268_AL_.jpg',
});

const movie6 = new Movie({
	title: "Schindler's List",
	description:
		'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.',
	image:
		'https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_UX182_CR0,0,182,268_AL_.jpg',
});

const movie7 = new Movie({
	title: 'The Lord of the Rings: The Return of the King',
	description:
		"Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
	image:
		'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UX182_CR0,0,182,268_AL_.jpg',
});

const movie8 = new Movie({
	title: 'Pulp Fiction',
	description:
		'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
	image:
		'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY268_CR1,0,182,268_AL_.jpg',
});

const movie9 = new Movie({
	title: 'The Good, the Bad and the Ugly',
	description:
		'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.',
	image:
		'https://m.media-amazon.com/images/M/MV5BOTQ5NDI3MTI4MF5BMl5BanBnXkFtZTgwNDQ4ODE5MDE@._V1_UX182_CR0,0,182,268_AL_.jpg',
});

const movie10 = new Movie({
	title: 'The Lord of the Rings: The Fellowship of the Ring',
	description:
		'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
	image:
		'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_UX182_CR0,0,182,268_AL_.jpg',
});

const movie11 = new Movie({
	title: 'Fight Club ',
	description:
		'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.',
	image:
		'https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UX182_CR0,0,182,268_AL_.jpg',
});

const movie12 = new Movie({
	title: 'Forrest Gump',
	description:
		'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.',
	image:
		'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_UY268_CR1,0,182,268_AL_.jpg',
});

const movie13 = new Movie({
	title: 'Inception',
	description:
		'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
	image:
		'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_UX182_CR0,0,182,268_AL_.jpg',
});

const movie14 = new Movie({
	title: 'The Lord of the Rings: The Two Towers',
	description:
		"While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron's new ally, Saruman, and his hordes of Isengard.",
	image:
		'https://m.media-amazon.com/images/M/MV5BZGMxZTdjZmYtMmE2Ni00ZTdkLWI5NTgtNjlmMjBiNzU2MmI5XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_UX182_CR0,0,182,268_AL_.jpg',
});

const movie15 = new Movie({
	title: 'Star Wars: Episode V - The Empire Strikes Back',
	description:
		'After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda, while his friends are pursued by Darth Vader and a bounty hunter named Boba Fett all over the galaxy.',
	image:
		'https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UX182_CR0,0,182,268_AL_.jpg',
});

// Movies array
const movies = [
	movie1,
	movie2,
	movie3,
	movie4,
	movie5,
	movie6,
	movie7,
	movie8,
	movie9,
	movie10,
	movie11,
	movie12,
	movie13,
	movie14,
	movie15,
];

// Insert movies
async function insertMovies() {
	try {
		const res = await Movie.insertMany(movies);
		console.log('Movies successfully inserted in the Movies collection');
		console.log(res);
	} catch (err) {
		console.error(err);
	}
}

// Call insertUsers
insertMovies();
