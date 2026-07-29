---
paths:
    - "**/*.go"
---

# Go Clean Architecture + DDD Implementation Constraints

> Scope: Go projects adopting "DDD + Clean Architecture" (Gin + GORM + Wire).
> Read this spec when work involves adding a new domain module, writing domain/usecase/adapter layer code, Wire wiring, unified error handling, or testing.
> This is the Claude Code consolidated version of `.cursor/rules/*.mdc`, with corrections where the originals diverge from the code (see "Known Divergences").

## 1. Tech Stack

| Category             | Technology                           |
| :------------------- | :----------------------------------- |
| Language             | Go 1.23+                             |
| Web Framework        | Gin                                  |
| ORM                  | GORM + PostgreSQL                    |
| Dependency Injection | Google Wire (compile-time)           |
| Mocking              | go.uber.org/mock (mockgen)           |
| Logging              | pkg/log (slog, JSON)                 |
| Configuration        | Viper (reads `.env`)                 |
| Auth / Password      | JWT (pkg/auth) / bcrypt (pkg/crypto) |
| API Docs             | Swagger / swag                       |

## 2. Architecture Overview

Dependencies flow **only inward**:

```
Adapter (delivery/http, repository, gateway, task)
        ↓
UseCase (Manager + port interfaces.go + dto)
        ↓
Domain (entities, value objects, business rules, zero framework deps)
```

Each bounded context is a self-contained module:

```
internal/{domain}/
├── domain/                               # entities + business rules
├── usecase/                              # Manager + interfaces.go (ports) + dto/ + mock/
└── adapter/
    ├── delivery/http/{handler,router,dto}/   # HTTP entry
    ├── delivery/task/                        # background task entry
    ├── repository/                           # GORM persistence (implements repo port)
    └── gateway/                              # external services (implements gateway port)
internal/shared/                              # server assembly, central router, middleware
internal/di/                                  # Wire wiring (wire.go → wire_gen.go)
pkg/                                          # shared libs, must not depend on internal
```

## 3. DDD Concepts → Go Mapping

| DDD Concept               | Go Implementation                    | Location                |
| :------------------------ | :----------------------------------- | :---------------------- |
| Entity                    | struct with ID + business methods    | `domain/{entity}.go`    |
| Value Object              | struct / type alias without ID       | `domain/`               |
| Aggregate Root            | entity + associations (pointers)     | `domain/`               |
| Domain Service            | cross-entity logic → UseCase Manager | `usecase/`              |
| Repository Port           | interface, **defined by UseCase**    | `usecase/interfaces.go` |
| Repository Impl (adapter) | GORM implementation                  | `adapter/repository/`   |

**Ports are defined by the consumer**: UseCase declares `XxxRepository`/`XxxGateway` in `interfaces.go`; the Adapter implements them. This is the dependency-inversion seam and the source of testability.

## 4. Layer Constraints

### 4.1 Domain Layer (`**/domain/*.go`)

Pure business entities and rules.

```go
// User is the user entity.
type User struct {
    ID       uint
    Username string
    Email    string
    Password string
    Status   UserStatus
}

// UserStatus is the user status value object.
type UserStatus string

const (
    UserStatusActive   UserStatus = "active"
    UserStatusInactive UserStatus = "inactive"
)

// IsActive returns whether the user is active.
func (u *User) IsActive() bool {
    return u.Status == UserStatusActive
}
```

- Fields use PascalCase; associated entities use pointers
- Status type `type XxxStatus string`; constants `XxxStatusYyy`, values are lowercase strings
- Method prefixes: `Is` (boolean) / `Can` (capability) / `Get` (computed value) / `Update` (state change)
- **Prohibited**: no `json:`/`gorm:` tags; no Gin/GORM/Wire dependencies; no DB or external service calls; no HTTP structs

### 4.2 UseCase Layer (`**/usecase/**/*.go`)

Orchestrates business flows and defines dependency ports.

```go
// UserManager orchestrates user registration, login, and queries.
type UserManager struct {
    userRepo UserRepository
    hasher   PasswordHasher
}

// NewUserManager creates a UserManager; the constructor takes all dependency interfaces.
func NewUserManager(userRepo UserRepository, hasher PasswordHasher) *UserManager {
    return &UserManager{userRepo: userRepo, hasher: hasher}
}
```

- Naming `{Domain}Manager`; constructor `New{Domain}Manager`
- Fields are dependency **interfaces** (Repository/Gateway/Hasher), never concrete types
- Methods take `ctx context.Context` as the first parameter; inputs use `dto.XxxRequest`, return `(*dto.XxxResponse, error)`
- `interfaces.go` defines ports: `{Entity}Repository`, `{Service}Gateway`, `PasswordHasher`
- Sentinel errors (e.g. `ErrUserNotFound`) live in the UseCase package
- Mocking: add `//go:generate mockgen -source=interfaces.go -destination=mock/interfaces.go -package=mock` at the top of `interfaces.go`; run `make mock`

**Error handling in four steps**: check err → convert sentinel errors to `utils.NotFoundError(...)` etc. → `log.Error(...)` with context → return `utils.WrapError(err, ...)`

### 4.3 Adapter Layer

**HTTP Handler (`**/delivery/http/**/*.go`)**

```go
// UserHandler handles user-related HTTP requests.
type UserHandler struct {
    userManager *usecase.UserManager
}
```

Standard flow: **bind request → call UseCase (HTTP DTO → UseCase DTO) → on error `c.Error(err)` delegates to middleware → on success `c.JSON(...)`**

- Naming `{Domain}Handler`; depends on the **concrete** `*usecase.{Domain}Manager` (not via interface)
- HTTP DTOs live in `adapter/delivery/http/dto/`, separate from UseCase DTOs; mapping happens at the boundary
- Request tags: `json:"x"` / `form:"x"` / `binding:"required,min=3"`
- Responses must strip sensitive fields (password etc.)
- **Prohibited**: no business logic; no direct Repository calls; no hand-rolled `c.JSON(400, gin.H{...})` — always `c.Error()`
- Routes go in `router/`'s `Register{Domain}Routes`, then register in the central router

**Repository (`**/repository/*.go`)**

- GORM Model is **separate** from the domain entity (`UserModel` standalone + `TableName()`)
- Queries always use `r.db.WithContext(ctx)`
- `gorm.ErrRecordNotFound` → convert to a domain sentinel error (`usecase.ErrUserNotFound`)
- Model ↔ Domain via `toDomain()`/`fromDomain()` conversions; factor common queries into private helpers (e.g. `findOne`)
- Multi-table operations use transactions; list queries must paginate

**Gateway (`**/gateway/**/*.go`)**

Wrappers for external services (HTTP/gRPC clients), implementing the `{Service}Gateway` port defined by UseCase. Naming `{Service}Gateway`; constructor takes `config.Config`; use `http.NewRequestWithContext(ctx, ...)`; wrap errors with `fmt.Errorf("...: %w", err)`; convert inbound external DTOs to domain models before returning.

**Task (`**/delivery/task/*.go`)**

Background/scheduled task entry points. Depend on the UseCase Manager (**never call Repository directly**); signature `Run(ctx context.Context) error`; log start/completion/failure via `pkg/log`.

### 4.4 Shared Infrastructure (`internal/shared/`)

- `delivery/server.go`: Gin engine assembly + middleware order `gin.Recovery() → ErrorHandler() → gin.Logger()`
- Central router `router/router.go`: aggregates each domain's `Register{Domain}Routes`; new modules are mounted here
- `middleware/error_handler.go`: translates `*AppError` into HTTP responses uniformly

## 5. Cross-Cutting Constraints

- **Error handling**: use `pkg/utils.AppError` constructors (`NotFoundError`/`BadRequestError`/`UnauthorizedError`/`ConflictError`/`WrapError`) across the whole chain. Handlers delegate via `c.Error()` to the `ErrorHandler` middleware. **Never** return bare `errors.New` or hand-roll JSON error responses. `WrapError` only logs; it never leaks internal details to clients.
- **Logging**: use `pkg/log` (slog) structured logging `log.Info("user created", "user_id", id)`; never use `fmt.Printf` or string concatenation.
- **Context**: every business method takes `ctx context.Context` first; Repositories propagate it via `db.WithContext(ctx)`.
- **DTO layering**: HTTP request/response DTOs (`adapter/delivery/http/dto/`) ≠ UseCase DTOs (`usecase/dto/`). Mapping happens at the Handler and Repository boundaries.
- **Configuration**: Viper reads `.env` (`pkg/config`); sensitive data goes through env vars; validate completeness at startup. **No yaml config file.**

## 6. Wire DI Constraints (`**/di/*.go`)

- `internal/di/wire.go` carries `//go:build wireinject`; **edit only `wire.go`, never hand-edit `wire_gen.go`**
- New module trio: `New{Entity}Repository` + `wire.Bind(new(usecase.XxxRepository), new(*repo.XxxRepository))` + `New{Domain}Manager` + `New{Domain}Handler`
- The `NewServer` constructor must accept the new Handler parameter and add it to `RouterParams`
- Use aliases for same-named packages: `userRepo`/`userUsecase`/`userHandler`
- After editing `wire.go`, always run `make di` to regenerate

## 7. Testing Constraints (`**/*_test.go`)

> **Correction**: `.cursor/rules/30-testing` prescribes testify throughout, but this project has **no testify** dependency (and existing tests don't use it). This spec follows the actual codebase.

- **Assertions use the standard library `testing`** (`t.Errorf`/`t.Fatalf`/`t.Helper()`); **mocks use `go.uber.org/mock/gomock`**
- Table-driven tests: `tests := []struct{...}` + `t.Run(tt.name, ...)`
- Naming `Test{Struct}_{Method}_{Scenario}`, e.g. `TestUserManager_FindByID_NotFound`
- Mock ports: `mock.NewMockUserRepository(ctrl)` + `m.EXPECT().FindByID(gomock.Any(), id).Return(...)`
- Handler integration tests use `httptest` + `gin.SetMode(gin.TestMode)`
- Coverage target 80%+; `make test` runs with `-gcflags=all=-l` (disables inlining) — include that flag when running a single test manually
- TDD Red-Green-Refactor; see `~/.claude/rules/tdd-development-flow.md`

## 8. Swagger Constraints (handler methods)

Every Handler method must carry full annotations: `@Summary`/`@Tags`/`@Accept json`/`@Produce json`/`@Router`/`@Success`/`@Failure`. Parameter annotations distinguish `query`/`path`/`header`/`body`. Error responses uniformly use `{object} utils.AppError`. After editing annotations, run `make doc` to regenerate into `cmd/api/docs/`.

## 9. New Domain Module Workflow

```
Domain entity → UseCase (interfaces + Manager + dto) → Repository → Handler
→ domain Router → mount on central router → Swagger annotations → tests → Wire DI (make di)
```

Finishing commands: `make mock && make di && make doc && make lint && make test`

## 10. Anti-Patterns

| Anti-Pattern                                    | Consequence                              | Correct Approach                              |
| :---------------------------------------------- | :--------------------------------------- | :-------------------------------------------- |
| Adding `gorm:`/`json:` tags in the Domain layer | layer leakage, hard to test              | keep Domain pure; map in the Repository       |
| Handler calls Repository directly               | bypasses business orchestration          | always go through the UseCase Manager         |
| Handler hand-rolls `c.JSON(400,...)`            | inconsistent error responses             | `c.Error(utils.XxxError(...))`                |
| UseCase holds a concrete Repo type              | un-mockable, dependency inversion breaks | hold the interface from `interfaces.go`       |
| Hand-editing `wire_gen.go`                      | overwritten on next `make di`            | edit only `wire.go`                           |
| Writing tests with testify                      | compile failure (no such dependency)     | standard library + gomock                     |
| Changing a port interface without `make mock`   | test compile failure                     | run `make mock` after editing `interfaces.go` |
| Business method without `ctx` first param       | timeout/cancellation signals lost        | first param `ctx context.Context`             |
| `fmt.Printf` for logging                        | unstructured, hard to aggregate          | `pkg/log` structured logging                  |

## 11. Known Divergences (this spec vs `.cursor/rules/`)

- **Test framework**: `.cursor/rules/30-testing` uses testify; the project has none — this spec uses stdlib + gomock
- **Go version**: `.cursor/rules/00` says 1.21+; `go.mod` is actually 1.23.0 — this spec says 1.23+
- Other `.cursor/rules/*.mdc` content matches this spec; on conflict, **this spec prevails** (aligned with the actual code)

## 12. Command Quick Reference

| Command                                    | Purpose                                                          |
| :----------------------------------------- | :--------------------------------------------------------------- |
| `make di`                                  | regenerate Wire (required after editing `wire.go`)               |
| `make mock`                                | regenerate mockgen (required after editing a port interface)     |
| `make doc`                                 | regenerate Swagger via swag (required after editing annotations) |
| `make test`                                | tests + coverage, `-gcflags=all=-l`, excludes mock/docs          |
| `make lint` / `make fmt`                   | golangci-lint / gofumpt + golines (line width 120)               |
| `go test -gcflags=all=-l -run X ./pkg/...` | single test                                                      |

---

## Document Metadata

- Spec name: Go Clean Architecture + DDD Implementation Constraints
- Version: v1.0.0
- Last updated: 2026-07-20
- Maintainer: TBD
- Related: `~/.claude/rules/ddd-architecture.md` (DDD concepts), `~/.claude/rules/tdd-development-flow.md` (TDD flow), `~/.claude/rules/date-handling-specification.md` (date/timezone)
