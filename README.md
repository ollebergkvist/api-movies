[![Build Status](https://travis-ci.com/ollebergkvist/api-movies.svg?branch=main)](https://travis-ci.com/ollebergkvist/api-movies)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/ollebergkvist/api-movies/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/ollebergkvist/api-movies/?branch=main)
[![Code Coverage](https://scrutinizer-ci.com/g/ollebergkvist/api-movies/badges/coverage.png?b=main)](https://scrutinizer-ci.com/g/ollebergkvist/api-movies/?branch=main)
[![Build Status](https://scrutinizer-ci.com/g/ollebergkvist/api-movies/badges/build.png?b=main)](https://scrutinizer-ci.com/g/ollebergkvist/api-movies/build-status/main)

# Install

```
Clone repo: git clone https://github.com/ollebergkvist/api-movie

Install dependencies: npm install

Create .env file: touch .env

Create folders: mkdir uploads logs

Start development: npm run dev

Start production: npm run start
```

# Environment variables

```
Set the required env variables in the .env file

SECRET={jwtSecret}
MONGDODB_URI={URI}
PORT={PORT}
```

# Database

```
Path to db dump:
/db/dump

Backup
mongodump --db movies --archive=movies.archive --gzip

Restore
mongorestore --gzip --archive=movies.archive
```

# Precreated users

```
User
username: user@user.com
password: Password#1

Admin
username: admin@admin.com
password: Password#1
```

# Postman collection

```
Development (localhost):
https://www.getpostman.com/collections/7a71e416d915d809cea9

Deployed (heroku):
https://www.getpostman.com/collections/76d500b0ba866b15bbb4
```

# Docker

```
docker build -t {tagname} .
docker run -d -p {port}:{port} {tagname}
docker-compose up --detach
```

# Tests

```
npm test
```

# Movie API documentation

```
Routes open to the public:
GET /movies
GET /movies/:id
GET /search
```

```
Routes secured by JWT:
POST /movies/rent
POST /movies/purchase
PUT /favorite

The mentioned routes need a valid JSON Web Token (JWT) set in the HTTP-header.
The 'x-access-token' header should contain the JWT. In order to retrieve a token, a user
need to register and login successfully via the routes stated below:
POST /register
POST /login
```

```
Routes secured with JWT plus admin rights:
GET /admin/movies
GET /admin/movies/:id
GET /admin/search
POST /movies
PUT /movies/:id
DELETE /movies/:id
POST /remove/:id
PUT /availability/:id
PUT /return/:id
GET /users
PUT /users/:id

```

## Movies

### A movie has the following attributes:

```
id
title
description
image
stock
deleted
rental_price
sales_price
availability
likes
createdAt
updatedAt
```

# Get all movies:

### Resource URL

```
GET /api/movies
```

### Description

```
Regular users can only fetch movies marked as available in the collection.
Pagination, sorting (all collection fields) and limiting is supported by default.

Use - prefixes to sort in descending order and no prefixes to sort in ascending order.
```

### Example

```
Example URL:
http://localhost:3000/api/movies?sort=title&limit=3&page=1
```

### Result:

```
{
    "type": "Success",
    "source": "/movies",
    "detail": "Movies fetched",
    "document": {
        "docs": [
            {
                "stock": 5,
                "rental_price": 10,
                "sales_price": 20,
                "availability": true,
                "likes": 1,
                "deleted": false,
                "_id": "604935b38b6af1337936a9ad",
                "title": "Fight Club ",
                "description": "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.",
                "image": "https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UX182_CR0,0,182,268_AL_.jpg",
                "__v": 0,
                "createdAt": "2021-03-10T21:10:11.183Z",
                "updatedAt": "2021-03-11T00:24:59.146Z"
            },
            {
                "stock": 5,
                "rental_price": 10,
                "sales_price": 20,
                "availability": true,
                "likes": 0,
                "deleted": false,
                "_id": "604935b38b6af1337936a9ae",
                "title": "Forrest Gump",
                "description": "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
                "image": "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_UY268_CR1,0,182,268_AL_.jpg",
                "__v": 0,
                "createdAt": "2021-03-10T21:10:11.183Z",
                "updatedAt": "2021-03-10T21:10:11.183Z"
            },
            {
                "stock": 5,
                "rental_price": 10,
                "sales_price": 20,
                "availability": true,
                "likes": 0,
                "deleted": false,
                "_id": "604935b38b6af1337936a9af",
                "title": "Inception",
                "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
                "image": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_UX182_CR0,0,182,268_AL_.jpg",
                "__v": 0,
                "createdAt": "2021-03-10T21:10:11.183Z",
                "updatedAt": "2021-03-10T21:10:11.183Z"
            }
        ],
        "totalDocs": 12,
        "limit": 3,
        "totalPages": 4,
        "page": 1,
        "pagingCounter": 1,
        "hasPrevPage": false,
        "hasNextPage": true,
        "prevPage": null,
        "nextPage": 2
    }
}

```

# Get all movies (admin):

### Resource URL

```
GET /api/admin/movies
```

### Description

```
Admin can only fetch all movies in the collection.
Meaningg movies where the availability is marked as false or true.
Filtering (all collection fields), pagination, sorting (all collection fields) and limiting is supported by default.

Use - prefixes to sort in descending order and no prefixes to sort in ascending order.
```

### Example

```
Example URL:
http://localhost:3000/api/admin/movies?availability=false&sort=-title&limit=2
```

### Result:

```
{
    "type": "Success",
    "source": "/admin/movies",
    "detail": "Movies fetched",
    "document": {
        "docs": [
            {
                "stock": 0,
                "rental_price": 10,
                "sales_price": 20,
                "availability": false,
                "likes": 1,
                "deleted": false,
                "_id": "604935b38b6af1337936a9a5",
                "title": "The Godfather: Part II",
                "description": "The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.",
                "image": "https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY268_CR3,0,182,268_AL_.jpg",
                "__v": 0,
                "createdAt": "2021-03-10T21:10:11.181Z",
                "updatedAt": "2021-03-12T00:38:32.344Z"
            },
            {
                "stock": 3,
                "rental_price": 5,
                "sales_price": 10,
                "availability": false,
                "likes": 0,
                "deleted": false,
                "_id": "604aa9a7ab706913f38bb032",
                "title": "Tenet8",
                "description": "A secret agent is given a single word as his weapon and sent to prevent the onset of World War III. He must travel through time and bend the laws of nature in order to be successful in his mission.",
                "image": "uploads/bc59560594d5305d2085a7d4c8b220a6.jpg",
                "createdAt": "2021-03-11T23:37:11.718Z",
                "updatedAt": "2021-03-11T23:37:11.718Z",
                "__v": 0
            }
        ],
        "totalDocs": 4,
        "offset": 0,
        "limit": 2,
        "totalPages": 2,
        "page": 1,
        "pagingCounter": 1,
        "hasPrevPage": false,
        "hasNextPage": true,
        "prevPage": null,
        "nextPage": 2
    }
}

```

# Get specific movie:

### Resource URL

```
GET /api/movies/:id
```

### Description

```
Regular users can only fetch movies marked as available in the collection.
```

### Example

```
Example URL:
http://localhost:3000/api/movies/604935b38b6af1337936a9af
```

### Result

```
{
    "type": "Success",
    "source": "/movies/604935b38b6af1337936a9af",
    "detail": "Movie fetched",
    "document": {
        "stock": 5,
        "rental_price": 10,
        "sales_price": 20,
        "availability": true,
        "likes": 0,
        "deleted": false,
        "_id": "604935b38b6af1337936a9af",
        "title": "Inception",
        "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        "image": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_UX182_CR0,0,182,268_AL_.jpg",
        "__v": 0,
        "createdAt": "2021-03-10T21:10:11.183Z",
        "updatedAt": "2021-03-10T21:10:11.183Z"
    }
}
```

# Get specific movie (admin):

### Resource URL

```
GET /api/admin/movies/:id
```

### Description

```
Admin users can fetch all movies marked as available in the collection.
```

### Example

```
Example URL:
http://localhost:3000/api/admin/movies/604935b38b6af1337936a9af
```

### Result

```
{
    "type": "Success",
    "source": "/admin/movies/604935b38b6af1337936a9a3",
    "detail": "Movie fetched",
    "document": {
        "stock": 22,
        "rental_price": 22,
        "sales_price": 100,
        "availability": false,
        "likes": 7,
        "deleted": false,
        "_id": "604935b38b6af1337936a9a3",
        "title": "Shawshank Redemption",
        "description": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        "image": "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UX182_CR0,0,182,268_AL_.jpg",
        "__v": 0,
        "createdAt": "2021-03-10T21:10:11.179Z",
        "updatedAt": "2021-03-12T03:09:11.869Z"
    }
}
```

# Search movies:

```
POST /api/movies/search/title?
```

### Description

```
Regular users can only search for movies marked as available in the collection.
```

### Example

```
Example URL:
http://localhost:3000/api/search?title=inception
```

### Example response

```
{
    "type": "Success",
    "source": "/search",
    "detail": "Movie fetched",
    "document": [
        {
            "stock": 5,
            "rental_price": 10,
            "sales_price": 20,
            "availability": true,
            "likes": 0,
            "deleted": false,
            "_id": "604935b38b6af1337936a9af",
            "title": "Inception",
            "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
            "image": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_UX182_CR0,0,182,268_AL_.jpg",
            "__v": 0,
            "createdAt": "2021-03-10T21:10:11.183Z",
            "updatedAt": "2021-03-10T21:10:11.183Z"
        }
    ]
}
```

# Search movies (admin):

```
POST /api/admin/movies/search/title?
```

### Description

```
Admin can search for all movies in the collection.
```

### Example

```
Example URL:
http://localhost:3000/api/admin/search?title=shawshank redemption
```

### Example response

```
{
    "type": "Success",
    "source": "/admin/search",
    "detail": "Movie fetched",
    "document": [
        {
            "stock": 22,
            "rental_price": 22,
            "sales_price": 100,
            "availability": false,
            "likes": 7,
            "deleted": false,
            "_id": "604935b38b6af1337936a9a3",
            "title": "Shawshank Redemption",
            "description": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
            "image": "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UX182_CR0,0,182,268_AL_.jpg",
            "__v": 0,
            "createdAt": "2021-03-10T21:10:11.179Z",
            "updatedAt": "2021-03-12T03:09:11.869Z"
        }
    ]
}
```

# Add movie (admin)

```
POST /api/movies
```

### Description

```
Supports upload functionality of images, in order for this to work form-data need to be used
and a image has to be selected.
Images are stored in the uploads folder.
```

### Required parameters:

```
title
description
image
```

### Optional parameters (if not set default values are used):

```
stock
rental_price
sales_price
availability
likes
```

### Result

```
HTTP Status Code 201 Created
```

### Possible error, besides errors returned from db:

```
{
    "status": "400",
    "type": "Error",
    "source": "/movies",
    "title": "Movie exists already"
}
```

# Delete movie (admin)

```
DELETE /api/movies/:id
```

### Description

```
Deletes item from collection.
Hard delete.
```

### Response

```
HTTP Status Code 204 No Content
```

### Possible error, besides errors returned from db:

```
{
    "status": "400",
    "type": "Error",
    "source": "/movies/:id",
    "title": "Movie with given id could not be found"
}
```

# Remove movie (admin)

```
PUT /api/movies/:id
```

### Description

```
Marks item as deleted.
Updates field: deleted as true.
Soft delete.
```

### Response

```
HTTP Status Code 204 No Content
```

### Possible error, besides errors returned from db:

```
{
    "status": "400",
    "type": "Error",
    "source": "/movies/:id",
    "title": "Movie with given id could not be found"
}
```

# Update movie (admin)

```
PUT /api/movies/:id
```

### Required parameters (one of the following):

```
title
description
image
stock
rental_price
sales_price
availability
likes

```

### Result

```
HTTP Status Code 204 No Content
```

### Possible error, besides errors returned from db:

```
{
    "status": "400",
    "type": "Error",
    "source": "/movies/:id",
    "title": "Movie with given id could not be found"
}
```

# Change availability of a movie (admin)

```
PUT /api/availability/:id
```

### Result

```
HTTP Status Code 204 No Content
```

### Possible error, besides errors returned from db:

```
{
    "status": "400",
    "type": "Error",
    "source": "/availability/604935b38b6af1337936a9a2",
    "title": "Movie with given id could not be found"
}
```

# Rentals

### A rental has the following attributes:

```
movie_id
customer_id
amount
cost
return_date
returned
rental_price
penalty
returnedAt
createdAt
updatedAt
```

# Add rental

```
POST /api/movies
```

### Required parameters:

```
movie_id
customer_id
amount
cost

```

### Optional parameters:

```
return_date
returned
penalty
```

### Result

```
{
    "status": "201",
    "type": "Success",
    "source": "/movies/rent",
    "message": "Movie successfully rented",
    "document": {
        "returnDate": "2021-03-15T14:30:22.499Z",
        "returned": false,
        "_id": "604b7f83224fc02506fb5d9a",
        "movieID": "604935b38b6af1337936a9a9",
        "customerID": "604961a685abaa3ee96a4ec5",
        "amount": 2,
        "cost": 33,
        "createdAt": "2021-03-12T14:49:39.782Z",
        "updatedAt": "2021-03-12T14:49:39.782Z",
        "__v": 0
    }
}
```

### Possible error, besides errors returned from db:

```
{
    "status": 400,
    "type": "Error",
    "source": "/movies/purchase",
    "message": "Insufficient stock to complete order"
}
```

# Purchases

### A purchase has the following attributes:

```
movie_id
customer_id
amount
cost
createdAt
updatedAt
```

# Add purchase

```
POST /api/movies/purchase
```

### Required parameters:

```
movie_id
customer_id
amount
cost
```

### Result

```
{
    "status": "201",
    "type": "Success",
    "source": "/movies/purchase",
    "message": "Movie successfully purchased",
    "document": {
        "_id": "604b7dda224fc02506fb5d83",
        "movieID": "604935b38b6af1337936a9a9",
        "customerID": "604961a685abaa3ee96a4ec5",
        "amount": 1,
        "cost": 1,
        "createdAt": "2021-03-12T14:42:34.320Z",
        "updatedAt": "2021-03-12T14:42:34.320Z",
        "__v": 0
    }
}
```

### Possible error, besides errors returned from db:

```
{
    "status": 400,
    "type": "Error",
    "source": "/movies/purchase",
    "message": "Insufficient stock to complete order"
}
```

# Return movie (admin):

```
PUT /api/admin/movies/return/:id
```

### Example response

```
{
    "status": "204",
    "type": "Success",
    "source": "/return/604b913add61ac25900135b8",
    "message": "Movie successfully returned"
}
```

# Register

### Resource URL

```
POST /api/register
```

### Required parameters:

```
email
password
```

### Result:

```
{   "status": 201,
    "type": "Success",
    "source": "/register",
    "detail": "Registration succeeded"
}
```

# Login

### Resource URL

```
POST /api/login
```

### Required parameters:

```
email
password
```

### Result:

```
{
    "status": "200"
    "type": "Success",
    "source": "/login",
    "detail": "User logged in",
    "user": "admin@admin.com",
    "admin": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImFkbWluIjp0cnVlLCJpYXQiOjE2MTU1NjAwNTEsImV4cCI6MTYxNTY0NjQ1MX0.y3f7c5kRUbMTLEr-wgYfRDHh1lciPn-ju_Rt61zRKdM"
}
```

N.B. The access token expires after 24 hours.

# Get all users (admin):

```
GET /api/admin/movies/return/:id
```

### Example response

```
{
    "type": "Success",
    "message": "Users retrieved successfully",
    "documents": [
        {
            "admin": true,
            "_id": "604961a685abaa3ee96a4ec4",
            "email": "admin@admin.com",
            "password": "$2a$10$jJnGhCVxf/VMUcmCdc387uhI8e1Q8dq2Ko76huSsnqAbx9mLrIuHG",
            "favorites": [],
            "createdAt": "2021-03-11T00:17:42.809Z",
            "updatedAt": "2021-03-11T00:17:42.809Z",
            "__v": 0
        },
        {
            "admin": false,
            "_id": "604961a685abaa3ee96a4ec5",
            "email": "user@user.com",
            "password": "$2a$10$jJnGhCVxf/VMUcmCdc387uhI8e1Q8dq2Ko76huSsnqAbx9mLrIuHG",
            "favorites": [],
            "createdAt": "2021-03-11T00:17:42.841Z",
            "updatedAt": "2021-03-11T00:25:32.380Z",
            "__v": 8
        },
    ]
}
```

# Get specific movie (admin):

### Resource URL

```
GET /api/users/:id
```

### Result

```
{
    "type": "Success",
    "source": "/users/604961a685abaa3ee96a4ec4",
    "detail": "User found",
    "document": {
        "admin": true,
        "_id": "604961a685abaa3ee96a4ec4",
        "email": "admin@admin.com",
        "password": "$2a$10$jJnGhCVxf/VMUcmCdc387uhI8e1Q8dq2Ko76huSsnqAbx9mLrIuHG",
        "favorites": [],
        "createdAt": "2021-03-11T00:17:42.809Z",
        "updatedAt": "2021-03-11T00:17:42.809Z",
        "__v": 0
    }
}
```

### Possible error, besides errors returned from db:

```
{
    "status": "400"
    "type": "Error",
    "source": "/users/604961a685abaa3ee96a4ec3",
    "detail": "User with given id could not be found"
}
```

# Change user permissions (admin):

### Resource URL

```
PUT /api/users/:id
```

### Required parameters:

```
admin
```

### Result

```
{
    "status": "204",
    "type": "Success",
    "source": "/users/604961a685abaa3ee96a4ec5",
    "detail": "User rights updated successfully"
}
```

### Possible error, besides errors returned from db:

```
{
    "status": "404"
    "type": "Error",
    "source": "/users/:id",
    "detail": "User with given id could not be found"
}
```

# Add movie to favorites:

### Resource URL

```
PUT /api/favorite
```

### Required parameters:

```
id
movie_id
```

### Result

```
{
    "status": "200",
    "type": "Success",
    "source": "/favorite",
    "detail": "Movie added to user favorites and number of likes in given movie was incremented with 1"
}
```

### Possible error, besides errors returned from db:

```
{
    "status": "400",
    "type": "Error",
    "source": "/favorite",
    "detail": "Movie has already been added to user's favorites"
}
```
