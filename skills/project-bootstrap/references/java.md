# Java / Spring Boot 栈

> 锚点最后验证日期：2026-07-20
> 本文件只持有「rules 锚点 + 少量增量」，模板内容一律去 rules 读原文。

## rules 锚点

| 用途 | rules 源 | 章节 |
|---|---|---|
| lefthook.yml 完整配置 | `~/.claude/rules/java/java-workflow-standards.md` | §3.3 参考配置 |
| 工具链选型与节奏 | 同上 | §1.1 职责一览 + §2 本地命令节奏 |
| DDD 分层目录结构 | `~/.claude/rules/ddd-architecture.md` | 「分层架构实现」 |
| Java 编码 HARD RULE | `~/.claude/rules/java/java-coding-standards.md` | 全文 |
| commit 规范 | `~/.claude/rules/conventional-commit.md` | 项目特定约定 |

## lefthook.yml（物化指令）

直接复制 `java-workflow-standards.md` §3.3 的 YAML 原文，**不要自行改命令**。增量仅一条：

- **Gradle 项目**：把所有 `./mvnw -q xxx` 替换为 `./gradlew -q xxx`，命令名对应关系（Spotless / Checkstyle / SpotBugs / JaCoCo 在 Gradle 里同样是这些插件 task，名字一致）。
- **前提**：项目根已有 `mvnw` / `gradlew` wrapper；无 wrapper 时提示用户先生成，不在 hook 里裸写 `mvn`/`gradle`（rules §4 禁止混用）。

## 目录结构（物化指令）

按 `ddd-architecture.md`「分层架构实现」建包骨架。单模块应用在 `src/main/java/<group>/<artifact>/` 下建分层包；多模块 Maven 项目按 `api / app / domain / infrastructure / trigger / types` 拆 module。**不确定模块划分时先问用户**，不臆造。

必建空目录（`.gitkeep` 占位）：`src/main/java/`、`src/test/java/`、`src/main/resources/`。分层包是否预建由用户决定，rules 未强制要求空包存在。

## 依赖工具

pre-commit/pre-push 依赖的外部工具（rules §1.1）：`gitleaks`（Secret 检测）、`gitlint`（commit-msg）。检测不到时提示用户安装，不静默跳过该 hook——宁可在 hook 里保留命令让用户首次提交时按报错安装，也不要删命令。
