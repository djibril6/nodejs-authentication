# Complete Authentication API With Node.js

This project is a node.js application for a complete authentication system using email/tel and password. The project also include an authentication using third party like Google auth or Facebook. Please read the documentation below to deeper undestand the features provided and the requirements for the installation. Enjoy!

## Table of Contents

- [Installation](#installation-and-onfiguration)
- [Running the project](#running-the-project)
- [Features](#features)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Authorization](#authorization)

## Installation and Configuration

Clone the repo:

```bash
git clone https://github.com/djibril6/nodejs-authentication.git
cd nodejs-authentication
```

Install the dependencies:

```bash
yarn
```
or 
```bash
npm install
```

Set the environment variables: create a .env file in the root of the project and fill it based on the template provided in the .env.example file

```bash
cp .env.example .env

# Then open .env and modify the content with the correts values
```

Please note that you need to create a [Project from your google developer console](https://console.cloud.google.com/) and also register your app [register your app in Facebook](https://developers.facebook.com/apps) in order to fill the credentials needs for the authentication.


## Running the project

Running in development mode:

```bash
yarn dev
```

Running in production:

```bash
yarn start
```

Testing:

```bash
# run all tests
yarn test

# run all tests in watch mode
yarn test:watch

# run test coverage
yarn coverage
```

## Features
- **NoSQL database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)
- **Email service**: Email API service using [Sendgrid](https://sendgrid.com) for sending email such as email confirmation, new password if forgetten...
- **Authentication and authorization**: using [passport](http://www.passportjs.org) for Google and Facebook authentication.
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)


## Project Structure

```
src\
 |--config\         # Environment variables and global configurations
 |--controllers\    # All Route controllers
 |--middlewares\    # All Custom express middlewares
 |--models\         # All Mongoose models
 |--routes\         # RestFull Api Routes
 |--services\       # All database query and services(Business logic)
 |--utils\          # Utility classes and functions
 |--validations\    # All data validation logics
 |--index.js        # Express App entry point
```

## API Documentation

To see the documentation, run the server in development mode and go to `http://localhost:{PORT}/doc` in your browser. 

## Authentication

We use our custum `auth` middleware to require authentication for certain routes.

These routes require a valid JWT access token in the Authorization request header using the Bearer schema. If the request does not contain a valid access token, an Unauthorized (401) error is thrown.

**Generating Access Tokens**:

An access token can be obtained by the client app by making a successful call to the register (See [API Documentation](#api-documentation)) or login service. The response of these requests also contains refresh tokens.

In the default configuration, an access token is valid for 30 minutes.

**Refreshing Access Tokens**:

After the access token expires, a new access token can be generated, by the client app, by making a call to the refresh token service and sending along a valid refresh token in the request body. This call returns a new access token and a new refresh token.

In the default configuration, a refresh token is valid for 30 days.

## Authorization

Our `auth` middleware is also used to require certain rights/permissions to access a certain services. For example we can create a new route and require the user to have a cetain role to get access. In the exaple below only a user with developer and manager profile can have access to this route. 

```javascript
authRoute.patch('/update-password', 
    auth(EUserRole.DEVELOPER, EUserRole.MANAGER), 
    validate(authValidation.resetPassword), 
    authController.resetPassword);
```

If the user making the request does not have the required permissions to access this service, a Forbidden (403) error is thrown.
