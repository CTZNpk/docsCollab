# Document Collaboration App

A real-time collaborative document editor where multiple users can work together on documents simultaneously. This project is built with a **React** frontend (powered by Vite and styled with TailwindCSS) and a **Go** backend that uses WebSockets for live updates and PostgreSQL for data persistence.

## Features

- **Real-time Collaboration:** Multiple users can edit the same document simultaneously using WebSockets.
- **Operational Transform:** Implemented Operational Tranform for Document Collaboration
- **Authentication & Authorization:** Secure user login and role-based access control.
- **Responsive Interface:** Modern, responsive design built with React and TailwindCSS.
- **Modular Architecture:** Clean separation of frontend and backend code.
- **SQL Migrations:** Database migrations managed via SQL scripts and sqlc for type-safe queries.

## Directory Structure

```plaintext
ctznpk-docscollab/
├── frontend/             # React/Vite frontend application
│   ├── public/           # Static assets and the main HTML file
│   ├── src/              # Application source code
│   │   ├── api/          # API client and service modules
│   │   ├── components/   # Reusable React components
│   │   ├── hooks/        # Custom React hooks (e.g., for authentication, WebSockets)
│   │   ├── screens/      # Page-level components/screens
│   │   └── store/        # Global state management
│   ├── package.json      # Frontend dependencies and scripts
│   └── README.md         # Frontend-specific README
└── server/               # Go backend server
    ├── cmd/              # Application entry point(s)
    │   └── server/
    │       └── main.go   # Main server file
    ├── db/               # Database migrations and SQL queries
    │   ├── migrations/   # SQL migration scripts
    │   └── queries/      # SQL query definitions
    ├── internal/         # Application internal packages
    │   ├── config/       # Configuration setup
    │   ├── database/     # Database connection and models
    │   ├── handlers/     # HTTP and WebSocket handlers
    │   ├── middlewares/  # Request middleware (authentication, logging, etc.)
    │   ├── realtime/     # Real-time document collaboration via WebSocket
    │   ├── services/     # Business logic and service layers
    │   └── utils/        # Utility functions
    └── vendor/           # Vendored third-party dependencies

```
## Getting Started
Prerequisites
- Node.js (v14+ recommended) – for the frontend
- Go (v1.16+ recommended) – for the backend
- PostgreSQL – as the database engine
- Docker (optional) – for containerized deployment

## Setup and Installation
  ## Frontend
  Navigate to the frontend directory:
```
cd ctznpk-docscollab/frontend
```

Install dependencies:
```
npm install
```
Run the development server:
```
    npm run dev
```
  Access the app:
    Open your browser and go to http://localhost:3000

## Backend
  Navigate to the server directory:
```
cd ctznpk-docscollab/server
```
Set up Environment Variables:

Create a .env file in the server directory with your configuration. Example:
```
DB_URL=postgresql://useer_name:pass@localhost:5432/your_db?sslmode=disable
```
Run Database Migrations:

Use your preferred migration tool to apply the migrations in the db/migrations folder. For example, using a goose tool:
```
goose -dir db/migrations postgres "postgres://your_username:your_password@localhost:5432/your_database?sslmode=disable" up
```
Start the Go Server:
```
go run cmd/server/main.go
```
The backend should now be running (by default on port 8080).
