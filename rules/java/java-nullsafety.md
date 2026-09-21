---
paths:
    - "**/*.java"
---

# Java Null Safety

## Java 代码生成约束

- 生产级 Java API 必须显式表达 nullability contract，不要把 unspecified 当作 nullable。
- 新代码优先在 package 级使用 JSpecify `@NullMarked`，让未标注类型默认表示 non-null。
- 只有真实允许 `null` 的 type usage 才写 `@Nullable`；使用 `@Nullable` 值前必须判空或转换为明确的业务结果。
- 不为了“可能没有值”滥用 `Optional`：返回值可以按 API 语义使用 `Optional<T>`，参数、字段和现有 Java API 迁移优先用 nullability annotation。
- 示例片段、面试题和一次性说明代码默认遵守上述语义，但不强制补齐构建工具配置。

## 工程接入策略

- 新建生产级 Java/Spring 项目时，推荐接入 JSpecify + NullAway。
- 接入 NullAway 前先询问用户；用户同意后才修改 `pom.xml` / `build.gradle`。
- 新项目默认使用 `NullAway:OnlyNullMarked=true`，通过 `package-info.java` 渐进扩大检查范围。
- Maven 与 Gradle Groovy 可使用最小模板接入；`build.gradle.kts`、多模块构建、已有 Error Prone 配置或 legacy 迁移必须先读项目结构后再改。
- 不生成 demo class 证明 NullAway 生效；用项目现有 wrapper 运行最小构建验证。
