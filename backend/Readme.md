# Backend - OWASP Projects Site

This folder contains the backend service for the OWASP Projects Site.

## Getting Started

### 1. Move into backend folder

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env` and update the values.

```bash
cp .env.example .env
```

If you are on Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 4. Run the server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## Folder Structure

```text
backend/
	src/
		index.js
		app.js
		routes/
		db/
		middleware/
		controllers/
```

## Folder Responsibilities

- `src/db`: Database connection setup, models, queries, and data-access logic.
- `src/middleware`: Express middleware such as auth checks, validation, logging, and error handling.
- `src/controllers`: actually logics for routes

## Contribution Notes

- Keep database-specific code in `src/db`.
- Document any new setup or architecture changes in this README.