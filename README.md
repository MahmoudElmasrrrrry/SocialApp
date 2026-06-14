# 🌐 Social App

A real-time social networking REST API built with **Express 5**, **TypeScript**, **MongoDB**, and **Socket.IO**. The application supports user authentication with OTP email verification, friend requests, real-time one-to-one and group chat messaging.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Socket.IO Events](#-socketio-events)
- [Database Models](#-database-models)
- [Middleware](#-middleware)
- [Utilities](#-utilities)
- [Error Handling](#-error-handling)

---

## ✨ Features

- **User Authentication** — Signup, login, JWT-based access & refresh tokens
- **Email Verification** — OTP-based email confirmation via Nodemailer (Gmail SMTP)
- **Password Recovery** — Forgot password & reset password with OTP
- **Friend System** — Send & accept friend requests
- **Real-time Chat** — One-to-one private messaging via Socket.IO
- **Group Chat** — Create group chats, join rooms, and send group messages in real-time
- **Input Validation** — Request validation using Zod schemas
- **Repository Pattern** — Abstract database layer with generic repository class
- **Event-Driven Emails** — Decoupled email sending using Node.js EventEmitter

---

## 🛠 Tech Stack

| Technology   | Purpose                          |
| ------------ | -------------------------------- |
| **Express 5**    | HTTP server & REST API framework |
| **TypeScript**   | Type-safe JavaScript             |
| **MongoDB**      | NoSQL database                   |
| **Mongoose**     | MongoDB ODM                      |
| **Socket.IO**    | Real-time WebSocket communication|
| **JWT**          | Authentication tokens            |
| **bcrypt**       | Password hashing                 |
| **Zod**          | Request body validation          |
| **Nodemailer**   | Email sending (SMTP)             |
| **nanoid**       | OTP code generation              |
| **CORS**         | Cross-Origin Resource Sharing    |

---

## 🏗 Project Architecture

The project follows a **layered architecture** with clear separation of concerns:

```
Controller → Service → Repository → Model (MongoDB)
```

- **Controller** — Defines Express routes and maps them to service methods
- **Service** — Contains business logic
- **Repository** — Abstract database access layer (`DBRepo<T>` base class)
- **Model** — Mongoose schemas and TypeScript interfaces

Real-time functionality uses a **Gateway pattern**:

```
Socket.IO Gateway → Chat Events → Chat Socket Service → Repository
```

---

## 📁 Folder Structure

```
src/
├── index.ts                        # Entry point — calls bootstrap()
├── bootstrap.ts                    # App setup (Express, routes, DB, Socket.IO)
│
├── DB/
│   ├── config/
│   │   └── connectDB.ts            # MongoDB connection
│   ├── models/
│   │   ├── user.model.ts           # User Mongoose schema
│   │   ├── chat.model.ts           # Chat & Message Mongoose schemas
│   │   └── friendRequest.model.ts  # Friend Request Mongoose schema
│   ├── repos/
│   │   ├── user.repo.ts            # User repository (extends DBRepo)
│   │   ├── chat.repo.ts            # Chat repository (extends DBRepo)
│   │   └── friendRequest.repo.ts   # Friend Request repository (extends DBRepo)
│   └── DBRepo.ts                   # Abstract generic repository base class
│
├── modules/
│   ├── routes.ts                   # Main router — mounts auth & chat routes
│   ├── authModules/
│   │   ├── auth.controller.ts      # Auth route definitions
│   │   ├── auth.service.ts         # Auth business logic (signup, login, OTP, friends)
│   │   ├── auth.validation.ts      # Zod validation schemas
│   │   └── auth.DTO.ts             # TypeScript DTOs inferred from Zod schemas
│   ├── chatModules/
│   │   ├── chat.controller.ts      # Chat REST route definitions
│   │   ├── chat.service.ts         # Chat business logic (get/create chats, groups)
│   │   ├── chat.gatway.ts          # Chat gateway — registers socket events
│   │   ├── chat.socket.events.ts   # Socket event listeners
│   │   └── chat.socket.service.ts  # Socket event handlers (send message, join room)
│   ├── gatway/
│   │   └── gatway.ts               # Socket.IO server initialization & auth middleware
│   └── userModules/
│       └── user.types.ts           # IUser interface & HUserDocument type
│
├── middleware/
│   ├── auth.middleware.ts          # JWT authentication & token decoding middleware
│   └── validation.middleware.ts    # Zod schema validation middleware
│
└── utils/
    ├── successHandler.ts           # Standardized success response helper
    ├── email/
    │   ├── sendEmail.ts            # Nodemailer transporter & email sender
    │   ├── email.events.ts         # EventEmitter-based email event system
    │   ├── generateHTML.ts         # HTML email template with OTP
    │   └── createOTP.ts            # 6-digit OTP generator using nanoid
    ├── errors/
    │   └── types.ts                # Custom error classes (ApplicationError, etc.)
    └── security/
        ├── hash.ts                 # bcrypt hash & compare utilities
        └── token.ts                # JWT sign & verify utilities
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v20+ recommended)
- **MongoDB** (local or cloud instance)
- **TypeScript** (installed globally or via devDependencies)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MahmoudElmasrrrrry/SocialApp.git
cd SocialApp

# 2. Install dependencies
npm install

# 3. Create a .env file (see Environment Variables section below)

# 4. Compile TypeScript
tsc

# 5. Start the development server
npm run start:dev
```

### Available Scripts

| Script          | Command                                                  | Description                                |
| --------------- | -------------------------------------------------------- | ------------------------------------------ |
| `start:dev`     | `node --env-file=.env --watch ./dist/index.js`           | Start dev server with auto-reload          |
| `start:conc`    | `concurrently "tsc --watch" "npm run start:dev"`         | Watch TypeScript & restart server together |

---

## ⚙️ Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Server
PORT=3000

# Database
MONGO_URI=mongodb://0.0.0.0:27017/SocialAppDB

# Email (Gmail SMTP)
HOST=smtp.gmail.com
PORT_EMAIL=465
USER_EMAIL=your-email@gmail.com
PASS_EMAIL=your-app-password

# JWT Secrets
ACCESS_TOKEN_SIGNATURE=your-access-token-secret
REFRESH_TOKEN_SIGNATURE=your-refresh-token-secret
BEARER=Bearer
```

> **Note:** For Gmail, you need to generate an [App Password](https://support.google.com/accounts/answer/185833) (2FA must be enabled).

---

## 📡 API Endpoints

Base URL: `http://localhost:3000/api/v1`

### 🔐 Authentication

| Method    | Endpoint                          | Auth | Description                   |
| --------- | --------------------------------- | ---- | ----------------------------- |
| `POST`    | `/auth/signup`                    | ❌   | Register a new user           |
| `PATCH`   | `/auth/confirm-email`             | ❌   | Confirm email with OTP        |
| `PATCH`   | `/auth/resend-email-otp`          | ❌   | Resend email verification OTP |
| `POST`    | `/auth/login`                     | ❌   | Login & get tokens            |
| `GET`     | `/auth/get-me`                    | ✅   | Get authenticated user profile|
| `POST`    | `/auth/refresh-token`             | ❌   | Refresh the access token      |
| `POST`    | `/auth/forgot-password`           | ❌   | Request password reset OTP    |
| `PATCH`   | `/auth/reset-password`            | ❌   | Reset password with OTP       |

### 👥 Friends

| Method    | Endpoint                              | Auth | Description              |
| --------- | ------------------------------------- | ---- | ------------------------ |
| `PATCH`   | `/auth/friend-request`                | ✅   | Send a friend request    |
| `PATCH`   | `/auth/accept-friend-request/:id`     | ✅   | Accept a friend request  |

### 💬 Chat (REST)

| Method    | Endpoint                                  | Auth | Description                     |
| --------- | ----------------------------------------- | ---- | ------------------------------- |
| `GET`     | `/auth/:id/chat/`                         | ✅   | Get or create a one-to-one chat |
| `POST`    | `/auth/:id/chat/create-group`             | ✅   | Create a new group chat         |
| `GET`     | `/auth/:id/chat/get-group-chat/:groupId`  | ✅   | Get group chats for the user    |

### Request / Response Examples

#### Signup

```json
// POST /api/v1/auth/signup
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "secret123",
  "confirmPassword": "secret123",
  "age": 25,               // optional
  "phoneNumber": "0123456789" // optional
}
```

#### Confirm Email

```json
// PATCH /api/v1/auth/confirm-email
{
  "email": "john@example.com",
  "otp": "482916"
}
```

#### Login

```json
// POST /api/v1/auth/login
{
  "email": "john@example.com",
  "password": "secret123"
}

// Response
{
  "message": "Success",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

#### Send Friend Request

```json
// PATCH /api/v1/auth/friend-request
// Headers: Authorization: Bearer <access_token>
{
  "to": "60f7b2c..."  // recipient user ID
}
```

#### Create Group Chat

```json
// POST /api/v1/auth/:id/chat/create-group
// Headers: Authorization: Bearer <access_token>
{
  "group": "My Group Name",
  "participants": ["userId1", "userId2"]
}
```

---

## 🔌 Socket.IO Events

Connect to the Socket.IO server at the same host/port as the HTTP server. Authentication is required via the handshake:

```javascript
const socket = io("http://localhost:3000", {
  auth: {
    authorization: "Bearer <access_token>"
  }
});
```

### Client → Server (Emit)

| Event               | Payload                                          | Description                      |
| -------------------- | ------------------------------------------------ | -------------------------------- |
| `sendMessage`        | `{ content: string, sendTo: string }`            | Send a private message           |
| `join_room`          | `{ roomId: string }`                             | Join a group chat room           |
| `sendGroupMessage`   | `{ content: string, groupId: string }`           | Send a message to a group chat   |

### Server → Client (Listen)

| Event              | Payload                                            | Description                        |
| ------------------- | -------------------------------------------------- | ---------------------------------- |
| `successMessage`    | `string` (content)                                 | Confirmation that message was sent |
| `newMessage`        | `{ content: string, from: { _id: string } }`      | Receive a new private message      |
| `newMessage`        | `{ content: string, from: User, groupId: string }`| Receive a new group message        |
| `customError`       | `Error`                                            | Socket error notification          |

---

## 🗄 Database Models

### User

| Field                  | Type           | Description                         |
| ---------------------- | -------------- | ----------------------------------- |
| `firstName`            | `String`       | Required                            |
| `lastName`             | `String`       | Required                            |
| `email`                | `String`       | Required, unique                    |
| `password`             | `String`       | Required, bcrypt hashed             |
| `age`                  | `Number`       | Required                            |
| `phoneNumber`          | `String`       | Required                            |
| `isVerified`           | `Boolean`      | Default: `false`                    |
| `emailOTP`             | `Object`       | `{ otp: String, expireTime: Date }` |
| `resetPasswordOTP`     | `Object`       | `{ otp: String, expireTime: Date }` |
| `changeCredentialsDate`| `Date`         | Updated on password reset           |
| `friends`              | `[ObjectId]`   | Ref: `users`                        |
| `folderId`             | `String`       | Optional folder identifier          |
| `timestamps`           | auto           | `createdAt`, `updatedAt`            |

### Chat

| Field           | Type           | Description                              |
| --------------- | -------------- | ---------------------------------------- |
| `participants`  | `[ObjectId]`   | Ref: `users`, required                   |
| `messages`      | `[Message]`    | Embedded subdocument array               |
| `group`         | `String`       | Group name (exists only for group chats) |
| `groupImage`    | `String`       | Optional group avatar                    |
| `roomId`        | `String`       | Socket.IO room identifier               |
| `createdBy`     | `ObjectId`     | Ref: `users`, required                   |
| `timestamps`    | auto           | `createdAt`, `updatedAt`                 |

### Message (embedded in Chat)

| Field        | Type        | Description              |
| ------------ | ----------- | ------------------------ |
| `createdBy`  | `ObjectId`  | Ref: `users`, required   |
| `content`    | `String`    | Required                 |
| `timestamps` | auto        | `createdAt`, `updatedAt` |

### FriendRequest

| Field        | Type        | Description                            |
| ------------ | ----------- | -------------------------------------- |
| `from`       | `ObjectId`  | Ref: `users`, required                 |
| `to`         | `ObjectId`  | Ref: `users`, required                 |
| `acceptedAt` | `Date`      | Set when request is accepted           |
| `timestamps` | auto        | `createdAt`, `updatedAt`               |

---

## 🛡 Middleware

### Authentication (`auth.middleware.ts`)

- Extracts JWT from `Authorization` header (`Bearer <token>`)
- Verifies token against `ACCESS_TOKEN_SIGNATURE` or `REFRESH_TOKEN_SIGNATURE`
- Looks up the user in the database and checks `isVerified`
- Attaches user document to `res.locals.user`

### Validation (`validation.middleware.ts`)

- Accepts a **Zod schema** and validates the merged body/params/query
- Returns `422 Unprocessable Entity` with detailed validation errors on failure

---

## 🔧 Utilities

| Utility               | File                        | Description                                            |
| --------------------- | --------------------------- | ------------------------------------------------------ |
| **hashPassword**      | `utils/security/hash.ts`    | Hash a password with bcrypt (10 salt rounds)            |
| **comparePassword**   | `utils/security/hash.ts`    | Compare plain text password against hash                |
| **generateToken**     | `utils/security/token.ts`   | Sign a JWT with payload, secret, and options            |
| **verifyToken**       | `utils/security/token.ts`   | Verify and decode a JWT                                 |
| **createOTP**         | `utils/email/createOTP.ts`  | Generate a 6-digit numeric OTP using nanoid             |
| **sendEmail**         | `utils/email/sendEmail.ts`  | Send an email via Gmail SMTP using Nodemailer           |
| **template**          | `utils/email/generateHTML.ts`| Generate a styled HTML email with OTP                  |
| **EmailEvent**        | `utils/email/email.events.ts`| Event-driven email system (publish/subscribe pattern)  |
| **successHandler**    | `utils/successHandler.ts`   | Standardized JSON success response `{ message, data }` |

---

## ❌ Error Handling

The app uses a centralized error handler middleware with custom error classes:

| Error Class                   | Status Code | Default Message        |
| ----------------------------- | ----------- | ---------------------- |
| `ApplicationError`            | Custom      | Custom message         |
| `NotFoundException`           | `404`       | Not Found              |
| `ExpiredException`            | `400`       | OTP Expired            |
| `NotValidOTPException`        | `400`       | Not Valid OTP          |
| `InvalidCredentialsException` | `401`       | Invalid Credentials    |
| `InvalidTokenException`       | `401`       | Invalid Token          |
| `NotVerifiedException`        | `403`       | User Not Verified      |

All unhandled errors return a JSON response:

```json
{
  "msg": "Error message",
  "stack": "Error stack trace",
  "status": 500
}
```

---

## 📄 License

ISC

---

> Built with ❤️ using TypeScript, Express, MongoDB & Socket.IO
