# Task Duty - Backend

## Environment Variables
Create a `.env` file in the server folder with:
```
PORT=8090
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
```
Built with Node.js + Express + MongoDB


## Prerequisites
- Node.js
- MongoDB Atlas account

## Run the Backend
```bash
npm install
npm run dev
```

## API Endpoints
- GET /tasks - Get all tasks
- GET /tasks/:id - Get single task
- POST /tasks - Create task
- PUT /tasks/:id - Update task
- DELETE /tasks/:id - Delete task

## Tech Stack
- Node.js, Express, TypeScript, MongoDB, Mongoose