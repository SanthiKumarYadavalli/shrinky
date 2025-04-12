
# Shrinky

Shrinky is a self-hosted URL shortening service that allows users to shorten long URLs for easier sharing and tracking. This project comprises a backend built with Node.js and Express, and a frontend developed using React and TypeScript.

## Live Demo

You can try out Shrinky at [https://shrinky-client.vercel.app](https://shrinky-client.vercel.app)


## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Features

- Shorten long URLs to concise, shareable links.
- Track analytics such as click counts, user IPs, and user agents.
- Dashboard to manage and monitor shortened URLs.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/SanthiKumarYadavalli/shrinky.git
   cd shrinky
   ```

2. **Backend Setup:**

   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup:**

   ```bash
   cd ../frontend
   npm install
   ```

## Usage

### Running the Backend

1. **Set Environment Variables:**

   Create a `.env` file in the `backend` directory with the following content:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

   Replace `your_mongodb_connection_string` with your MongoDB connection string and `your_jwt_secret` with a secret key for JWT authentication.

2. **Start the Backend Server:**

   ```bash
   cd backend
   npm run dev
   ```

   The backend server will run on `http://localhost:5000`.

### Running the Frontend

1. **Start the Frontend Development Server:**

   ```bash
   cd frontend
   npm run dev
   ```

   The frontend will be accessible at `http://localhost:8080`.

## API Endpoints

The backend exposes the following API endpoints:

- `POST /api/user/register`: Register a new user.
- `POST /api/user/login`: Authenticate a user and return a token.
- `POST /api/url`: Shorten a new URL (requires authentication).
- `GET /api/url`: Retrieve all shortened URLs for the authenticated user.
- `GET /:shortCode`: Redirect to the original URL associated with the `shortCode`.

Refer to the backend code for more detailed information on request and response structures.
