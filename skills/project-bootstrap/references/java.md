# Java / Spring Boot 栈

> 维护说明：rules 章节名变化时，同步更新本文件的 Rule key 与使用锚点。
> 本文件只持有「rules 指针 + 少量增量」，模板内容一律去 rules 读原文。

## rules 指针

`<rules>` 由 `project-bootstrap` 定义为当前宿主的 rules 根目录。先解析下列 rule key，再按「使用锚点」读取对应章节。

| Rule key | 文件 |
|---|---|
| `java-workflow` | `<rules>/java/java-workflow-standards.md` |
| `ddd-architecture` | `<rules>/ddd-architecture.md` |
| `java-coding` | `<rules>/java/java-coding-standards.md` |
| `java-nullsafety` | `<rules>/java/java-nullsafety.md` |
| `conventional-commit` | `<rules>/common/conventional-commit.md` |

## 使用锚点

| 用途 | Rule key | 章节 |
|---|---|---|
| lefthook.yml 完整配置 | `java-workflow` | §3.3 参考配置 |
| 工具链选型与节奏 | `java-workflow` | §1.1 职责一览 + §2 本地命令节奏 |
| DDD 分层目录结构 | `ddd-architecture` | 「分层架构实现」 |
| Java 编码 HARD RULE | `java-coding` | 全文 |
| Java nullability 默认契约 | `java-nullsafety` | 「Java 代码生成约束」 |
| JSpecify / NullAway 接入 | `java-nullsafety` | 「工程接入策略」 |
| commit 规范 | `conventional-commit` | 项目特定约定 |

## lefthook.yml（物化指令）

直接复制 `java-workflow-standards.md` §3.3 的 YAML 原文，**不要自行改命令**。增量仅一条：

- **Gradle 项目**：把所有 `./mvnw -q xxx` 替换为 `./gradlew -q xxx`，命令名对应关系（Spotless / Checkstyle / SpotBugs / JaCoCo 在 Gradle 里同样是这些插件 task，名字一致）。
- **前提**：项目根已有 `mvnw` / `gradlew` wrapper；无 wrapper 时提示用户先生成，不在 hook 里裸写 `mvn`/`gradle`（rules §4 禁止混用）。

## 目录结构（物化指令）

按 `ddd-architecture.md`「分层架构实现」建包骨架。单模块应用在 `src/main/java/<group>/<artifact>/` 下建分层包；多模块 Maven 项目按 `api / app / domain / infrastructure / trigger / types` 拆 module。**不确定模块划分时先问用户**，不臆造。

必建空目录（`.gitkeep` 占位）：`src/main/java/`、`src/test/java/`、`src/main/resources/`。分层包是否预建由用户决定，rules 未强制要求空包存在。

## Null Safety（物化指令）

初始化 Java/Spring 生产项目时，询问用户是否接入 NullAway；默认推荐接入。用户同意后才修改 `pom.xml` / `build.gradle`，用户拒绝时不修改构建文件，但仍按 `java-nullsafety` 的 Java 代码生成约束生成新代码。

模板资产：

| 目标 | 模板资产 |
|---|---|
| Maven NullAway 配置片段 | `assets/templates/java/maven-nullaway-plugin.xml` |
| Gradle Groovy NullAway 配置片段 | `assets/templates/java/gradle-nullaway.gradle` |
| package-info.java | `assets/templates/java/package-info.java` |

物化规则：

- 新项目默认使用 `OnlyNullMarked=true`，不使用 `AnnotatedPackages`。
- 只支持 Maven `pom.xml` 与 Gradle Groovy `build.gradle` 的最小接入；`build.gradle.kts`、多模块父子配置、已有 Error Prone 复杂配置必须先读项目结构后现场处理。
- 能从 Spring Boot 主类或既有 Java package 推出 base package 时，按 `package-info.java` 模板生成 `src/main/java/<base-package>/package-info.java`。
- 不能确定 base package 时，不臆造 `com.example`；在收尾说明提示用户确定 base package 后补 `package-info.java`。
- 不生成 NullAway demo class。接入后用项目现有 wrapper 执行最小验证：Maven `./mvnw -q test` 或 `./mvnw -q verify`，Gradle `./gradlew test` 或 `./gradlew check`。
- 无 wrapper、空项目或依赖下载不可用时，只报告“已配置，未本地验证”，不裸写 `mvn` / `gradle` 命令。

## GitHub Actions CI

只在 `project-bootstrap` 主流程判定需要 GitHub Actions CI 时生成 `.github/workflows/ci.yml`；若同名文件已存在，跳过并提示，不覆盖。

Maven wrapper 项目：

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  java:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "21"
          cache: maven
      - run: ./mvnw -q verify
```

Gradle wrapper 项目：

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  java:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "21"
          cache: gradle
      - run: ./gradlew check
```

前提：项目根已有 `mvnw` / `gradlew` wrapper；无 wrapper 时提示用户先生成，不在 CI 里裸写 `mvn`/`gradle`。

## 依赖工具

pre-commit/pre-push 依赖的外部工具（rules §1.1）：`gitleaks`（Secret 检测）、`gitlint`（commit-msg）。检测不到时提示用户安装，不静默跳过该 hook——宁可在 hook 里保留命令让用户首次提交时按报错安装，也不要删命令。
