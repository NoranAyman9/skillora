# Skillora - Online Course Platform API

## 📌 Project Overview

**Skillora** is a RESTful backend API for an online course platform.

The platform connects **students** and **instructors** through a backend system that allows instructors to create and manage educational courses and lessons, while students can enroll in courses, track their learning progress, comment on lessons, and rate courses.

The project was developed using **Node.js, Express.js, MongoDB, and Mongoose** and follows a clean and organized backend architecture.

---

# 🎯 Project Objectives

The main objectives of Skillora are:

* Build a complete RESTful backend API.
* Implement secure user authentication using JWT.
* Implement role-based authorization for Students and Instructors.
* Manage courses and lessons.
* Allow students to enroll in courses.
* Track student learning progress.
* Allow students to comment on lessons.
* Allow students to rate courses.
* Validate incoming requests.
* Handle errors centrally.
* Document APIs using Swagger.
* Test APIs using Jest and Supertest.
* Provide MongoDB aggregation for course statistics.
* Apply basic backend security practices.

---

# ✨ Features

## 🔐 Authentication

* User registration
* User login
* JWT authentication
* Get authenticated user profile
* Password hashing using bcrypt
* Role-based authorization
* Student role
* Instructor role
* Protected routes
* Instructor registration secret

---

## 📚 Course Management

Instructors can:

* Create courses
* Update courses
* Delete courses
* View course statistics

Users can:

* View all courses
* View a specific course
* Browse available courses

The course API also supports pagination.

---

## 📖 Lesson Management

Instructors can:

* Create lessons
* Update lessons
* Delete lessons

Users can:

* View lessons belonging to a course
* View a specific lesson

---

## 🎓 Enrollment

Students can:

* Enroll in courses
* View all courses they are enrolled in

---

## 💬 Comments

Authenticated users can:

* Add comments to lessons
* View lesson comments
* Update comments
* Delete comments

---

## ⭐ Ratings

Students can:

* Rate courses
* Update their existing rating
* View course ratings
* Delete their rating

Ratings use a scale from **1 to 5**.

---

## 📊 Progress Tracking

Students can:

* Mark lesson progress
* Update lesson completion
* View their progress in a course

---

## 📈 Course Statistics

Skillora uses **MongoDB Aggregation** to generate course statistics.

The statistics API provides:

* Total number of courses
* Average course price
* Minimum course price
* Maximum course price
* Number of courses in each category

---

# 🛠️ Technologies

| Technology         | Purpose               |
| ------------------ | --------------------- |
| Node.js            | JavaScript runtime    |
| Express.js         | Backend framework     |
| MongoDB            | Database              |
| Mongoose           | MongoDB ODM           |
| JWT                | Authentication        |
| bcrypt             | Password hashing      |
| express-validator  | Request validation    |
| Helmet             | Security headers      |
| CORS               | Cross-origin requests |
| express-rate-limit | Rate limiting         |
| Swagger            | API documentation     |
| Jest               | Testing               |
| Supertest          | API testing           |

---

# 🏗️ Project Architecture

The project follows a modular backend architecture.

```text
Online Course Platform
│
├── src
│   │
│   ├── app.js
│   │
│   ├── config
│   │   ├── db.js
│   │   └── swagger.js
│   │
│   ├── controllers
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── lessonController.js
│   │   ├── enrollmentController.js
│   │   ├── commentController.js
│   │   ├── ratingController.js
│   │   └── progressController.js
│   │
│   ├── models
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Lesson.js
│   │   ├── Enrollment.js
│   │   ├── Comment.js
│   │   ├── Rating.js
│   │   └── Progress.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── lessonRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── ratingRoutes.js
│   │   └── progressRoutes.js
│   │
│   ├── middlewares
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── validateMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── validators
│   │   ├── authValidator.js
│   │   ├── courseValidator.js
│   │   ├── lessonValidator.js
│   │   └── commentValidator.js
│   │
│   └── tests
│       └── auth.test.js
│
├── server.js
├── package.json
├── .env
├── .env.example
├── README.md
└── Postman Collection
```

---

# 🗄️ Database Design

Skillora uses **MongoDB** with **Mongoose**.

The main collections are:

```text
User
 │
 ├── Courses
 ├── Enrollments
 ├── Comments
 ├── Ratings
 └── Progress

Course
 │
 ├── Lessons
 ├── Enrollments
 ├── Comments
 ├── Ratings
 └── Progress
```

### Main Relationships

* A user can have one role: `student` or `instructor`.
* An instructor can create multiple courses.
* A course can contain multiple lessons.
* A student can enroll in multiple courses.
* A course can have multiple enrolled students.
* A lesson can have multiple comments.
* A course can have multiple ratings.
* A student can track progress for lessons in enrolled courses.

---

# 🔑 Authentication

Skillora uses **JWT (JSON Web Token)** for authentication.

After successful login, the server returns a JWT token.

Protected endpoints require:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Example:

```text
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

# 👥 User Roles

## Student

Students can:

* Browse courses
* Enroll in courses
* View enrolled courses
* View lessons
* Track lesson progress
* Comment on lessons
* Rate courses

## Instructor

Instructors can:

* Create courses
* Update courses
* Delete courses
* Create lessons
* Update lessons
* Delete lessons
* View course statistics

---

# 🌐 API Base URL

For local development:

```text
http://localhost:5000
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint             | Description              | Access        |
| ------ | -------------------- | ------------------------ | ------------- |
| POST   | `/api/auth/register` | Register a new user      | Public        |
| POST   | `/api/auth/login`    | Login user               | Public        |
| GET    | `/api/auth/profile`  | Get current user profile | Authenticated |

---

## Courses

| Method | Endpoint                  | Description           | Access     |
| ------ | ------------------------- | --------------------- | ---------- |
| GET    | `/api/courses`            | Get all courses       | Public     |
| GET    | `/api/courses/:id`        | Get course by ID      | Public     |
| GET    | `/api/courses/statistics` | Get course statistics | Instructor |
| POST   | `/api/courses`            | Create course         | Instructor |
| PUT    | `/api/courses/:id`        | Update course         | Instructor |
| DELETE | `/api/courses/:id`        | Delete course         | Instructor |

---

## Lessons

| Method | Endpoint                         | Description        | Access     |
| ------ | -------------------------------- | ------------------ | ---------- |
| POST   | `/api/courses/:courseId/lessons` | Create lesson      | Instructor |
| GET    | `/api/courses/:courseId/lessons` | Get course lessons | Public     |
| GET    | `/api/lessons/:id`               | Get lesson by ID   | Public     |
| PUT    | `/api/lessons/:id`               | Update lesson      | Instructor |
| DELETE | `/api/lessons/:id`               | Delete lesson      | Instructor |

---

## Enrollments

| Method | Endpoint                        | Description           | Access  |
| ------ | ------------------------------- | --------------------- | ------- |
| POST   | `/api/courses/:courseId/enroll` | Enroll in course      | Student |
| GET    | `/api/enrollments/my-courses`   | Get student's courses | Student |

---

## Comments

| Method | Endpoint                          | Description         | Access        |
| ------ | --------------------------------- | ------------------- | ------------- |
| POST   | `/api/lessons/:lessonId/comments` | Create comment      | Authenticated |
| GET    | `/api/lessons/:lessonId/comments` | Get lesson comments | Public        |
| PUT    | `/api/comments/:id`               | Update comment      | Authenticated |
| DELETE | `/api/comments/:id`               | Delete comment      | Authenticated |

---

## Ratings

| Method | Endpoint                         | Description             | Access  |
| ------ | -------------------------------- | ----------------------- | ------- |
| POST   | `/api/courses/:courseId/ratings` | Create or update rating | Student |
| GET    | `/api/courses/:courseId/ratings` | Get course ratings      | Public  |
| DELETE | `/api/ratings/:id`               | Delete rating           | Student |

---

## Progress

| Method | Endpoint                          | Description            | Access  |
| ------ | --------------------------------- | ---------------------- | ------- |
| PUT    | `/api/lessons/:lessonId/progress` | Update lesson progress | Student |
| GET    | `/api/courses/:courseId/progress` | Get course progress    | Student |

---

# 📚 Swagger API Documentation

Interactive API documentation is available through Swagger UI.

Start the server and open:

```text
http://localhost:5000/api-docs
```

Swagger provides documentation for all API endpoints and allows API requests to be tested directly from the browser.

### Using JWT in Swagger

1. Login using:

```text
POST /api/auth/login
```

2. Copy the returned JWT token.

3. Click **Authorize**.

4. Enter:

```text
Bearer YOUR_JWT_TOKEN
```

5. Click **Authorize**.

Protected endpoints can now be tested directly through Swagger.

---

# 📮 Postman Collection

A Postman Collection is included with the project.

The collection documents and tests all API endpoints.

It contains the following folders:

```text
Skillora API
│
├── Authentication
├── Courses
├── Lessons
├── Enrollments
├── Comments
├── Ratings
└── Progress
```

The collection contains all **25 API endpoints**.

---

# 🧪 API Testing

The project uses **Jest** and **Supertest** for automated API testing.

Run the tests using:

```bash
npm test
```

Example test areas include:

* Root API response
* Authentication validation
* Login validation

API endpoints are also tested through the provided Postman Collection.

---

# ✅ Endpoint Testing

All API endpoints should be tested through Postman before final submission.

The testing process includes:

### Authentication

```text
Register
Login
Get Profile
```

### Courses

```text
Create Course
Get Courses
Get Course By ID
Get Statistics
Update Course
Delete Course
```

### Lessons

```text
Create Lesson
Get Course Lessons
Get Lesson
Update Lesson
Delete Lesson
```

### Enrollments

```text
Enroll in Course
Get My Courses
```

### Comments

```text
Create Comment
Get Comments
Update Comment
Delete Comment
```

### Ratings

```text
Create Rating
Update Rating
Get Ratings
Delete Rating
```

### Progress

```text
Update Progress
Get Course Progress
```

---

# ✔️ Request Validation

The project uses `express-validator` to validate incoming requests.

Validation is implemented for:

* Registration
* Login
* Course creation
* Lesson creation
* Comments

Invalid data is rejected with appropriate HTTP status codes and error messages.

---

# ⚠️ Error Handling

The project uses centralized error-handling middleware.

Common HTTP status codes:

| Status | Meaning                        |
| ------ | ------------------------------ |
| 200    | Successful request             |
| 201    | Resource created               |
| 400    | Bad request / validation error |
| 401    | Unauthorized                   |
| 403    | Forbidden                      |
| 404    | Resource not found             |
| 409    | Conflict                       |
| 500    | Internal server error          |

---

# 🔒 Security

Skillora includes several security features.

### JWT Authentication

Used to authenticate users and protect private routes.

### Password Hashing

Passwords are hashed using `bcrypt` before being stored.

### Helmet

Helmet adds security-related HTTP headers.

### CORS

CORS is configured for cross-origin API requests.

### Rate Limiting

The API uses `express-rate-limit` to limit excessive requests.

### Role-Based Authorization

Protected operations are restricted based on user roles.

---

# 📊 MongoDB Aggregation

The project uses MongoDB Aggregation for course statistics.

Endpoint:

```http
GET /api/courses/statistics
```

The endpoint calculates:

```text
Total Courses
Average Price
Minimum Price
Maximum Price
Courses by Category
```

Only instructors can access this endpoint.

---

# ⚙️ Installation

## Prerequisites

Before running the project, make sure you have installed:

* Node.js
* npm
* MongoDB or a MongoDB Atlas account
* Git

---

## 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Then enter the project directory:

```bash
cd "Online Course Platform"
```

---

## 2. Install Dependencies

Run:

```bash
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root.

Use `.env.example` as a reference.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
INSTRUCTOR_SECRET=your_instructor_secret
```

### Environment Variables

| Variable            | Description                             |
| ------------------- | --------------------------------------- |
| `PORT`              | Server port                             |
| `MONGO_URI`         | MongoDB connection string               |
| `JWT_SECRET`        | Secret used for JWT                     |
| `INSTRUCTOR_SECRET` | Secret used for instructor registration |

### Important

Do not upload the real `.env` file to GitHub.

The repository should contain:

```text
.env.example
```

instead of the real environment secrets.

---

# ▶️ Running the Application

Start the server using:

```bash
npm start
```

or:

```bash
node server.js
```

For this project, development mode also runs:

```bash
npm run dev
```

The server will run on:

```text
http://localhost:5000
```

---

# 🧪 Running Tests

Run automated tests using:

```bash
npm test
```

---

# 📁 Important Files

| File                    | Purpose                                                      |
| ----------------------- | ------------------------------------------------------------ |
| `server.js`             | Starts the application and connects to MongoDB               |
| `src/app.js`            | Express application configuration                            |
| `src/config/db.js`      | MongoDB connection                                           |
| `src/config/swagger.js` | Swagger configuration                                        |
| `src/controllers`       | Business logic                                               |
| `src/models`            | Mongoose database models                                     |
| `src/routes`            | API routes                                                   |
| `src/middlewares`       | Authentication, authorization, validation and error handling |
| `src/validators`        | Request validation                                           |
| `src/tests`             | Automated tests                                              |

---

# 📝 NPM Scripts

```bash
npm start
```

Starts the production server.

```bash
npm run dev
```

Runs the server using the project's development script.

```bash
npm test
```

Runs Jest tests.

---

# 🔄 API Request Flow

A typical protected request follows this flow:

```text
Client
  ↓
Route
  ↓
Authentication Middleware
  ↓
Role Middleware
  ↓
Validation Middleware
  ↓
Controller
  ↓
Model
  ↓
MongoDB
  ↓
Response
```

For example:

```text
Student
  ↓
POST /api/courses/:courseId/enroll
  ↓
JWT Authentication
  ↓
Student Role Check
  ↓
Enrollment Controller
  ↓
Enrollment Model
  ↓
MongoDB
  ↓
Success Response
```

---

# 🗃️ Database Models

The application contains the following main models:

### User

Stores:

* Name
* Email
* Password
* Role

### Course

Stores course information such as:

* Title
* Description
* Price
* Category
* Instructor

### Lesson

Stores lesson information and its related course.

### Enrollment

Connects students with courses.

### Comment

Stores comments associated with lessons and users.

### Rating

Stores course ratings created by students.

### Progress

Stores student learning progress for lessons.

---

# 🚀 Extra Features

Beyond the core backend requirements, Skillora includes:

* Swagger API documentation
* MongoDB Aggregation
* Rate limiting
* Helmet security
* CORS configuration
* Automated authentication tests
* Centralized error handling
* Request validation
* Role-based access control

---

# 📌 Project Requirements Checklist

The project fulfills the following submission requirements:

* [x] Full backend source code
* [x] Clean project structure
* [x] README documentation
* [x] Installation instructions
* [x] Environment variables example
* [x] RESTful API endpoints
* [x] JWT authentication
* [x] Role-based authorization
* [x] Request validation
* [x] Error handling
* [x] Swagger documentation
* [x] MongoDB Aggregation
* [x] Jest and Supertest testing
* [ ] Postman Collection
* [ ] Testing all endpoints
* [ ] GitHub repository
* [ ] Meaningful Git commit history

The remaining items should be completed before final submission.

---

# 👩‍💻 Author

**Noran Ayman**

Menoufia National University
Faculty of Computers and Artificial Intelligence
Data Science Department

---

# 📄 Project Type

**ITI Node.js + Express + MongoDB Individual Final Project**

**Project:** Skillora - Online Course Platform API
