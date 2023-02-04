# Overview

This API allows the cilent to interface with the "ryde-assignment" database and query the "users" table. The API implements RESTful API design pattern and provides CRUD operations for "user" data.

# Design Assumptions

- User is of the same origin as the backend API, CORS is not required.
- Endpoints receieve and send data in JSON.
- For the purpose of the assignment, the application is hosted on localhost:3000.
- MongoDB is utilised, the database is hosted with the authorised URI with the application for ease of the assessor's access.

# Getting Started

1. `npm install` <br/>
2. `cd src`<br/>
3. `npm nodemon index.js`<br/>

# Endpoints

## Method: GET - "localhost:3000/users"

Queries the databse for all user documents within the collection "users". Documents are paginated with a default limit of 10 documents per page.

### Query Parameters

> **?page : number** - Current page that the cilent is querying. <br/> **?pageLimit : number** - The maximum number of documents to be retrieved per page. <br/>

### Response

#### 200 Status

> Returns array of user documents according to the query parameters.<br/> > `Array < {_id: 24-bit string,
 name: string,
address: string,
 description: string} >`

## Method: CREATE - "localhost:3000/users"

### Query Parameters

> Request: `{ body:{
name: string,
address: string,
description: string}
}}`

### Response

#### 200 Status

> Returns document of created user with "\_id" assigned.<br/> `{_id: 24-bit string,
 name: string,
address: string,
 description: string}`

#### 400 Status

> No user data receive for creation or user data failed validation. Error name and detailed message will be returned. <br/> `{name: string, statusCode: number, message:string}`

## Method: GET - "localhost:3000/users:id"

### Query Parameters

> **?id : 24bit string** - User Id to be queried.

### Response

#### 200 Status

> Returns document with matching user id.<br/> `{_id: 24-bit string,
 name: string,
address: string,
 description: string}`

#### 400 Status

> Queried User Id is not a valid User Id. Error name and detailed message will be returned. <br/> `{name: string, statusCode: number, message:string}`

#### 404 Status

> Socument matching the queried User Id was not found. Error name and detailed message will be returned. <br/> `{name: string, statusCode: number, message:string}`

## Method: PUT - "localhost:3000/users/:id"

### Query Parameters

> **?id : 24bit string** - User Id to be queried. <br/>
> Request: `{ body:{
  _id: 24bit string,
name: string,
address: string,
description: string}
}}`

### Response

#### 200 Status

> Returns document with updated user document.<br/> `{_id: 24-bit string,
 name: string,
address: string,
 description: string}`

#### 400 Status

> User Id query not valid or new user data failed database validation. <br/> `{name: string, statusCode: number, message:string}`

## Method: DELETE - "localhost:3000/users/:id"

### Query Parameters

> **?id : 24bit string** - User Id to be queried. <br/>

### Response

#### 200 Status

> Returns document of deleted user.<br/> `{_id: 24-bit string,
 name: string,
address: string,
 description: string}`

#### 400 Status

> User Id query not valid or document of matching User Id was not found. <br/> `{name: string, statusCode: number, message:string}`

## Testing

Run `npm test` to start application testing suite using Jest.
