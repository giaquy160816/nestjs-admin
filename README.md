## 🐳 Docker Setup Guide for Local Development

This project uses **Docker Compose** to run NestJS (`nestjs-dev`) in development mode with hot reload and a production-ready runtime (`nestjs-runtime`) for backup or deployment. It also includes supporting services: PostgreSQL, Redis, Elasticsearch, Kibana, and RabbitMQ.

---

### 🧱 Project Structure

```bash
.
├── Dockerfile
├── docker-compose.yml              # Main services (Postgres, Redis, etc.)
├── docker-compose.dev.yml         # Dev-only overrides (nestjs-dev)
├── .env.development               # Env vars for dev container
└── src/
```

---

### 🚀 Run Project Locally

#### ✅ First-time setup:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build dev
```

#### ▶️ Start development server:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up dev
```

- Dev API running at: http://localhost:3002
- Hot reload enabled with `ts-node-dev`

#### ⏹ Stop services:
```bash
docker-compose down
```

#### 🔄 Reload if you change `.env.development`:
```bash
docker-compose restart dev
```

---

### ⚙️ Environment Configuration

Create `.env.development`:
```env
DB_POSTGRES_HOST=postgres
DB_POSTGRES_PORT=5432
DB_POSTGRES_USERNAME=myuser
DB_POSTGRES_PASSWORD=mypassword
DB_POSTGRES_DATABASE=mydatabase
```

Ensure the `ConfigModule` in NestJS reads these variables.

---

### ⚙️ Production Runtime (backup container)

To build and start the production-ready NestJS container:
```bash
docker-compose build runtime
docker-compose up -d runtime
```
- Runs at http://localhost:3001
- Uses `dist/` output from Dockerfile multi-stage build

To stop it:
```bash
docker-compose stop runtime
```

---

### 🧪 Useful Commands

```bash
# Check running containers
docker ps

# Remove all stopped containers + volumes
docker system prune -af --volumes

# Rebuild everything from scratch
docker-compose down --volumes
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache
```

---

### 🛠 Recommended VS Code Extensions

- Docker
- ESLint
- Prettier
- DotENV

---

### 🤝 Contributing

1. Clone the repo
2. Run with Docker as above
3. Send Pull Request

---

Happy coding! 💻
