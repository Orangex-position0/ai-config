# Skills

本目录是 `ai-config` 的 Skill 集合，用于在 Claude Code、Codex 和其他兼容 `SKILL.md` 的 agent 中复用工作流、领域规则和任务套路。

这个目录不是单独的 skill marketplace；它是个人 AI 配置发行版的一部分。这里既包含自建 skill，也包含 vendored 外部 skill。来源与 hash 状态由仓库根目录的 `skills-lock.json` 和 `npm run skills:inventory` 辅助查看。

## 如何使用

通常不需要手动加载 Skill。Agent 会根据用户请求和每个 `SKILL.md` 的 frontmatter `description` 自动选择合适的 skill。

也可以在对话中显式点名：

```text
使用 check review 这次改动
使用 hunt 排查这个回归
使用 open-source-readme 优化 README
```

每个 skill 至少包含：

```text
skill-name/
└── SKILL.md
```

常见扩展目录：

```text
skill-name/
├── SKILL.md
├── references/
├── scripts/
└── assets/
```

## 推荐入口

| 场景 | 优先使用 |
| --- | --- |
| 不知道该用哪个 skill | [ask-matt](./ask-matt/SKILL.md) |
| 代码审查、PR、发布前检查 | [check](./check/SKILL.md), [code-review](./code-review/SKILL.md) |
| 报错、回归、行为异常 | [hunt](./hunt/SKILL.md), [diagnosing-bugs](./diagnosing-bugs/SKILL.md) |
| 方案设计、架构取舍、复杂决策 | [think](./think/SKILL.md), [grilling](./grilling/SKILL.md), [codebase-design](./codebase-design/SKILL.md) |
| 学习、研究、阅读资料 | [learn](./learn/SKILL.md), [research](./research/SKILL.md), [read](./read/SKILL.md) |
| 前端 UI、可访问性、设计系统 | [ui](./ui/SKILL.md), [frontend-design](./frontend-design/SKILL.md), [frontend-a11y](./frontend-a11y/SKILL.md), [design-system](./design-system/SKILL.md) |
| 写作、README、变更日志 | [write](./write/SKILL.md), [open-source-readme](./open-source-readme/SKILL.md), [changelog](./changelog/SKILL.md) |
| 中文求职、简历、面试、投递 | [asu](./asu/SKILL.md), [asu-recap](./asu-recap/SKILL.md), [project-guide](./project-guide/SKILL.md), [make-resume](./make-resume/SKILL.md), [asu-resume](./asu-resume/SKILL.md), [job-apply](./job-apply/SKILL.md), [interview](./interview/SKILL.md), [offer](./offer/SKILL.md), [contributor](./contributor/SKILL.md) |
| 创建或维护 AI 配置资源 | [skill-creator](./skill-creator/SKILL.md), [rule-creator](./rule-creator/SKILL.md), [health](./health/SKILL.md) |

## 按领域索引

### 代码审查与诊断

| Skill | 用途 |
| --- | --- |
| [check](./check/SKILL.md) | 代码审查、PR 检查、发布关卡和项目审计。 |
| [code-review](./code-review/SKILL.md) | 基于分支、commit、tag 或 merge-base 审查代码变更。 |
| [diagnosing-bugs](./diagnosing-bugs/SKILL.md) | 针对复杂 bug 和性能回归执行诊断循环。 |
| [hunt](./hunt/SKILL.md) | 先定位根因，再决定修复方式。 |
| [risk-based-code-review](./risk-based-code-review/SKILL.md) | 为 AI 生成代码或大 diff 准备人工审查清单。 |

### 规划、架构与协作

| Skill | 用途 |
| --- | --- |
| [adr](./adr/SKILL.md) | 编写或审计 ADR。 |
| [codebase-design](./codebase-design/SKILL.md) | 设计深模块、接口边界和可维护结构。 |
| [codebase-memory](./codebase-memory/SKILL.md) | 使用代码知识图谱做结构化代码查询。 |
| [domain-modeling](./domain-modeling/SKILL.md) | 梳理领域模型、术语和 ubiquitous language。 |
| [grill-me](./grill-me/SKILL.md) | 对计划或想法做高强度追问。 |
| [grill-with-docs](./grill-with-docs/SKILL.md) | 一边追问，一边沉淀 ADR 和 glossary。 |
| [grilling](./grilling/SKILL.md) | 通用追问工作流。 |
| [handoff](./handoff/SKILL.md) | 将当前上下文压缩成可交接文档。 |
| [implement](./implement/SKILL.md) | 根据 spec 或 tickets 执行实现。 |
| [improve-codebase-architecture](./improve-codebase-architecture/SKILL.md) | 扫描代码库中的架构改进机会。 |
| [prototype](./prototype/SKILL.md) | 用一次性原型回答设计问题。 |
| [think](./think/SKILL.md) | 把粗略想法变成决策完整的计划。 |
| [wayfinder](./wayfinder/SKILL.md) | 为超出单次会话容量的大型工作绘制决策地图。 |

### 研究、阅读与写作

| Skill | 用途 |
| --- | --- |
| [changelog](./changelog/SKILL.md) | 创建、维护、审查 CHANGELOG。 |
| [learn](./learn/SKILL.md) | 六阶段研究工作流。 |
| [open-source-readme](./open-source-readme/SKILL.md) | 创建、重写或审查开源项目 README。 |
| [ppp-creator](./ppp-creator/SKILL.md) | 编写 PPP 工作状态更新。 |
| [read](./read/SKILL.md) | 阅读、摘要、引用 URL 和 PDF。 |
| [research](./research/SKILL.md) | 面向高可信来源做主题研究。 |
| [teach](./teach/SKILL.md) | 在当前工作区内教学一个概念或技能。 |
| [tech-blog-coach](./tech-blog-coach/SKILL.md) | 将技术草稿打磨成 Hugo 博客文章。 |
| [write](./write/SKILL.md) | 中英文文案改写、润色、去 AI 味。 |

### 中文求职工作流

| Skill | 用途 |
| --- | --- |
| [asu](./asu/SKILL.md) | 根据目标岗位酥化真实经历、项目要点和 HR 开场白。 |
| [asu-recap](./asu-recap/SKILL.md) | 按阿酥方式复盘 AI 编程对话、项目交付记录和落地证据。 |
| [asu-resume](./asu-resume/SKILL.md) | 复刻 ASu 单栏高密度技术简历并生成可编辑 HTML/PDF。 |
| [contributor](./contributor/SKILL.md) | 寻找和准备真实开源贡献候选，经确认后提交 PR。 |
| [interview](./interview/SKILL.md) | 根据简历和 JD 预测面试问题，并逐层追问掌握度。 |
| [job-apply](./job-apply/SKILL.md) | 读取用户确认的简历资料，辅助填写招聘网站申请表并核对结果。 |
| [make-resume](./make-resume/SKILL.md) | 制作或复刻中文可编辑 HTML 简历并辅助导出 PDF。 |
| [offer](./offer/SKILL.md) | 管理秋招投递、测评、面试、Offer 和拒信进度。 |
| [project-guide](./project-guide/SKILL.md) | 基于项目材料生成项目导学、项目面经和可交接事实摘要。 |

### 前端、设计与 UI

| Skill | 用途 |
| --- | --- |
| [accessibility](./accessibility/SKILL.md) | WCAG 2.2 AA 可访问性设计、实现与审计。 |
| [design-system](./design-system/SKILL.md) | 生成或审计设计系统与视觉一致性。 |
| [frontend-a11y](./frontend-a11y/SKILL.md) | React / Next.js 可访问性模式。 |
| [frontend-design](./frontend-design/SKILL.md) | 高质量前端界面、页面和组件设计。 |
| [frontend-design-direction](./frontend-design-direction/SKILL.md) | 为生产 UI 建立更具体的设计方向。 |
| [frontend-patterns](./frontend-patterns/SKILL.md) | React / Next.js 前端开发模式。 |
| [frontend-slides](./frontend-slides/SKILL.md) | 创建动画丰富的 HTML 演示文稿。 |
| [ui](./ui/SKILL.md) | 生产级 UI、页面、组件和视觉打磨。 |
| [ui-demo](./ui-demo/SKILL.md) | 用 Playwright 录制 UI demo 视频。 |

### 语言、框架与工程实践

| Skill | 用途 |
| --- | --- |
| [agent-friendly-cli](./agent-friendly-cli/SKILL.md) | 设计适合 AI agent 调用的 CLI。 |
| [api-design](./api-design/SKILL.md) | REST API 设计模式。 |
| [database-migrations](./database-migrations/SKILL.md) | 数据库迁移、回滚和零停机变更。 |
| [fastapi-patterns](./fastapi-patterns/SKILL.md) | FastAPI 项目结构、依赖注入、认证和测试。 |
| [generating-python-installer](./generating-python-installer/SKILL.md) | Windows Python 商业级安装包优化。 |
| [golang-patterns](./golang-patterns/SKILL.md) | Go 惯用模式与最佳实践。 |
| [golang-testing](./golang-testing/SKILL.md) | Go 测试、benchmark、fuzzing 和覆盖率。 |
| [java-coding-standards](./java-coding-standards/SKILL.md) | Java / Spring Boot / Quarkus 编码规范。 |
| [python-patterns](./python-patterns/SKILL.md) | Python 风格、类型标注和工程实践。 |
| [python-testing](./python-testing/SKILL.md) | pytest、fixture、mock、参数化和覆盖率。 |
| [react-native-patterns](./react-native-patterns/SKILL.md) | React Native / Expo 应用模式。 |
| [react-patterns](./react-patterns/SKILL.md) | React 18/19 组件、hooks、边界和数据模式。 |
| [react-performance](./react-performance/SKILL.md) | React / Next.js 性能优化。 |
| [react-testing](./react-testing/SKILL.md) | React Testing Library、Vitest/Jest、MSW 和 a11y 测试。 |
| [react-ts-project-template](./react-ts-project-template/SKILL.md) | Vite + React + TypeScript SPA 项目模板。 |
| [rust-newtype-pattern](./rust-newtype-pattern/SKILL.md) | Rust newtype、ID、单位和边界类型建模。 |
| [rust-patterns](./rust-patterns/SKILL.md) | Rust 所有权、错误处理、trait、并发和惯用模式。 |
| [rust-testing](./rust-testing/SKILL.md) | Rust 单元测试、集成测试、异步测试和 TDD。 |
| [rust-tokio-practices](./rust-tokio-practices/SKILL.md) | Tokio 任务生命周期、取消、shutdown 和队列审查。 |
| [rust-typestate-audit](./rust-typestate-audit/SKILL.md) | 审计 Rust typestate 候选并设计最小状态模型。 |
| [rust-workflow](./rust-workflow/SKILL.md) | Rust 工具链、CI、hooks、Cargo 工作流。 |
| [springboot-patterns](./springboot-patterns/SKILL.md) | Spring Boot 架构、REST、数据访问、缓存和异步处理。 |
| [springboot-security](./springboot-security/SKILL.md) | Spring Security、校验、CSRF、密钥和限流。 |
| [springboot-tdd](./springboot-tdd/SKILL.md) | Spring Boot TDD、JUnit、Mockito、MockMvc 和 Testcontainers。 |
| [springboot-verification](./springboot-verification/SKILL.md) | Spring Boot 构建、静态分析、测试和安全扫描验证。 |
| [tdd](./tdd/SKILL.md) | 通用测试驱动开发工作流。 |

### 安全、GitHub 与维护

| Skill | 用途 |
| --- | --- |
| [github-ops](./github-ops/SKILL.md) | GitHub issue、PR、CI、release 和维护操作。 |
| [health](./health/SKILL.md) | 审计 AI 配置、hooks、MCP、验证面和可维护性漂移。 |
| [safety-guard](./safety-guard/SKILL.md) | 防止生产环境或自治 agent 执行破坏性操作。 |
| [security-review](./security-review/SKILL.md) | 认证、输入、密钥、API 和敏感功能安全审查。 |
| [security-scan](./security-scan/SKILL.md) | 扫描 Claude 配置中的安全问题。 |
| [triage](./triage/SKILL.md) | issue 和外部 PR 的 triage 状态机。 |

### 元工具与资源管理

| Skill | 用途 |
| --- | --- |
| [ask-matt](./ask-matt/SKILL.md) | 为当前情况选择合适的 skill 或 flow。 |
| [project-bootstrap](./project-bootstrap/SKILL.md) | 初始化项目骨架和工程规范。 |
| [rule-creator](./rule-creator/SKILL.md) | 编写和审查 rules 规范文档。 |
| [setup-matt-pocock-skills](./setup-matt-pocock-skills/SKILL.md) | 初始化 Matt Pocock engineering skills 的配套设置。 |
| [skill-creator](./skill-creator/SKILL.md) | 创建或维护 Skill。 |
| [to-spec](./to-spec/SKILL.md) | 将当前对话整理为 spec。 |
| [to-tickets](./to-tickets/SKILL.md) | 将计划或 spec 拆成可执行 tickets。 |
| [writing-for-agents](./writing-for-agents/SKILL.md) | 编写 agent 可消费文档、skill 和 AGENTS/CLAUDE 指令的参考。 |

## 完整字母索引

| Skill | 简述 |
| --- | --- |
| [accessibility](./accessibility/SKILL.md) | Design, implement, and audit inclusive digital products using WCAG 2.2 Level AA |
| [adr](./adr/SKILL.md) | 编写和审计 ADR（架构决策记录，Architecture Decision Record）。 |
| [agent-friendly-cli](./agent-friendly-cli/SKILL.md) | 设计对 AI agent 友好的命令行接口。 |
| [api-design](./api-design/SKILL.md) | REST API design patterns for production APIs. |
| [ask-matt](./ask-matt/SKILL.md) | Ask which skill or flow fits your situation. |
| [asu](./asu/SKILL.md) | 中文求职经历酥化和 HR 开场白。 |
| [asu-recap](./asu-recap/SKILL.md) | 阿酥方式复盘 AI 编程对话和项目交付证据。 |
| [asu-resume](./asu-resume/SKILL.md) | ASu 同款高密度技术简历制作。 |
| [changelog](./changelog/SKILL.md) | Create, update, review, or release CHANGELOG files. |
| [check](./check/SKILL.md) | Reviews code diffs, PRs, release readiness, pushes, publishing, and audits. |
| [code-review](./code-review/SKILL.md) | Review changes since a commit, branch, tag, or merge-base. |
| [codebase-design](./codebase-design/SKILL.md) | Shared vocabulary for designing deep modules. |
| [codebase-memory](./codebase-memory/SKILL.md) | Use the codebase knowledge graph for structural code queries. |
| [contributor](./contributor/SKILL.md) | 中文求职场景下的开源贡献辅助。 |
| [database-migrations](./database-migrations/SKILL.md) | Database migration best practices for schema and data changes. |
| [design-system](./design-system/SKILL.md) | Generate or audit design systems and visual consistency. |
| [diagnosing-bugs](./diagnosing-bugs/SKILL.md) | Diagnosis loop for hard bugs and performance regressions. |
| [domain-modeling](./domain-modeling/SKILL.md) | Build and sharpen a project's domain model. |
| [fastapi-patterns](./fastapi-patterns/SKILL.md) | FastAPI best practices for APIs, services, auth, and tests. |
| [frontend-a11y](./frontend-a11y/SKILL.md) | Accessibility patterns for React and Next.js. |
| [frontend-design](./frontend-design/SKILL.md) | Create distinctive, production-grade frontend interfaces. |
| [frontend-design-direction](./frontend-design-direction/SKILL.md) | Set product-specific frontend design direction. |
| [frontend-patterns](./frontend-patterns/SKILL.md) | Frontend development patterns for React and Next.js. |
| [frontend-slides](./frontend-slides/SKILL.md) | Create animation-rich HTML presentations. |
| [generating-python-installer](./generating-python-installer/SKILL.md) | Commercial-grade Python installer optimization for Windows. |
| [github-ops](./github-ops/SKILL.md) | GitHub repository operations for open-source maintenance. |
| [golang-patterns](./golang-patterns/SKILL.md) | Idiomatic Go patterns and conventions. |
| [golang-testing](./golang-testing/SKILL.md) | Go testing patterns, benchmarks, fuzzing, and coverage. |
| [grill-me](./grill-me/SKILL.md) | A relentless interview to sharpen a plan or design. |
| [grill-with-docs](./grill-with-docs/SKILL.md) | A grilling workflow that also creates docs. |
| [grilling](./grilling/SKILL.md) | Stress-test a plan, decision, or idea through questions. |
| [handoff](./handoff/SKILL.md) | Compact the current conversation for another agent. |
| [health](./health/SKILL.md) | Audit AI engineering configuration health. |
| [hunt](./hunt/SKILL.md) | Find root cause before applying fixes. |
| [implement](./implement/SKILL.md) | Implement work based on a spec or set of tickets. |
| [improve-codebase-architecture](./improve-codebase-architecture/SKILL.md) | Find codebase architecture improvement opportunities. |
| [interview](./interview/SKILL.md) | 简历驱动的面试预测与连续追问。 |
| [java-coding-standards](./java-coding-standards/SKILL.md) | Java coding standards for Spring Boot and Quarkus. |
| [job-apply](./job-apply/SKILL.md) | 中文求职申请表自动填写辅助。 |
| [learn](./learn/SKILL.md) | Six-phase research workflow for unfamiliar material. |
| [make-resume](./make-resume/SKILL.md) | 中文可编辑 HTML 简历制作。 |
| [offer](./offer/SKILL.md) | 秋招投递和招聘邮件进度管理。 |
| [open-source-readme](./open-source-readme/SKILL.md) | Create, rewrite, or review README files. |
| [ppp-creator](./ppp-creator/SKILL.md) | Create concise PPP work status updates. |
| [project-bootstrap](./project-bootstrap/SKILL.md) | 初始化项目骨架和工程规范。 |
| [project-guide](./project-guide/SKILL.md) | 中文项目导学、项目分析和项目面经整理。 |
| [prototype](./prototype/SKILL.md) | Build a throwaway prototype to answer a design question. |
| [python-patterns](./python-patterns/SKILL.md) | Pythonic idioms, type hints, and best practices. |
| [python-testing](./python-testing/SKILL.md) | Python testing with pytest, fixtures, mocking, and coverage. |
| [react-native-patterns](./react-native-patterns/SKILL.md) | React Native and Expo app patterns. |
| [react-patterns](./react-patterns/SKILL.md) | React 18/19 patterns for components, hooks, and boundaries. |
| [react-performance](./react-performance/SKILL.md) | React and Next.js performance optimization. |
| [react-testing](./react-testing/SKILL.md) | React component and hook testing patterns. |
| [react-ts-project-template](./react-ts-project-template/SKILL.md) | Vite + React + TypeScript SPA project templates. |
| [read](./read/SKILL.md) | Read, summarize, quote, cite, or convert URLs and PDFs. |
| [research](./research/SKILL.md) | Research a question against high-trust sources. |
| [resolving-merge-conflicts](./resolving-merge-conflicts/SKILL.md) | Resolve an in-progress git merge or rebase conflict. |
| [risk-based-code-review](./risk-based-code-review/SKILL.md) | Prepare human review checklists for risky code. |
| [rule-creator](./rule-creator/SKILL.md) | 编写和审查 rules 规范文档。 |
| [rust-newtype-pattern](./rust-newtype-pattern/SKILL.md) | Rust type-safe wrappers and newtype decisions. |
| [rust-patterns](./rust-patterns/SKILL.md) | Idiomatic Rust patterns and ownership practices. |
| [rust-testing](./rust-testing/SKILL.md) | Rust unit, integration, async, and property-based testing. |
| [rust-tokio-practices](./rust-tokio-practices/SKILL.md) | Practical Tokio async conventions. |
| [rust-typestate-audit](./rust-typestate-audit/SKILL.md) | Audit Rust typestate candidates. |
| [rust-workflow](./rust-workflow/SKILL.md) | Rust workflow setup and verification. |
| [safety-guard](./safety-guard/SKILL.md) | Prevent destructive operations in sensitive contexts. |
| [security-review](./security-review/SKILL.md) | Security checklist and patterns for sensitive features. |
| [security-scan](./security-scan/SKILL.md) | Scan Claude configuration for security issues. |
| [setup-matt-pocock-skills](./setup-matt-pocock-skills/SKILL.md) | Configure companion setup for Matt Pocock engineering skills. |
| [skill-creator](./skill-creator/SKILL.md) | Guide for creating effective skills. |
| [springboot-patterns](./springboot-patterns/SKILL.md) | Spring Boot architecture and REST patterns. |
| [springboot-security](./springboot-security/SKILL.md) | Spring Security best practices. |
| [springboot-tdd](./springboot-tdd/SKILL.md) | TDD for Spring Boot. |
| [springboot-verification](./springboot-verification/SKILL.md) | Verification loop for Spring Boot projects. |
| [tdd](./tdd/SKILL.md) | Test-driven development workflow. |
| [teach](./teach/SKILL.md) | Teach a new skill or concept. |
| [tech-blog-coach](./tech-blog-coach/SKILL.md) | Turn technical notes into a Hugo blog article. |
| [think](./think/SKILL.md) | Turn rough ideas into decision-complete plans. |
| [to-spec](./to-spec/SKILL.md) | Turn the current conversation into a spec. |
| [to-tickets](./to-tickets/SKILL.md) | Break a plan or spec into tickets. |
| [triage](./triage/SKILL.md) | Triage issues and external PRs. |
| [ui](./ui/SKILL.md) | Production-grade UI and visual polish. |
| [ui-demo](./ui-demo/SKILL.md) | Record polished UI demo videos with Playwright. |
| [wayfinder](./wayfinder/SKILL.md) | Plan large work as a shared decision map. |
| [write](./write/SKILL.md) | Rewrite and polish Chinese or English prose. |
| [writing-for-agents](./writing-for-agents/SKILL.md) | Writing documents for agents, skills, AGENTS.md, and CLAUDE.md. |

## 维护命令

在仓库根目录运行：

```bash
npm run skills:check
npm run sources:check
npm run skills:inventory
npm run validate
```

这些命令分别用于：

- `skills:check`：检查每个 skill 的 `SKILL.md`、frontmatter 和 README 链接。
- `sources:check`：检查 `skills-lock.json` 中已记录来源的结构和 hash。
- `skills:inventory`：输出当前 skill 清单、来源类型和 hash 状态。
- `validate`：运行仓库内的默认质量检查。

新增或删除 skill 后，请至少运行：

```bash
npm run skills:check
```

如果新增的是外部 vendored skill，再更新 `skills-lock.json` 并运行：

```bash
npm run sources:check
```
