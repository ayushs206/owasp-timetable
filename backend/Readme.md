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

## API Endpoints

Base URL: `http://localhost:<PORT>/api/v1`

### Health

- Method: `GET`
- Path: `/health/`
- Description: Health check endpoint.
- Success Response: `200 { "message": "OK" }`

### Timetable

#### Get Batch Schedule

- Method: `GET`
- Path: `/timetable/schedule/:batch`
- Path Param: `batch` (example: `CSE-A`)
- Description: Returns timetable for a specific batch.
- Success Response: `200 { "status": "success", "data": { ... } }`
- Error Response: `404 { "status": "error", "message": "Batch not found" }`

#### Get Free Slots Across Batches

- Method: `GET`
- Path: `/timetable/freeslots`
- Body: `{ "batches": ["CSE-A", "CSE-B"] }`
- Description: Computes common free slots by removing occupied class times for the provided batches.
- Success Response: `200 { "status": "success", "data": { ... } }`
- Error Response: `400` when `batches` is missing, not an array, or outside the allowed range (2 to 9).

#### Get Available Batches

- Method: `GET`
- Path: `/timetable/batches`
- Description: Returns all available batch names.
- Success Response: `200 { "status": "success", "data": ["..."] }`

## Contribution Notes

- Keep database-specific code in `src/db`.
- Document any new setup or architecture changes in this README.