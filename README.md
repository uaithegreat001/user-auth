# User Authentication System

A fullstack authentication system built to apply layered architecture, component-based design, and security best practices in a real project by learning and building step by step.

## Overview
User authentication covers account creation, login, and password reset, the core flow for verifying and validating users before they can access a system.

## Project Vision
This project applies software engineering principles and technical skills in practice reusability, scalability, and security. What I've learned in theory, to implement it in real working system.

## Project Structure
```
user-auth/
├── client/     → React frontend (component-based design)
└── server/     → Express backend (layered architecture)
```

## Tech Stack
- **React.js:** for building an interactive, dynamic user interface
- **Tailwind CSS:** for fast, consistent, utility-first styling
- **Node.js / Express.js:** for building a robust backend RESTful API
- **Security:** express-validator, express-rate-limit, helmet, cors, and schema-level validation at the database layer

## Getting Started

### Backend
```bash
cd server
npm install
cp .env 
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Documentations
- [Architecture](./docs/ARCHITECTURE.md)
- [Security](./docs/SECURITY.md)
- [Design Decisions](./docs/DESIGN_DECISIONS.md)
- [Changelog](./CHANGELOG.md)