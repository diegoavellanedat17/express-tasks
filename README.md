# Express Task Management API
## Overview

This is an ExpressJS application that provides a RESTful API for user authentication and task management. It includes endpoints for user registration, login, and CRUD operations on tasks.

## Table of Contents

- [Overview](#overview)
- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
    - [Register](#register)
    - [Login](#login)
    - [Get User](#get-user)
  - [Tasks](#tasks)
    - [Create Task](#create-task)
    - [Get Tasks](#get-tasks)
    - [Update Task](#update-task)
    - [Delete Task](#delete-task)
- [Environment Variables](#environment-variables)
- [License](#license)

## Getting Started

### Prerequisites

- Node.js
- Docker (optional, for running in a container)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/express-tasks.git
   cd express-tasks
   ```
2. Install dependencies:
   
  ```bash
  npm install
  ```
 
3. Set up environment variables:

Create a .env file in the root directory and add the following:

``` env
PORT=8000
JWT_SECRET=your_jwt_secret
```

## Running the Application
To run the application locally:

```bash
npm run dev
```
To build and run the application using Docker:

## Build the Docker image:

``` bash
docker build -t express-tasks .
```
Run the Docker container:

``` bash
docker run -p 8000:8000 express-tasks
```
## API Endpoints
### Authentication
### Register

URL: /api/auth/register
Method: POST
Description: Register a new user.
Request Body:

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
Response:
201 Created: User successfully registered.
```
``` json
{
  "userId": 1
}
400 Bad Request: User already exists.
```
```json
{
  "message": "User with this username/email already exists"
}
500 Internal Server Error: Server error.
``` json
{
  "message": "Server error"
}
```
### Login
URL: /api/auth/login

Method: POST

Description: Login a user.

Request Body:

```json

{
  "email": "string",
  "password": "string"
}
Response:

200 OK: Login successful.
```
``` json
{
  "token": "string"
}
400 Bad Request: Invalid credentials.
```
```json
{
  "message": "Invalid credentials"
}
500 Internal Server Error: Server error.
```
```json
{
  "message": "Server error"
}
```
### Get User
URL: /api/auth/user

Method: GET

Description: Get the authenticated user's details.

Headers:

``` http
Authorization: Bearer <token>
Response:

200 OK: User details.
```
```json
{
  "username": "string",
  "email": "string"
}
401 Unauthorized: Invalid or missing token.
```
```json
{
  "message": "Unauthorized"
}
500 Internal Server Error: Server error.
```
``` json
{
  "message": "Server error"
}
```
## Tasks
### Create Task
URL: /api/tasks

Method: POST

Description: Create a new task.

Headers:

``` http
Authorization: Bearer <token>
Request Body:
```
``` json
{
  "title": "string",
  "description": "string",
  "due_date": "date"
}
Response:

201 Created: Task successfully created.
```
```json
{
  "taskId": 1
}
401 Unauthorized: Invalid or missing token.
```
``` json
{
  "message": "Unauthorized"
}
500 Internal Server Error: Server error.

```json
{
  "message": "Server error"
}
```
### Get Tasks
URL: /api/tasks

Method: GET

Description: Get all tasks for the authenticated user.

Headers:

``` http
Authorization: Bearer <token>
Response:

200 OK: List of tasks.
```
``` json
[
  {
    "id": 1,
    "title": "string",
    "description": "string",
    "due_date": "date",
    "completed": false
  }
]
401 Unauthorized: Invalid or missing token.
```
``` json
{
  "message": "Unauthorized"
}
500 Internal Server Error: Server error.
```
``` json
{
  "message": "Server error"
}
```
### Update Task
URL: /api/tasks/:id

Method: PUT

Description: Update a task.

Headers:

``` http
Authorization: Bearer <token>
Request Body:
```
``` json
{
  "title": "string",
  "description": "string",
  "due_date": "date",
  "completed": true
}
Response:

200 OK: Task successfully updated.
```
``` json
{
  "message": "Task updated"
}
401 Unauthorized: Invalid or missing token.
```
``` json
{
  "message": "Unauthorized"
}
404 Not Found: Task not found.
```
``` json
{
  "message": "Task not found"
}
500 Internal Server Error: Server error.
```
``` json
{
  "message": "Server error"
}
```
### Delete Task
URL: /api/tasks/:id

Method: DELETE

Description: Delete a task.

Headers:

```http
Authorization: Bearer <token>
Response:

200 OK: Task successfully deleted.
```
``` json
{
  "message": "Task deleted"
}
401 Unauthorized: Invalid or missing token.
```
``` json
{
  "message": "Unauthorized"
}
404 Not Found: Task not found.
```
``` json
{
  "message": "Task not found"
}
500 Internal Server Error: Server error.
```
``` json
{
  "message": "Server error"
}
```
Environment Variables
The application requires the following environment variables:

PORT: The port on which the server will run (default: 8000).
JWT_SECRET: The secret key for signing JWT tokens.
