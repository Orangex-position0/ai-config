# Claude Skills 目录

本目录收录了 20 个 Claude Code 自定义 Skills（技能），按功能领域分类组织。每个 Skill 都是独立的增强包，通过 `SKILL.md` 元数据声明触发条件与工作流，Claude 会在合适时机自动加载。

## 快速索引

| 名称 | 一句话描述 |
|------|-----------|
| [check](./check/SKILL.md) | 代码审查、PR 检查、发布前关卡 |
| [health](./health/SKILL.md) | AI 工程配置健康度审计 |
| [hunt](./hunt/SKILL.md) | 错误根因定位（先诊断后修复） |
| [learn](./learn/SKILL.md) | 深度研究工作流（六阶段） |
| [codebase-learner](./codebase-learner/SKILL.md) | 将代码库转化为渐进式学习材料 |
| [api-query](./api-query/SKILL.md) | 任意语言/库的 API 学习工具 |
| [read](./read/SKILL.md) | URL 与 PDF 内容抓取阅读 |
| [design](./design/SKILL.md) | 生产级 UI 设计（带观点） |
| [frontend-design](./frontend-design/SKILL.md) | 前端界面/组件/海报设计 |
| [think](./think/SKILL.md) | 方案设计与决策完整规划 |
| [adr](./adr/SKILL.md) | 架构决策记录（ADR）的编写与审计 |
| [write](./write/SKILL.md) | 中英文文案润色、去 AI 味 |
| [tech-blog-coach](./tech-blog-coach/SKILL.md) | 基于费曼学习法的技术博客教练 |
| [changelog-generator](./changelog-generator/SKILL.md) | Keep a Changelog 规范生成器 |
| [ppp-generator](./ppp-generator/SKILL.md) | PPP（Progress-Plans-Problems）工作文档 |
| [to-prd](./to-prd/SKILL.md) | 从当前对话上下文生成 PRD |
| [repo-analyzer](./repo-analyzer/SKILL.md) | 仓库架构与技术栈分析报告 |
| [project-interview-prep](./project-interview-prep/SKILL.md) | 针对个人项目生成面试题 |
| [code-interview](./code-interview/SKILL.md) | 交互式代码面试模拟器 |
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
| [codebase-learner](./codebase-learner/SKILL.md) | help me learn this project、codebase walkthrough | 交互式 HTML 课程或 Markdown 笔记 |
| [api-query](./api-query/SKILL.md) | 学习 X 库、学习 React hooks | 概览+场景案例+Demo+练习题 |
| [read](./read/SKILL.md) | 看这个链接、读一下、抓取网页 | 简洁摘要或干净 Markdown |

### 3. 设计与前端（Design & Frontend）

| Skill | 触发场景 | 输出物 |
|-------|---------|--------|
| [design](./design/SKILL.md) | 设计、做页面、做组件、UI、截图 | 带观点的生产级 UI 代码 |
| [frontend-design](./frontend-design/SKILL.md) | 构建网页/组件/海报/landing page | 独具特色的前端代码（避免 AI 模板感） |

### 4. 写作与规划（Writing & Planning）

| Skill | 触发场景 | 输出物 |
|-------|---------|--------|
| [think](./think/SKILL.md) | 出方案、给方案、怎么设计、值不值得 | 决策完整的可执行计划 |
| [adr](./adr/SKILL.md) | 写 ADR、记录架构决策、审计 ADR | 含 5 要素与生命周期的 ADR 文档 |
| [write](./write/SKILL.md) | 帮我写、改稿、润色、去 AI 味 | 自然流畅的中英文文案 |
| [tech-blog-coach](./tech-blog-coach/SKILL.md) | 技术博客写作、笔记转文章 | 五段式结构文章、写作策略 |
| [changelog-generator](./changelog-generator/SKILL.md) | 生成 changelog、记录变更 | Keep a Changelog 格式条目 |
| [ppp-generator](./ppp-generator/SKILL.md) | 生成 PPP、工作日报、站会记录 | Progress-Plans-Problems 三段文档 |
| [to-prd](./to-prd/SKILL.md) | 把对话转为 PRD | 可发布到 Issue Tracker 的 PRD |

### 5. 项目分析（Project Analysis）

| Skill | 触发场景 | 输出物 |
|-------|---------|--------|
| [repo-analyzer](./repo-analyzer/SKILL.md) | project analysis、codebase review、code audit | Markdown + HTML 双格式分析报告 |
| [project-interview-prep](./project-interview-prep/SKILL.md) | 面试题、面试准备、项目复习 | Anki CSV + Markdown 面试题集 |
| [code-interview](./code-interview/SKILL.md) | 面试我、考考我、quiz me | 多轮问答 + 结构化评估报告 |

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
