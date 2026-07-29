---
paths:
  - "**/*.rs"
  - "**/Cargo.toml"
---

# Rust Tokio 异步编程规范

> 避免 Tokio 协作式调度下常见的任务饿死、消息丢失、死锁、取消残留与后台任务泄漏。

## 1. Why（为什么）

Tokio 采用协作式调度：worker 线程依赖任务在 `.await` 点主动让出执行权。阻塞代码、长 CPU 循环、锁跨 `.await` 都可能让其他任务饿死。

另一个常见风险是取消语义。`select!` 未选中的分支会被 drop，非取消安全的 Future 可能留下半完成状态。`tokio::spawn` 创建的任务也不是后台线程，丢弃 `JoinHandle` 不会停止任务，只会让任务 detached。

## 2. 核心规则（HARD）

| # | 规则 | 违反后果 |
|---|------|----------|
| 1 | `spawn` 内禁止阻塞代码，用 `spawn_blocking` 或异步等价物 | worker 饿死 |
| 2 | `.await` 期间不要持有锁，缩小作用域或使用 async-aware 原语 | 死锁或调度阻塞 |
| 3 | `select!` 的 Future 必须确认 cancellation safety | 消息、字节或业务状态丢失 |
| 4 | `tokio::spawn` 必须明确 owner、observer、cancellation、joining | 任务生命周期泄漏 |
| 5 | 长生命周期任务必须有取消入口 | shutdown 无法优雅收尾 |
| 6 | 服务级后台任务必须统一登记和等待 | 关闭时任务散落无人管理 |
| 7 | 后台队列默认有界 | 请求洪峰导致任务无限堆积 |
| 8 | `abort()` 只作为超时兜底，不能代替业务清理 | ack、flush、租约释放等逻辑丢失 |

## 3. spawn 任务生命周期

每次使用 `tokio::spawn` 前先回答四个问题：

| 问题 | 必须明确 |
|------|----------|
| Ownership | 谁拥有这个任务？ |
| Observation | 谁观察返回值、错误和 panic？ |
| Cancellation | 谁通知它停止？ |
| Joining | shutdown 时是否等待它退出？ |

只有满足以下条件时，才适合主动丢弃 `JoinHandle`：

- 生命周期短
- 不持有关键资源
- 失败不影响业务
- 不需要重试或结果反馈
- 任务数量有明确上限
- 不需要关闭时收尾

## 4. select! 取消安全

`select!` 未被选中的分支会被 drop，等同于取消 Future。不是所有 Future 都能安全取消。

| 操作 | 取消安全性 |
|------|------------|
| `mpsc::Receiver::recv()` | 安全 |
| `oneshot::Receiver` | 安全 |
| `tokio::time::sleep` / `timeout` | 安全 |
| `Notify::notified()` | 安全 |
| `AsyncReadExt::read` / `read_to_end` / `read_exact` | 不安全 |
| `AsyncWriteExt::write` | 不安全 |
| `SinkExt::send` | 不安全 |

需要严格优先级时，在 `select!` 中使用 `biased;`。默认选择就绪分支时不要依赖声明顺序。

完整列表见 [tokio cancellation safety 文档](https://docs.rs/tokio/latest/tokio/macro.select.html#cancellation-safety)。

## 5. 工具选择

| 场景 | 推荐工具 |
|------|----------|
| 单个任务，需要结果 | `JoinHandle` |
| 动态任务集合，按完成顺序回收 | `JoinSet` |
| 服务级后台任务统一追踪 | `TaskTracker` |
| 向多个任务传播关闭信号 | `CancellationToken` |
| 状态型关闭信号 | `watch` |
| 事件广播式关闭 | `broadcast` |
| 请求提交给后台 worker | 有界 `mpsc` |
| 阻塞代码或 CPU 密集任务 | `spawn_blocking` |
| 长循环主动让出调度 | `yield_now` 或 `spawn_blocking` |

## 6. 反模式清单

| 反模式 | 后果 | 正确做法 |
|--------|------|----------|
| `spawn` 内 `std::thread::sleep` 或同步 IO | worker 饿死 | `spawn_blocking` 或异步等价物 |
| `.await` 时持有 `std::sync::MutexGuard` | 死锁 | 缩小作用域或换 `tokio::sync::Mutex` |
| `select!` 内直接使用非取消安全 IO | 半完成状态或数据丢失 | 封装为取消安全流程 |
| HTTP handler 中随手 `spawn` | 请求结果和后台任务脱钩 | 直接 `.await` 或提交有界队列 |
| 丢弃关键任务的 `JoinHandle` | 失败和 panic 无人观察 | 保存、登记或显式说明 fire-and-forget |
| 用 `abort()` 做正常关闭 | 业务清理被跳过 | cancel、wait、timeout 后再 abort |

## 7. 相关文档

- [rust-conventions.md](./rust-conventions.md)
- [rust-error-handling.md](./rust-error-handling.md)
- [rust-workflow-standards.md](./rust-workflow-standards.md)
- Skill：`rust-tokio-practices`，用于 Tokio 后台任务生命周期的具体写法、重构和 review。

---

- 维护人：Xu Chengzi
- 版本：v1.1.0
- 更新：2026-07-29
- 变更：压缩 rule 为底线规范，Tokio 使用实践和任务生命周期正反例迁入 `rust-tokio-practices` skill。

