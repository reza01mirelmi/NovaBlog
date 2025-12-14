# Blog Backend API

A production-ready Blog Backend API built with TypeScript, Node.js, Express, and MongoDB. This project implements the core backend functionality of a blogging platform with a clean MVC architecture, following real-world backend best practices. It includes authentication, role-based access control, author and admin workflows, and a complete post lifecycle with filtering, pagination, and image upload support.

## Tech Stack
- Node.js
- Express.js
- TypeScript
- MongoDB & Mongoose
- JWT Authentication

## Features
### Authentication & Authorization
- User registration and login using JWT
- Role-based access control (Admin / Author)
- Secure middlewares for token verification and admin-only routes
- Centralized error handling
- Input validation for all requests

### Author Management
- Authors can update their own profile information (name, email)
- Admins can view all authors, update author roles, and delete authors

### Post Management
- Full CRUD operations for blog posts
- Authors can create posts, view all of their own posts with any status, and delete their own posts
- Admins can view all posts, filter posts by title and status, apply pagination, update post publication status, and delete any post
- Guests (unauthenticated users) can only access published posts

### Additional Features
- Image upload support for posts
- MongoDB ObjectId validation
- Clean separation of concerns using MVC architecture
- Service layer for business logic

## Project Structure
src/
- controllers/ – Handle HTTP requests and responses  
- services/ – Business logic and domain rules  
- models/ – MongoDB schemas  
- routes/ – API route definitions  
- middlewares/ – Authentication, authorization, validation, and error handling  

postman/ – Postman collections and API documentation  
README.md

## Installation & Run
Clone the repository, install dependencies, and run the project in development mode:

git clone <repository-url>
cd project-folder
npm install
npm run dev
