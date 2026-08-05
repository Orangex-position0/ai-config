# Claude Skills 目录

本目录收录 Claude Code 自定义 Skills（技能），按功能领域分类组织。每个 Skill 都是独立的增强包，通过 `SKILL.md` 元数据声明触发条件与工作流，Claude 会在合适时机自动加载。

## 快速索引

| 名称 | 一句话描述 |
|------|-----------|
| [check](./check/SKILL.md) | 代码审查、PR 检查、发布前关卡 |
| [health](./health/SKILL.md) | AI 工程配置健康度审计 |
| [hunt](./hunt/SKILL.md) | 错误根因定位（先诊断后修复） |
| [learn](./learn/SKILL.md) | 深度研究工作流（六阶段） |
| [read](./read/SKILL.md) | URL 与 PDF 内容抓取阅读 |
| [frontend-design](./frontend-design/SKILL.md) | 前端界面/组件/海报设计 |
| [think](./think/SKILL.md) | 方案设计与决策完整规划 |
| [adr](./adr/SKILL.md) | 架构决策记录（ADR）的编写与审计 |
| [write](./write/SKILL.md) | 中英文文案润色、去 AI 味 |
| [tech-blog-coach](./tech-blog-coach/SKILL.md) | 基于费曼学习法的技术博客教练 |
| [rust-patterns](./rust-patterns/SKILL.md) | Rust 惯用模式、所有权、错误处理、并发与类型建模 |
| [rust-testing](./rust-testing/SkILL.md) | Rust 单元测试、集成测试、异步测试与 TDD |
| [rust-tokio-practices](./rust-tokio-practices/SKILL.md) | Tokio 任务生命周期、取消、队列与 shutdown 审查 |
| [rust-typestate-audit](./rust-typestate-audit/SKILL.md) | Rust typestate 候选识别、取舍与最小重构 |
| [rust-workflow](./rust-workflow/SKILL.md) | Rust 项目初始化、工具链、CI、hooks 与 Cargo 工作流 |
| [skill-creator](./skill-creator/SKILL.md) | 创建与维护 Skill 的元指南 |

---

## 按领域分类

### 1. 代码审查与质量（Code Review & Quality）

| Skill | 触发场景 | 输出物 |
|-------|---------|--------|
| [check](./check/SKILL.md) | review、看看代码、合并前、PR、release、push | 安全门禁、问题清单、修复建议 |
| [health](./health/SKILL.md) | 检查 Claude/Codex/Pi 配置、健康度、AI 腐化 | 配置审计报告、修复建议 |
| [hunt](./hunt/SKILL.md) | 排查、报错、崩溃、不工作、回归 | 根因分析报告（先诊断后修复） |

### 2. 学习与研究（Learning & Research）

| Skill | 触发场景 | 输出物 |
|-------|---------|--------|
| [learn](./learn/SKILL.md) | 学习一下、深入研究、整理成文章 | 六阶段研究工作流的可发布成果 |
| [read](./read/SKILL.md) | 看这个链接、读一下、抓取网页 | 简洁摘要或干净 Markdown |

### 3. 设计与前端（Design & Frontend）

| Skill | 触发场景 | 输出物 |
|-------|---------|--------|
| [frontend-design](./frontend-design/SKILL.md) | 构建网页/组件/海报/landing page | 独具特色的前端代码（避免 AI 模板感） |

### 4. 写作与规划（Writing & Planning）

| Skill | 触发场景 | 输出物 |
|-------|---------|--------|
| [think](./think/SKILL.md) | 出方案、给方案、怎么设计、值不值得 | 决策完整的可执行计划 |
| [adr](./adr/SKILL.md) | 写 ADR、记录架构决策、审计 ADR | 含 5 要素与生命周期的 ADR 文档 |
| [write](./write/SKILL.md) | 帮我写、改稿、润色、去 AI 味 | 自然流畅的中英文文案 |
| [tech-blog-coach](./tech-blog-coach/SKILL.md) | 技术博客写作、笔记转文章 | 五段式结构文章、写作策略 |

### 5. Rust

| Skill | 触发场景 | 输出物 |
|-------|---------|--------|
| [rust-patterns](./rust-patterns/SKILL.md) | 编写、审查、重构 Rust 代码或设计 crate 结构 | Rust 惯用模式与类型建模建议 |
| [rust-testing](./rust-testing/SkILL.md) | 编写 Rust 测试、补覆盖率、异步测试、TDD | Rust 测试方案与测试代码 |
| [rust-tokio-practices](./rust-tokio-practices/SKILL.md) | 审查 `tokio::spawn`、任务泄漏、取消、shutdown、bounded queue | Tokio 生命周期审查与重构建议 |
| [rust-typestate-audit](./rust-typestate-audit/SKILL.md) | 识别可改造为 typestate 的 Rust API、builder 或资源生命周期 | typestate 候选表、取舍建议、最小重构 |
| [rust-workflow](./rust-workflow/SKILL.md) | 初始化或改造 Rust 工具链、CI、hooks、Cargo 配置 | Rust 工作流配置与验证命令 |

### 6. 元工具（Meta Tools）

| Skill | 触发场景 | 输出物 |
|-------|---------|--------|
| [skill-creator](./skill-creator/SKILL.md) | 创建新 skill、更新现有 skill | 符合规范的 Skill 包（SKILL.md + 资源） |

---

## 使用方式

### 自动触发
Claude 会在用户消息命中某 Skill 的 `description` / `when_to_use` 关键词时，通过 `Skill` 工具自动加载。例如：
- 用户说"帮我看看这段代码有没有问题" → 触发 **check**
- 用户说"学习一下 pandas DataFrame" → 触发 **api-query**

### 显式调用
在 Claude Code 中输入 `/skill-name` 或在对话中点名：
```
/write 帮我润色这段产品介绍
/hunt 这个报错是什么原因
```

### 目录结构约定
每个 Skill 至少包含一个 `SKILL.md`，常见附加资源：
```
skill-name/
├── SKILL.md           # 必需：技能元数据与工作流
├── references/        # 可选：参考文档与模板
├── scripts/           # 可选：辅助脚本
└── assets/            # 可选：静态资源
```

---

## 维护说明

- 新增 Skill 后，请在「快速索引」与对应分类表中补全条目
- Skill 描述需与 `SKILL.md` 中 frontmatter 的 `description` 字段保持一致
- 若 Skill 被废弃或合并，请同步删除本文件中的引用
