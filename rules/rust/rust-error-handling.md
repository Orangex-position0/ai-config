---
paths:
  - "**/*.rs"
---

# Rust Error Handling

> 按“错误最终由谁消费”选择错误类型，并在语义边界转换错误。

## Core Rules

1. **优先传播**：使用 `?` 让错误上移，在应用边界、命令入口或 HTTP 层处理。
2. **按消费者选择类型**：可被调用方编程处理的 library API 使用 `thiserror`；应用内部或最终只需报告的流程使用 `anyhow`。
3. **公共错误枚举保护演进**：跨 crate 的 public error enum 默认加 `#[non_exhaustive]`；仅 crate 内部使用的错误不强制添加。
4. **隐藏实现细节**：不要在稳定 public API 中直接暴露 `sqlx::Error`、`redis::RedisError` 等基础设施错误；转换为当前模块的语义错误，并保留底层错误作为 `source`。
5. **按处理策略设计 variant**：调用方真正需要区分的应是 `Retry`、`Wait`、`Abort` 等处理策略，而非 DNS、TCP、TLS 等底层原因。
6. **只在语义边界转换**：典型边界为“底层库 → 模块 / 领域 → 应用”。多层包装或大量 `From` 组合是重新检查边界的信号，不是必须遵守的层数限制。
7. **上下文要延迟生成**：固定上下文使用 `.context("...")`；依赖变量或计算的上下文使用 `.with_context(|| ...)`，避免成功路径上的无用计算。
8. **不要用默认值吞掉失败**：只有业务明确允许 fallback 时才使用 `unwrap_or*`；失败不属于合法 fallback 时应传播或转换。
9. **仅在不变量保证下使用 `expect()`**：必须写出失败为何不可能的原因；生产代码不要使用裸 `unwrap()`。
10. **生产可恢复失败返回 `Result`**：不要从可失败路径主动 `panic!`。

## Public Error Example

```rust
use thiserror::Error;

#[derive(Debug, Error)]
#[non_exhaustive]
pub enum CacheError {
    #[error("key `{0}` not found")]
    NotFound(String),
    #[error("cache backend failed")]
    Backend {
        #[source]
        source: Box<dyn std::error::Error + Send + Sync>,
    },
}
```

## Decision Checklist

修改 Rust 错误类型或错误边界时，逐项检查：

- 错误最终由 library caller、application boundary，还是日志 / CLI 消费？
- public API 是否泄露数据库、网络、框架等底层错误类型？
- variant 是否对应调用方可采取的不同处理策略？
- 新增 public variant 是否需要 `#[non_exhaustive]` 保护下游匹配？
- 是否只在真正的语义边界转换，而不是逐层机械包装？
- 动态 context 是否使用 `.with_context`？
- fallback 是否有明确的业务语义？

## Lint Enforcement

Use targeted lints for code that must not panic on recoverable failures. Clippy's `restriction` lints are opt-in and should be enabled case by case, not as the whole group.

```rust
#![deny(clippy::unwrap_used)]
#![deny(clippy::expect_used)]
#![deny(clippy::panic)]
#![deny(unused_must_use)]
```

Allow exceptions locally with a short reason when the invariant is real:

```rust
#[expect(clippy::expect_used, reason = "embedded migration is compiled into the binary")]
let migration = include_str!("migration.sql").parse::<Migration>().expect("valid migration");
```

## Safe Option and Result Handling

| Method | Use case | Notes |
|------|----------|------|
| `?` | Error should propagate | Idiomatic default |
| `unwrap_or(default)` | Error has a valid default | Do not use to hide failures |
| `unwrap_or_else` | Fallback needs computation or the error | Lazy; runs only when needed |
| `.ok()` | Only success matters | Deliberately discards error details |
| `or_else` | Recover with another valid result | Preserve or replace error intentionally |

```rust
fn read_config(path: &str) -> anyhow::Result<Config> {
    let content = std::fs::read_to_string(path)
        .with_context(|| format!("failed to read config from {path}"))?;
    Ok(toml::from_str(&content).context("failed to parse config")?)
}
```

## Option Fallbacks

- `unwrap_or(default)`：默认值已知且无需计算。
- `unwrap_or_else(|| expr)`：默认值需要计算，或计算成本较高。
- `unwrap_or_default()`：`T: Default` 且默认值确实符合业务语义。
- `or_else(|| Some(value))`：存在有意义的备选来源。

## Related Documents

- `rules/rust/patterns.md`：类型建模、newtype、状态机和边界设计。
- `skills/rust-patterns/SKILL.md`：Rust 开发与审查时的错误处理工作流和示例。
