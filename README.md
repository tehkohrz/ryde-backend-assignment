# Ryde Backend Developer Test Assignment

## Context

Build a RESTful API that can get/create/update/delete user data from a
persistence database

**User Model**

> {
> "id": "xxx", // user ID<br/>
> "name": "test", // user name<br/>
> "dob": "", // date of birth<br/>
> "address": "", // user address<br/>
> "description": "", // user description<br/>
> "createdAt": "" // user created date<br/>
> }

## Requirements

**Functionality**

- The API should follow typical RESTful API design pattern.
- The data should be saved in the DB.
- Provide proper unit test.
- Provide proper API document.

## Tech stack

- We use Python, Nodejs, Go & PHP
- Use any framework.
- Use any DB. NoSQL DB is preferred.

## Bonus

- Write clear documentation on how it’s designed and how to run the code.
- Write good in-code comments.
- Write good commit messages.

## Advanced requirements

These are used for some further challenges. You can safely skip them but feel
free to try out.

- Provide a complete user auth (authentication/authorization/etc.) strategy,
  such as OAuth.
- Provide a complete logging (when/how/etc.) strategy.
- Imagine we have a new requirement right now that the user instances need
  to link to each other, i.e., a list of “followers/following” or “friends”. Can
  you find out how you would design the model structure and what API you
  would build for querying or modifying it?
- Related to the requirement above, suppose the address of user now includes
  a geographic coordinate(i.e., latitude and longitude), can you build an API
  that,
- given a user name
- return the nearby friends
