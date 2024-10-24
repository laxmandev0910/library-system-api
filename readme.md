# [✨Library Management System API✨](https://github.com/laxmandev0910/library-system-api.git)

> This library management system api offers a user-friendly platform for managing resources, users, and borrowing processes.

## Features

- Secure user authentication with JSON Web Tokens
- Role based authorizationfor effective access control.
- Performance optimization through caching
- Server-Side form data validation to ensure integrity and prevent invalid or malicious submissions
- Comprehensive test coverage with extensive unit and integration tests for all features.

## Technologies

This api developement utilize modern technologies to built robust features that ensure seamless functionality and performance:

- [Node.js v20.18.0](https://nodejs.org/) - JavaScript runtime for building the API
- [Express v4.21.0](https://expressjs.com/en/4x/api.html) - Web framework for Node.js API
- [MongoDB v7.14.0](https://www.mongodb.com) - NoSQL database for storing data
- [Mongoose v8.7.1](https://mongoosejs.com/docs/index.html) - ODM for MongoDB and Node.js
- [Jest v29.7.0](https://jestjs.io/) - Npm package to write unite test in Node.js API
- [Docker v27.2.0](https://www.docker.com/) - Containerization for easy deployment

## Prerequisites

- [Node.js](https://nodejs.org/) - Version 20 or higher
- [MongoDB](https://www.mongodb.com) - Local or cloud instance with version v7.x.x latest
- [Docker v27.2.0](https://www.docker.com/) - Version 27.x.x latest for Containerization

## Installation Steps for different environment

### Step1: Clone the repository

```sh
git clone https://github.com/laxmandev0910/library-system-api.git library-system-api
```

### Step2: Create environments files

- Create `.env` for api developement in local environment
- Create `.env.test` for api testing in test environment
- Create `.env.docker` for containerizing app With Docker Compose

```sh
cd library-system-api
copy .env.example .env
copy .env.test.example .env.test
copy .env.docker.example .env.docker
```

> ⚠️ Update required environment variables before next steps

### Step3: Run app according to environment

#### ✨ Starting the Application with Docker Compose

> Follow the below steps to run app:

- Step1 : Install [Docker Desktop v27.x](https://www.docker.com/get-started/)
- Step2 : Goto Project folder and open command prompt
- Step3 : Make sure `.env.docker`and .env.test created and set with valid environments values
- Step4: Run docker compose command
  ```sh
  docker-compose up --build -d
  ```
- Step5: Open app docker container's terminal
  ```sh
  docker exec -it node-server sh
  ```
- Step6: Run npm command to seed database
  ```sh
    npm run seed
  ```
- Step7: Type `exit` to leave the sh session
- Step8: Navigate to`http://localhost:{APP_PORT}/api/v1` in your browser to view the site

> Follow the below steps to run test:

- Step1 : Make sure .env.test created and set with valid environments values
- Step2: Open app docker container's terminal
  ```sh
  docker exec -it node-server sh
  ```
- Step3: Run npm command to seed database
  ```sh
    npm run test
  ```

> Use [insomnia](https://insomnia.rest/) to test api

- Step1 : Inside test folder, `Insomnia_2024-10-24.json` is present to import collection.
- Step2: import the collection and setup `ApiUrl` environment variable only with port number to use collection properly
  ```sh
  docker exec -it node-server sh
  ```

## Usage
