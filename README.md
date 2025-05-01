# Connectt: Real-time Chat Application

A modern, secure, and intuitive real-time chat application built with React, TypeScript, Socket.io, Express, and MongoDB.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Project Structure](#project-structure)
  - [Backend Structure](#backend-structure)
  - [Frontend Structure](#frontend-structure)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

Connectt is a feature-rich chat application that enables real-time communication between users. It provides a smooth user experience with message delivery notifications, online status indicators, and secure end-to-end message delivery.

## Features

- Real-time messaging using Socket.io
- User authentication and authorization
- Online/offline status indicators
- Message read receipts
- Responsive design for mobile and desktop
- Secure password storage with bcrypt
- JWT-based authentication
- Message history management

## Project Structure

### Backend Structure

```
backend/
├── src/
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── socket/             # Socket.io implementation
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── app.ts              # Express app setup
├── .env                    # Environment variables
├── package.json            # Project dependencies
└── tsconfig.json           # TypeScript configuration
```

### Frontend Structure

```
realtime-chat-frontend/
├── public/                 # Static files
├── src/
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── services/           # API service functions
│   ├── store/              # Zustand state management
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application component
│   └── index.tsx           # Application entry point
├── .env                    # Environment variables
├── package.json            # Project dependencies
└── tsconfig.json           # TypeScript configuration
```

## Technologies Used

### Backend
- Node.js
- Express.js
- TypeScript
- Socket.io
- MongoDB (Mongoose)
- JWT authentication
- bcrypt

### Frontend
- React
- TypeScript
- Material UI
- Socket.io-client
- Axios
- Zustand (State management)
- React Router

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local instance or MongoDB Atlas account)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/realtime-chat.git
cd realtime-chat
```
2. Install backend dependencies
```bash
cd backend
npm install
```
3. Install frontend dependencies
```bash
cd ../realtime-chat-frontend
npm install
```

### Running the Application

1. Start the backend server by opening 2 terminals
```bash
npx tsc -w
```
```bash
cd backend
npm run dev
```

2. Start the frontend development server
```bash
cd ../realtime-chat-frontend
npm run dev
```

3. Access the application in your browser at `http://localhost:3000`

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/connectt
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=24h
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

## API Documentation

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login a user
- `GET /api/v1/auth/profile` - Get current user profile
- `GET /api/v1/auth/logout` - Logout the user


### Chats and Messages
- `POST /api/v1/chat/load-users` - Get messages for a chat
- `POST /api/v1/chat/get-messages` - Send a new message
- `POST /api/v1/chat/get-current-message` - Mark message as read

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

![Alt Data-modelling](https://github.com/KanishkRastogi46/realtime-chat-connectt/blob/main/backend/public/db-modelling.png)
