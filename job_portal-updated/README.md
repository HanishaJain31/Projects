# HireNest Job Portal

HireNest is a full-stack job portal application with separate React client and Express/MySQL server apps. It supports job browsing, user registration and login, job applications, profile management, and admin tools for managing jobs, users, and applications.

## Features

- User signup and login with protected routes
- Browse jobs and view job details
- Apply for jobs with uploaded documents
- View and manage user applications
- User profile, edit profile, and change password screens
- Admin dashboard for users, jobs, and applications
- Create, edit, view, and delete job postings
- API request/response encryption helpers
- Light and dark theme support
- Multilingual server message files

## Tech Stack

### Client

- React
- Vite
- React Router
- Redux Toolkit
- Axios
- Styled Components
- Bootstrap
- React Hook Form
- React Hot Toast

### Server

- Node.js
- Express
- MySQL2
- JWT
- bcrypt
- multer
- Joi
- dotenv

## Project Structure

```text
job_portal-updated/
  client/   React/Vite frontend
  server/   Express/MySQL backend
```

## Environment Variables

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_API_KEY=your_api_key
VITE_SHA_KEY=your_sha_key
VITE_IV_KEY=your_iv_key
```

Create `server/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_DATABASE=your_database_name
JWT_SECRET_KEY=your_jwt_secret
API_KEY=your_api_key
SHA_KEY=your_sha_key
IV_KEY=your_iv_key
```

Use matching API, SHA, and IV values on both client and server.

## Getting Started

Install client dependencies:

```bash
cd client
npm install
```

Install server dependencies:

```bash
cd ../server
npm install
```

Start the backend server:

```bash
node server.js
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

Open the local Vite URL shown in the terminal.

## Database

The server expects a MySQL database. Use the sample data files in the project as a reference when setting up tables and seed data.

## Notes

The `.env`, `node_modules`, `dist`, and `uploads` folders are intentionally not included in the repository. Keep secrets and uploaded files local or manage them through your deployment environment.
