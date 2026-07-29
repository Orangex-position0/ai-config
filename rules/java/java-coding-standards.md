---
paths:
  - "**/*.java"
---

# Java Coding Standards

> 面向 AI 代码生成与团队开发统一规范
> 优先级：HARD > DESIGN。格式与工具配置交给 google-java-format + Spotless，本规范不复述。

---

## 0. 优先级

1. **HARD RULE**（必须遵守）
2. **DESIGN RULE**（架构约束）

冲突时 HARD 优先。

---

## 1. HARD RULE

### 1.1 代码结构

- 一个 `.java` 文件只能有一个 `public` 顶级类
- 禁止无意义工具类实例化
- 禁止 `public field`（`static final` 常量和 Record components 除外）
- DTO / Entity 不允许包含业务逻辑

### 1.2 安全规则

- ❌ 禁止 SQL 拼接（必须参数化查询）
- ❌ 禁止捕获 `Throwable`
- ❌ 禁止吞异常（catch 后不处理）
- ❌ 禁止 `new Thread()`
- ❌ 禁止 `Executors.*` 快速方法（必须使用 `ThreadPoolExecutor` / `Spring TaskExecutor`）
- ❌ 禁止 magic number / string（必须常量化）

### 1.3 并发规则

- 必须使用线程池（自定义 `ThreadPoolExecutor`）
- `volatile` 只用于可见性，不用于原子性控制

### 1.4 异常规则

- 必须使用具体异常类型
- 必须保留 root cause（异常链）
- 禁止返回错误码代替异常

### 1.5 数据库规则

- 必须使用参数化查询
- 必须使用事务注解（`@Transactional(rollbackFor = Exception.class)`）

### 1.6 日志规则

- 必须使用 SLF4J
- 必须使用 `{}` 占位符（禁止字符串拼接）
- 禁止输出敏感信息（密码、token）
- 禁止行尾注释（严格遵守 CLAUDE.md 第二部分）

---

## 2. DESIGN RULE

### 2.1 分层规范

- **Controller**：只负责 HTTP 交互
- **Service**：业务逻辑编排
- **Repository**：数据访问
- **DTO**：数据传输，不含业务逻辑

### 2.2 代码组织

- 一个类只负责一个核心职责（SRP）
- 方法不超过 50 行
- 重载方法必须连续排列

### 2.3 命名原则

必须语义化，禁止模糊命名：

- ❌ `flag`, `data`, `temp`, `obj`, `list`
- ✅ `isActive`, `userList`, `orderResult`

大小写约定（遵循标准 Java 规范）：

- 类 / 接口 / Record / Enum：`PascalCase`（如 `OrderService`）
- 方法 / 字段 / 参数 / 局部变量：`camelCase`（如 `calculateTotal`）
- `static final` 常量：`SCREAMING_SNAKE_CASE`（如 `MAX_RETRY`）
- 包名：全小写、反域名（如 `com.example.app.service`）

### 2.4 Type-Safe Data Modeling

- Do not use `Map<String, Object>` as a domain model when the data shape is known.
- Use explicit types such as Entity, DTO, VO, BO, record, or value object for stable business data.
- `Map` is acceptable only for genuinely dynamic data, framework internals, temporary local indexing / aggregation, or external schemaless payloads.
- Convert temporary or persistence-layer maps into typed business objects before crossing service or domain boundaries.

### 2.5 集合设计

- 优先使用不可变集合（`List.of()`, `Map.of()`）
- 方法返回集合必须避免 `null`（返回 `Collections.emptyList()`）
- 初始化集合时指定容量（`new ArrayList<>(1000)`）
- 对外暴露内部集合时必须返回防御性拷贝（`List.copyOf()` / `Map.copyOf()` / `Set.copyOf()`），禁止直接返回内部可变集合引用

### 2.6 空值处理

- 不允许返回 `null`（集合返回 `emptyList()`，对象返回空对象或抛异常）
- Optional 规范详见 [java-optional-standards.md](./java-optional-standards.md)

### 2.7 类内成员声明顺序

类内成员按以下顺序排列，保持一致的阅读结构：

1. `static final` 常量
2. 实例字段（`final` 优先）
3. 构造方法
4. 公有方法（`public`）
5. 受保护方法（`protected`）
6. 私有方法（`private`）

---

## 3. AI 代码生成规则

### 3.1 输出原则

- 优先可读性 > 简洁性
- 避免过度抽象设计
- 不引入未使用依赖
- 默认使用现代 Java 语法（JDK 17+）

### 3.2 禁止行为

- ❌ 不生成不完整代码片段（除非请求）
- ❌ 不省略异常处理
- ❌ 不使用伪代码替代实现
- ❌ 不引入未说明的库

### 3.3 默认工程假设

- Spring Boot 项目
- Maven 构建
- JDK 17+
- RESTful API 风格

---

## 4. 代码示例

### ❌ 错误

```java
int status = 1;                                  // Magic number
String sql = "SELECT * FROM users WHERE id = " + userId;  // SQL 拼接
new Thread(() -> doWork()).start();              // 裸线程
try { doSomething(); } catch (Exception e) { /* ignore */ }  // 吞异常
public List<User> getUsers() { return users == null ? null : users; }  // 返回 null
```

### ✅ 正确

```java
private static final int STATUS_ACTIVE = 1;
String sql = "SELECT * FROM users WHERE id = ?";
executorService.submit(() -> doWork());
try {
    doSomething();
} catch (Exception e) {
    log.error("操作失败", e);
    throw new ServiceException("处理失败", e);
}
public List<User> getUsers() {
    return users != null ? users : Collections.emptyList();
}
public Optional<User> findById(Long id) {
    return Optional.ofNullable(userRepository.findById(id));
}
```

---

## 5. 特殊场景

### 5.1 日期时间处理

- 必须使用 `java.time` API（禁止 `Date`, `Calendar`）
- 数据库存储使用 `Instant` 或 `timestamp`
- 前端交互使用 ISO-8601 格式
- 时间范围查询使用半开区间 `[start, end)`
- 详见 `rules/date-handling-specification.md`

### 5.2 工具类设计

```java
public final class StringUtils {

    private StringUtils() {
        throw new UnsupportedOperationException("工具类禁止实例化");
    }

    public static boolean isEmpty(String str) {
        return str == null || str.isEmpty();
    }
}
```

### 5.3 不可变对象

优先使用不可变集合和不可变类（只提供 getter，不提供 setter）。

---

## 6. 现代 Java 特性与 Stream

### 6.1 现代语言特性

在不牺牲可读性的前提下，优先使用现代语法（JDK 17+）：

- **Record**：用于 DTO 和值对象，替代手写 getter / 构造器 / equals
- **Sealed class**：用于封闭类型层级，保证 `switch` 匹配的穷尽性
- **Pattern matching for instanceof**：类型判断后无需显式强转
- **Text block**：多行字符串（SQL、JSON 模板）使用 `"""..."""`
- **Switch expression**：箭头语法 + 返回值，配合 sealed 实现穷尽匹配

```java
// 值对象用 Record
public record OrderSummary(Long id, String customerName, BigDecimal total) {}

// instanceof 模式匹配，无需显式强转
if (shape instanceof Circle c) {
    return Math.PI * c.radius() * c.radius();
}

// Sealed 类型 + switch expression 穷尽匹配
public sealed interface PaymentMethod permits CreditCard, BankTransfer {}
String label = switch (status) {
    case ACTIVE -> "活跃";
    case SUSPENDED -> "已暂停";
    case CLOSED -> "已关闭";
};
```

### 6.2 Stream 使用规范

- 用 Stream 做集合变换与聚合，保持管道简短（建议不超过 3-4 个操作）
- 优先使用方法引用（`Order::getTotal`），可读性下降时改用 lambda
- 禁止在 Stream 操作中产生副作用（如修改外部集合、写日志）
- 逻辑复杂时优先用显式循环，而非堆砌难懂的 Stream 管道

```java
// 正例：简短、无副作用、方法引用
BigDecimal total = orders.stream()
        .map(Order::getTotal)
        .reduce(BigDecimal.ZERO, BigDecimal::add);
```
