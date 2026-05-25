# AITasker — AI Services Marketplace

A full-stack marketplace platform connecting **Clients** who need AI/ML work done with **Experts** who deliver it. Clients post jobs, Experts submit proposals, and both collaborate through managed projects with milestone-based delivery and real-time messaging.

```
aitasker-fullstack/
├── frontend/   React 19 + Vite + TailwindCSS + Zustand   → :3000
└── backend/    Spring Boot 3.3 + Java 21 + PostgreSQL     → :8080
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, TailwindCSS 3, Zustand, React Router 7, Axios, React Hot Toast |
| Backend | Spring Boot 3.3, Java 21, Spring Security, Spring WebSocket |
| Auth | JWT (JJWT 0.12) — access token 24h, refresh token 7d |
| ORM | Spring Data JPA + Hibernate |
| Database | PostgreSQL 17 |
| Real-time | STOMP over SockJS at `/ws` |
| Utilities | Lombok, Jakarta Validation |

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Java JDK | 21+ | [Microsoft OpenJDK](https://learn.microsoft.com/en-us/java/openjdk/download) or `winget install Microsoft.OpenJDK.21` |
| Maven | 3.9+ | [apache.org/maven](https://maven.apache.org/download.cgi) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| PostgreSQL | 15+ | [postgresql.org](https://www.postgresql.org/download/) or `winget install PostgreSQL.PostgreSQL.17` |

---

## Quick Start

### 1. Database Setup

```sql
-- Run as postgres superuser
CREATE DATABASE aitasker_db;
CREATE USER aitasker WITH PASSWORD 'secret';
GRANT ALL PRIVILEGES ON DATABASE aitasker_db TO aitasker;
GRANT ALL ON SCHEMA public TO aitasker;
```

Or with psql CLI:
```bash
psql -U postgres -c "CREATE DATABASE aitasker_db;"
psql -U postgres -c "CREATE USER aitasker WITH PASSWORD 'secret';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE aitasker_db TO aitasker;"
psql -U postgres -d aitasker_db -c "GRANT ALL ON SCHEMA public TO aitasker;"
```

### 2. Backend

```bash
cd backend

# Windows (PowerShell) — set Java 21 if needed
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot"
$env:PATH = "C:\maven\bin;$env:JAVA_HOME\bin;" + $env:PATH

mvn spring-boot:run
# → http://localhost:8080
# Tables auto-created by Hibernate (ddl-auto: update)
# Test data seeded automatically (profile: dev)
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # already configured for localhost:8080
npm install
npm run dev
# → http://localhost:3000
```

---

## Test Accounts

Seeded automatically on first run (profile `dev`):

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| CLIENT | `client@aitasker.com` | `123456` | `/dashboard` |
| EXPERT | `expert@aitasker.com` | `123456` | `/dashboard-expert` |
| ADMIN | `admin@aitasker.com` | `123456` | — |

Login at **http://localhost:3000/login** — redirects automatically by role.

---

## Project Structure

### Frontend `src/`

```
src/
├── api/
│   ├── client.js          # Axios instance + JWT interceptor + auto-logout on 401
│   ├── auth.js            # login, register, getMe
│   └── dashboard.js       # dashboard, jobs, projects, services
├── store/
│   └── authStore.js       # Zustand store — user, token, setAuth, logout
├── components/
│   ├── layout/            # Authentication, ClientLayout, ExpertLayout,
│   │                      #   MarketplaceLayout, PostJobLayout
│   └── ui/                # Button, Badge, StatCard, DataTable, Header,
│                          #   Sidebar, SearchBar, StepBar, PricingCard
├── pages/
│   ├── auth/              # LoginPage, RegisterPage, ForgotPasswordPage
│   ├── client/            # DashboardClient, ManageProposals, ProfileClient
│   │   ├── PostJob/       # PostJob01 → PostJob02 → PostJob03 (multi-step)
│   │   └── Project/       # Project (list), ProjectDetailClient
│   ├── expert/            # DashboardExpert, MyTask, ProfileExpert
│   ├── public/            # Marketplace, JobDetail
│   └── Messenger/         # Messages (WebSocket chat)
└── data/                  # Mock data (used where API not yet wired)
```

### Backend `src/main/java/com/aitasker/`

```
com.aitasker/
├── config/            SecurityConfig (JWT + CORS), WebSocketConfig (STOMP)
├── controller/        AuthController, UserController, JobController,
│                      ServiceController, ProposalController,
│                      ProjectController, MessageController,
│                      ChatController (WebSocket), DashboardController
├── dto/
│   ├── request/       LoginRequest, RegisterRequest, UpdateUserRequest,
│   │                  CreateJobRequest, CreateServiceRequest,
│   │                  SubmitProposalRequest, CreateMilestoneRequest,
│   │                  SendMessageRequest
│   └── response/      ApiResponse<T>, AuthResponse, UserResponse,
│                      JobResponse, JobSuggestionDto, ServiceResponse,
│                      ProposalResponse, ProjectResponse, MilestoneResponse,
│                      MessageResponse, DashboardClientResponse,
│                      DashboardExpertResponse
├── entity/            User, JobPost, Service, Proposal, Project,
│                      Milestone, Message, Review
├── enums/             UserRole, JobStatus, ProposalStatus, ProjectStatus,
│                      MilestoneStatus, MessageStatus
├── exception/         AppException (factory methods), GlobalExceptionHandler
├── repository/        One JpaRepository per entity + custom JPQL queries
├── security/          JwtUtil, JwtAuthFilter, UserDetailsServiceImpl
├── service/impl/      AuthServiceImpl, JobServiceImpl, ProposalServiceImpl,
│                      ProjectServiceImpl, MessageServiceImpl
└── DataSeeder.java    Seeds test data on startup (profile: dev only)
```

---

## API Reference

All responses use the wrapper:
```json
{ "success": true, "message": "...", "data": { ... } }
```

### Auth — `/api/auth`

```
POST /api/auth/register        Body: { email, password, fullName, role }
POST /api/auth/login           Body: { email, password }
POST /api/auth/refresh         Query: ?token=<refreshToken>
```

### Users — `/api/users`

```
GET  /api/users/me             [JWT] Current user profile
PUT  /api/users/me             [JWT] Update profile (fullName, bio, location, hourlyRate, skills, avatarUrl)
GET  /api/users/{id}           Public — expert profile
```

### Jobs — `/api/jobs`

```
GET  /api/jobs                 Public — pageable (?page=0&size=10&sort=createdAt,desc)
GET  /api/jobs/{id}            Public
GET  /api/jobs/my-jobs         [CLIENT]
POST /api/jobs                 [CLIENT]
PUT  /api/jobs/{id}            [CLIENT, owner]
DELETE /api/jobs/{id}          [CLIENT, owner]
PATCH /api/jobs/{id}/close     [CLIENT] — marks job as CANCELLED
POST /api/jobs/ai-suggest      [CLIENT] Body: { title, description } → JobSuggestionDto
```

### Services (Marketplace) — `/api/services`

```
GET  /api/services             Public — pageable
GET  /api/services/{id}        Public
GET  /api/services/my-services [EXPERT]
POST /api/services             [EXPERT]
PUT  /api/services/{id}        [EXPERT, owner]
PATCH /api/services/{id}/toggle [EXPERT] — toggle isActive
```

### Proposals — `/api/proposals`

```
GET  /api/proposals/job/{jobId}      [CLIENT, job owner]
GET  /api/proposals/my-proposals     [EXPERT]
GET  /api/proposals/{id}             [JWT]
POST /api/proposals                  [EXPERT] Body: { jobId, coverLetter, bidAmount, deliveryTime }
PATCH /api/proposals/{id}/accept     [CLIENT] — triggers auto project creation
PATCH /api/proposals/{id}/reject     [CLIENT]
PATCH /api/proposals/{id}/withdraw   [EXPERT] — only if PENDING
GET  /api/proposals/recommend/{jobId} [CLIENT] — AI skill-match scoring
```

### Projects & Milestones — `/api/projects`

```
GET  /api/projects                             [CLIENT or EXPERT]
GET  /api/projects/{id}                        [CLIENT or EXPERT of project]
GET  /api/projects/{projectId}/milestones      [CLIENT or EXPERT of project]
POST /api/projects/{projectId}/milestones      [EXPERT]
PUT  /api/projects/{projectId}/milestones/{id} [EXPERT, only PENDING status]
PATCH /api/projects/milestones/{id}/submit     [EXPERT] Query: ?note=...
PATCH /api/projects/milestones/{id}/approve    [CLIENT] — checks if all approved → project COMPLETED
PATCH /api/projects/milestones/{id}/revision   [CLIENT] Query: ?note=...
```

### Messages — `/api/messages`

```
GET  /api/messages/project/{projectId}   [project member]
POST /api/messages                       [project member] Body: { projectId, content }
GET  /api/messages/inbox                 [JWT] — latest message per conversation
```

### Dashboard

```
GET /api/dashboard/client   [CLIENT] → { activeJobs, pendingProposals, totalSpend, recentProjects }
GET /api/dashboard/expert   [EXPERT] → { activeProjects, pendingProposals, totalEarnings, recentProjects }
```

---

## Real-time Messaging (WebSocket)

Connect via STOMP over SockJS:

```js
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

const client = new Client({
  webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
  onConnect: () => {
    // Subscribe to a project room
    client.subscribe(`/topic/project.${projectId}`, (frame) => {
      const msg = JSON.parse(frame.body) // MessageResponse
      console.log(msg)
    })
  }
})
client.activate()

// Send a message
client.publish({
  destination: '/app/chat.send',
  body: JSON.stringify({ projectId, content: 'Hello!' })
})
```

---

## Environment Variables

### Frontend — `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:8080/api   # Used as fallback; Vite proxy handles /api → :8080
VITE_APP_ENV=development
```

### Backend — `backend/src/main/resources/application.yml`

```yaml
spring:
  profiles:
    active: dev                          # 'dev' enables DataSeeder
  datasource:
    url: jdbc:postgresql://localhost:5432/aitasker_db
    username: aitasker
    password: secret
app:
  jwt:
    secret: <change-in-production>
    expiration-ms: 86400000              # 24h
    refresh-expiration-ms: 604800000     # 7d
  cors:
    allowed-origins: http://localhost:3000,http://localhost:5173
```

---

## Business Rules

| Rule | Description |
|------|-------------|
| BR-06 | Only CLIENTs can create job posts |
| BR-12 | Only EXPERTs can submit proposals |
| BR-13 | Expert cannot have two PENDING proposals on the same job |
| BR-15 | Only the job's CLIENT can accept/reject proposals |
| BR-16 | Accepting a proposal sets job → IN_PROGRESS |
| BR-21 | A Project is auto-created when a proposal is accepted |
| BR-22 | Accepting also auto-rejects all other PENDING proposals on that job |
| BR-26 | Project status → COMPLETED when all milestones are APPROVED |

---

## Running in Production

> These steps replace the dev setup. Not needed for local development.

1. Set `spring.profiles.active=prod` to disable DataSeeder
2. Replace the JWT secret with a strong random string (32+ chars)
3. Set `spring.jpa.hibernate.ddl-auto=validate` after first run
4. Build the frontend: `npm run build` → serve `dist/` via Nginx or similar
5. Build the backend: `mvn clean package -DskipTests` → run the `.jar`

```bash
java -jar target/aitasker-be-0.0.1-SNAPSHOT.jar \
  --spring.datasource.password=<real-password> \
  --app.jwt.secret=<real-secret>
```

---

## Useful Commands

```bash
# Backend
mvn clean compile          # Compile only
mvn clean install          # Compile + test + package
mvn spring-boot:run        # Run with devtools (hot reload)
mvn clean package -DskipTests  # Build JAR

# Frontend
npm run dev                # Dev server with HMR
npm run build              # Production build → dist/
npm run preview            # Preview production build locally
npm run lint               # ESLint check
```
