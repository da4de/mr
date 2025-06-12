# MR Fullstack Project

This is a fullstack monorepo project containing both frontend and backend parts, structured for modular development and containerized deployment.

## Project Structure

mr/
├── mr-frontend/ # Angular frontend
├── mr-backend/ # NestJS backend
├── docker-compose.yml

Quick Start (with Docker Compose)
```bash
docker compose up --build
```

The application will be available at:
Frontend: http://localhost:8080
Backend API: http://localhost:3000
