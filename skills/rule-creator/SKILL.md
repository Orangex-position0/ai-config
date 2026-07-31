---
name: rule-creator
description: >
  编写和审查 ~/.claude/rules/ 下的规范文档（Rules 编写元规范）。
  当用户要求"写 rule"、"新建规范文档"、"修改 rules/*.md"、"检查 rule 是否符合规范"、
  "判断内容该用 rule、Skill、Command、Agent 还是 Hook / script"时触发。提供命名、
  Frontmatter（paths）、章节结构（WHY/WHAT/HOW）、格式、元数据，以及 AI Coding
  资源分层判断。
---

# Rules 编写规范 (Rules Authoring Spec)

> 元规范 Skill：定义 `~/.claude/rules/` 下所有 `.md` 文档的编写规范。
> 按语义触发加载——仅在编写 / 修改 rule 文档时进入，不占日常 context。
> （前身是 `~/.claude/RULES_SPEC.md`，已迁移为 Skill 以修复"孤儿文档"身份，并自洽第 3.1 节"语义触发应用 Skill"原则。）

## 1. 核心原则

| 原则 | 说明 |
|------|------|
| **单一职责** | 一个文件承载一个主题（一种语言 / 一个领域 / 一类规范） |
| **行数 < 200** | Anthropic 官方推荐上限。超长会"消耗更多 context + 降低遵循度"。来源：[How Claude remembers your project](https://code.claude.com/docs/en/memory) |
| **只写非默认约定** | 默认行为、官方风格指南不用复述 |
| **不重复 linter** | 格式化、import 排序等交给 ESLint/Prettier/rustfmt/google-java-format |
| **可验证** | 规则必须具体到能判断"是否遵循" |

## 2. 文件命名

- 使用 kebab-case（如 `java-coding-standards.md`）
- 语言/技术栈前缀：`java-*`、`rust-*`、`spring-boot-*`、`python-*`
- 后缀约定：
  - `*-standards.md`：硬性规范（必须遵守）
  - `*-conventions.md`：约定（推荐遵守）
  - `*-guide.md`：指南（方法论）
  - `*-specification.md`：完整规范（含术语、FAQ）

## 3. Frontmatter

### 3.1 字段规则（核心：防止字段污染）

**Rules 系统仅支持 `paths` 一个字段**，用于按文件路径 glob 触发自动加载。

**禁止引入以下字段**（属于其他系统，rules 加载器会忽略，等价于死字）：

| 禁用字段 | 实际归属 |
|---------|---------|
| `description` / `name` / `when_to_use` / `disable-model-invocation` | Skills 系统 |
| `alwaysApply` / `globs`（部分版本） | Cursor / 其他 IDE |

如需"按语义触发加载"，应改用 Skill（见 `../../templates/domain-skill.template.md` 与本文件第 8 节），不要塞进 rules。

### 3.2 无 Frontmatter（全局加载）

适用于**跨语言/跨场景**的规则，每次启动都加载：

```markdown
# Conventional Commit 规范
...
```

示例：`conventional-commit.md`、`date-handling-specification.md`、`ddd-architecture.md`、`api-documentation.md`。

### 3.3 有 Frontmatter（按需加载）

适用于**特定语言/场景**的规则，仅在 Claude 读取匹配文件时加载：

```markdown
---
paths:
  - "**/*.java"
---

# Java Coding Standards
...
```

**常用 paths 模式**：

| 场景 | paths |
|------|-------|
| Java 源码 | `**/*.java` |
| Java 测试 | `**/src/test/**/*.java`, `**/*{Test,IT}.java` |
| Rust 源码 | `**/*.rs`, `**/Cargo.toml` |
| Go 源码 | `**/*.go` |
| Python 源码 | `**/*.py` |
| JavaScript / TypeScript | `**/*.{js,ts,jsx,tsx}` |
| 测试代码（通用） | `**/{src/test,tests}/**`, `**/*{Test,Spec}.*` |
| Spring Boot | `**/*.java`, `**/application*.{yml,yaml,properties}` |

## 4. 章节结构

按 WHY → WHAT → HOW 组织：

```markdown
# <文档名>

> 一句话定位：本规范解决什么问题。

## 1. Why（为什么）
该规范的动机、过去踩过的坑。

## 2. What（规则）
按优先级分组（HARD > DESIGN > STYLE）。

## 3. Examples（示例）
正例 / 反例对比。

## 4. Anti-patterns（反模式）
常见错误及修正方式。
```

**最小结构**（短文档可省略部分章节）：标题 + 规则 + 示例。

新建 rules 时建议从模板起步：`../../templates/rule.template.md`。

## 5. 格式规范

### 5.1 语言

- **正文中文为主**
- **代码实体保英文**：类名、函数名、变量名、库名、框架名
- **标题可中英混用**

### 5.2 反例与正例

统一使用 `❌` / `✅` + 代码块对比，或用表格（适用于多条规则）。

### 5.3 代码锚点

引用项目内代码时，使用 `path/to/File.ext:line` 格式。

### 5.4 禁止格式

- ❌ 行尾注释（严格遵守 CLAUDE.md 第二部分）
- ❌ 表格列超过 5 列
- ❌ 嵌套列表超过 4 级

## 6. 元数据与变更日志

长文档（> 100 行）建议在文末添加：

```markdown
## 文档元数据

- 规范名称：XXX 规范
- 当前版本：v1.0.0
- 最新更新：YYYY-MM-DD
- 维护负责人：<name>

### 变更日志
| 版本 | 日期 | 修订人 | 变更摘要 |
|------|------|--------|---------|
| v1.0.0 | YYYY-MM-DD | <name> | 首次发布 |
```

短文档（< 100 行）可省略。

**版本号升级触发**：major=破坏性变更 / minor=新增规则 / patch=文字修正。

## 7. 交叉引用与相关文档

- 引用其他 rules：使用相对路径 `rules/xxx.md`（**不**用 `@import`，会被展开加载）
- 引用 CLAUDE.md：直接写 `CLAUDE.md` 第几部分
- 引用外部标准：用 markdown 链接

**相关文档体系**：

| 文档 | 位置 | 职责 |
|------|------|------|
| `CLAUDE.md` | `~/.claude/CLAUDE.md` | 全局索引，顶层思想 |
| `rules/*.md` | `~/.claude/rules/*.md` | 具体规范，单一主题，按需加载 |
| `templates/*.md` | `~/.claude/templates/*.md` | 文档模板（rules / domain-skill） |
| `rule-creator`（本 Skill） | `~/.claude/skills/rule-creator/SKILL.md` | Rules 编写元规范，按语义触发 |
| `rules/domain-skill-authoring.md` | rules 目录 | 领域 Skill 编写规范 |

## 8. Rule 与其他资源的内容分工

创建或审查 Rule / Skill 时，先遵循 [AI Coding 资源管理体系](../../rules/ai-coding-resource-management.md)：Rule 写原则底线，Skill 写任务落地。

Rule 和 Skill 承载不同形态的知识，混写会两头不讨好。判断标准是**内容形态**，不是主题：

| 维度 | Rule（`rules/*.md`） | Skill（`.claude/skills/*.md`） |
|------|---------------------|-------------------------------|
| 定位 | 编码底线、原则性条目 | 可执行的操作手册 |
| 内容形态 | 简练的"应该 / 禁止"判断 | 详细步骤、命令行、完整正反例代码 |
| 加载方式 | 按 `paths` 自动加载 | 按 `description` 语义匹配 |
| 体量上限 | < 200 行（硬性） | 按需展开，可较长 |

### 8.1 迁移信号

当 rule 文档出现以下迹象，说明它已越出 rule 职责，应**推荐转为 Skill**：

- 大段步骤化操作流程（"先 A，再 B，最后 C"）
- 成段的命令行调用与输出解读
- 多组完整正反例代码（超出"一两条点睛反例"）
- 行数逼近 200 行上限，且无法靠精简压缩

### 8.2 迁移方式

转 Skill 后，**原 rule 文档保留**，退守为"原则性底线"：

1. Skill 承载详细步骤、命令行与完整代码示例
2. Skill 在头部引用 rule 作为不可违背的底线（如"遵循 [xxx 规范](rules/xxx.md)"）
3. rule 精简为原则条目，删除已迁入 Skill 的步骤性内容

如此 rule 保持简练、随路径自动加载；Skill 按语义按需展开，两者职责不重叠。

> 领域 Skill 的完整编写规范见 [domain-skill-authoring.md](../../rules/domain-skill-authoring.md)。

当内容更像用户显式入口、委派角色或确定性自动化时，不要硬塞进 Rule：高频入口放 Command，独立职责放 Agent，自动检查或阻断放 Hook / script。

## 9. 检查清单

提交新 rules 文档前，逐项核对：

- [ ] 文件名 kebab-case，语言前缀正确
- [ ] 行数 < 200（超长则拆分、精简，或转为 Skill）
- [ ] 内容定位是原则底线；若以步骤 / 命令 / 完整正反例为主，转为 Skill 并反向引用本 rule
- [ ] frontmatter 字段是 `paths` 或无（禁用 `description` / `alwaysApply` 等）
- [ ] 章节结构清晰（WHY/WHAT/HOW）
- [ ] 反例正例格式统一（❌/✅ 或表格）
- [ ] 无行尾注释
- [ ] 无重复 linter 能做的规则
- [ ] 长文档有元数据和变更日志
- [ ] 已 `chezmoi add` 纳入版本控制

## 文档元数据

- 规范名称：Rules 编写规范 (Rules Authoring Spec)
- 当前版本：v1.3.0
- 最新更新：2026-07-20
- 维护负责人：Xu Chengzi

### 变更日志

| 版本 | 日期 | 修订人 | 变更摘要 |
|------|------|--------|---------|
| v1.3.0 | 2026-07-20 | Xu Chengzi | 由 `~/.claude/RULES_SPEC.md` 迁移为 `skills/rule-creator` Skill，修复"孤儿文档"身份并自洽 3.1 节语义触发原则；相对路径适配（templates/rules 深两级）。 |
| v1.2.0 | 2026-07-20 | Xu Chengzi | 新增第 8 节 Rule 与 Skill 的内容分工（迁移信号与迁移方式）；检查清单补充分工核对项。 |
| v1.1.0 | 2026-07-02 | Xu Chengzi | 加入字段污染防护（禁用 Skills/Cursor 专属字段）；引用 rule 模板；补全 paths 模式表；明确版本号升级规则。 |
| v1.0.0 | 2026-06-23 | Xu Chengzi | 首次制定。明确命名、Frontmatter、章节结构、格式、元数据规范。 |
