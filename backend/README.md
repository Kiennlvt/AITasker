# AITasker Backend — Spring Boot 3

> REST API cho nền tảng AITasker. Chạy trên port **8080**, khớp với FE tại `VITE_API_BASE_URL=http://localhost:8080/api`

## Tech Stack
| | |
|---|---|
| Framework | Spring Boot 3.3 + Java 21 |
| Security | Spring Security + JWT (JJWT 0.12) |
| ORM | Spring Data JPA + Hibernate |
| DB | PostgreSQL 15 |
| WebSocket | Spring WebSocket + STOMP |
| Validation | Jakarta Bean Validation |
| Mapping | MapStruct + Lombok |

## Cấu trúc Package
```
com.aitasker/
├── config/          SecurityConfig, WebSocketConfig
├── controller/      AuthController, JobController, ProposalController,
│                    ProjectController, MessageController, ServiceController,
│                    DashboardController
├── dto/
│   ├── request/     LoginRequest, RegisterRequest, CreateJobRequest,
│   │                SubmitProposalRequest, CreateMilestoneRequest,
│   │                SendMessageRequest, CreateServiceRequest
│   └── response/    ApiResponse<T>, AuthResponse, UserResponse,
│                    JobResponse, ServiceResponse, ProposalResponse,
│                    ProjectResponse, MilestoneResponse, MessageResponse,
│                    DashboardClientResponse, DashboardExpertResponse
├── entity/          User, JobPost, Service, Proposal, Project,
│                    Milestone, Message, Review
├── enums/           UserRole, JobStatus, ProposalStatus, ProjectStatus,
│                    MilestoneStatus, MessageStatus
├── exception/       AppException, GlobalExceptionHandler
├── repository/      (1 interface per entity + custom queries)
├── security/        JwtUtil, JwtAuthFilter, UserDetailsServiceImpl
└── service/impl/    AuthServiceImpl, JobServiceImpl, ProposalServiceImpl,
                     ProjectServiceImpl, MessageServiceImpl
```

## API Endpoints

### Auth
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh?token=...
```

### Jobs (Public GET, Client POST/PUT/DELETE)
```
GET  /api/jobs              # pageable: ?page=0&size=10
GET  /api/jobs/{id}
GET  /api/jobs/my-jobs      # CLIENT
POST /api/jobs              # CLIENT
PUT  /api/jobs/{id}         # CLIENT
DEL  /api/jobs/{id}         # CLIENT
```

### Services (Marketplace)
```
GET  /api/services          # pageable
GET  /api/services/{id}
GET  /api/services/my-services  # EXPERT
POST /api/services              # EXPERT
```

### Proposals
```
GET  /api/proposals/job/{jobId}   # CLIENT
GET  /api/proposals/my-proposals  # EXPERT
POST /api/proposals               # EXPERT
PATCH /api/proposals/{id}/accept  # CLIENT
PATCH /api/proposals/{id}/reject  # CLIENT
PATCH /api/proposals/{id}/withdraw # EXPERT
```

### Projects & Milestones
```
GET  /api/projects                              # CLIENT or EXPERT
GET  /api/projects/{id}
PATCH /api/projects/milestones/{id}/approve     # CLIENT
PATCH /api/projects/milestones/{id}/revision?note=... # CLIENT
PATCH /api/projects/milestones/{id}/submit?note=... # EXPERT
```

### Messages
```
GET  /api/messages/project/{projectId}
POST /api/messages
WS   /ws  (STOMP → /topic/project.{projectId})
```

### Dashboard
```
GET /api/dashboard/client  # CLIENT
GET /api/dashboard/expert  # EXPERT
```

## Quick Start

```bash
# 1. Clone
git clone <repo>
cd aitasker-be

# 2. Setup PostgreSQL
createdb aitasker_db

# 3. Config env
cp src/main/resources/application.yml application-local.yml
# Sửa datasource credentials

# 4. Run
./mvnw spring-boot:run
# → http://localhost:8080
```

## WebSocket (Messaging real-time)

FE kết nối:
```js
const socket = new SockJS('http://localhost:8080/ws')
const client = Stomp.over(socket)
client.connect({}, () => {
  client.subscribe(`/topic/project.${projectId}`, (msg) => {
    // nhận MessageResponse
  })
})
```
