---
paths:
  - "**/*.java"
---

# Java Security 规范

> 面向 AI 代码生成与团队开发的统一安全规范。
> 聚焦现有规范的**安全缺口**：敏感信息管理、注入防护、加密算法、输入校验、错误与日志脱敏、依赖安全。
> 通用安全硬规则（禁止吞异常、保留 root cause、禁止输出敏感信息）见 [Java 编码规范](./java-coding-standards.md)；工具链与 CI 扫描节奏见 [Java 项目工作流规则](./java-workflow-standards.md)。
> 优先级：HARD > DESIGN。冲突时 HARD 优先。

---

## 0. 优先级

1. **HARD RULE**（必须遵守的安全底线，违反即漏洞）
2. **DESIGN RULE**（架构层面的安全约束）

---

## 1. HARD RULE

### 1.1 敏感信息管理

- ❌ 禁止硬编码 API Key、Token、密码、数据库连接串等任何凭证
- ❌ 禁止将含密钥的本地配置文件提交到版本库（必须加入 `.gitignore`）
- ✅ 生产环境密钥必须从环境变量或 Secret Manager（Vault / AWS Secrets Manager / Nacos 加密配置）读取
- ✅ 读取后必须做空值校验，启动期失败优于运行期崩溃

```java
// 反例：硬编码密钥
private static final String API_KEY = "sk-abc123";

// 正例：环境变量 + 显式校验
String apiKey = System.getenv("PAYMENT_API_KEY");
Objects.requireNonNull(apiKey, "PAYMENT_API_KEY 必须配置");
```

### 1.2 SQL 注入防护

- ❌ 禁止任何形式的字符串拼接 SQL（含 `+` 拼接、`String.format`）
- ✅ JDBC 使用 `PreparedStatement` 占位符 `?`
- ✅ Spring 使用 `JdbcTemplate` / `NamedParameterJdbcTemplate` 的参数化 API
- ✅ MyBatis 必须使用 `#{}`；`#{}` 走参数化，`${}` 是文本替换，**有注入风险**，仅允许用于表名/列名/排序字段等不可信输入不接触的场景，且必须白名单校验

```java
// 反例：字符串拼接，存在 SQL 注入
String sql = "SELECT * FROM orders WHERE name = '" + name + "'";
stmt.executeQuery(sql);

// 正例：PreparedStatement 参数化
PreparedStatement ps = conn.prepareStatement("SELECT * FROM orders WHERE name = ?");
ps.setString(1, name);

// 正例：JdbcTemplate
jdbcTemplate.query("SELECT * FROM orders WHERE name = ?", mapper, name);
```

```xml
<!-- MyBatis：#{} 安全，${} 危险 -->
<!-- 正例 -->
<select id="findByName">
    SELECT * FROM orders WHERE name = #{name}
</select>
<!-- 反例：${} 直接拼接，禁止用于用户可控输入 -->
<select id="orderBy">
    SELECT * FROM orders ORDER BY ${orderBy}
</select>
```

### 1.3 密码与加密算法

- ❌ 禁止用于密码存储的弱哈希：`MD5`、`SHA-1`（单独使用）
- ❌ 禁止弱加密算法：`DES`、`3DES`、`RC4`、`AES/ECB`
- ❌ 禁止 `Math.random()` / `java.util.Random` 生成安全相关随机值（token、验证码、密钥）
- ✅ 密码存储使用 `BCrypt` / `Argon2`（带盐、自适应代价）
- ✅ 对称加密使用 `AES/GCM`（含完整性校验）
- ✅ 安全随机值使用 `SecureRandom`

```java
// 正例：BCrypt 哈希密码（Spring Security）
PasswordEncoder encoder = new BCryptPasswordEncoder();
String hashed = encoder.encode(rawPassword);
boolean ok = encoder.matches(rawPassword, hashed);

// 正例：AES-GCM 对称加密，IV 每次随机生成
// 反例：ECB 模式相同明文产生相同密文，泄露模式
```

### 1.4 输入校验

- ✅ 在系统边界（Controller / API 入口）校验所有外部输入，不信任任何客户端数据
- ✅ 优先使用 Bean Validation（`@NotNull`、`@NotBlank`、`@Size`、`@Pattern`、`@Email`）
- ✅ 文件路径输入必须做规范化校验，防止路径穿越（Path Traversal）
- ✅ 文件上传必须校验扩展名白名单、MIME 类型、大小上限；禁止使用用户提供的原始文件名直接落盘

```java
// 正例：Bean Validation 校验 DTO
public record CreateOrderRequest(
        @NotBlank String customerName,
        @DecimalMin(value = "0.01") BigDecimal amount
) {}

// 正例：路径穿越防护
Path base = Paths.get(uploadDir).toAbsolutePath().normalize();
Path target = base.resolve(fileName).normalize();
if (!target.startsWith(base)) {
    throw new SecurityException("非法路径访问");
}
```

### 1.5 错误信息脱敏

- ❌ 禁止向客户端返回堆栈信息、SQL 错误、内部文件路径、第三方异常原文
- ❌ 禁止 `e.getMessage()` 直接透传给 API 响应
- ✅ 服务端记录详细日志（含 root cause），客户端只返回通用化提示
- ✅ 使用 `@RestControllerAdvice` 统一异常处理，集中脱敏

```java
// 反例：暴露内部错误
catch (Exception ex) {
    return ApiResponse.error(ex.getMessage());
}

// 正例：日志留详情，响应给通用提示
catch (OrderNotFoundException ex) {
    log.warn("订单不存在: id={}", id);
    return ApiResponse.error("资源不存在");
} catch (Exception ex) {
    log.error("处理订单失败: id={}", id, ex);
    return ApiResponse.error("系统繁忙，请稍后重试");
}
```

### 1.6 日志脱敏

- ❌ 禁止日志输出密码、Token、身份证号、银行卡号、手机号等 PII 原文
- ✅ 敏感字段打印前必须脱敏（掩码、哈希，或直接不打）
- ✅ 必须使用 SLF4J `{}` 占位符，禁止字符串拼接日志（同时避免性能与信息泄露问题）

```java
// 反例：日志泄露密码
log.info("用户登录: name={}, password={}", name, password);

// 正例：敏感信息脱敏
log.info("用户登录: name={}", name);
```

---

## 2. DESIGN RULE

### 2.1 认证与授权

- ❌ 禁止自行实现加密认证协议（必须使用 Spring Security / OAuth2 / OIDC 等成熟方案）
- ✅ 鉴权检查下沉到服务边界或网关，避免散落在各 Controller
- ✅ 遵循最小权限原则：角色 / 权限按 `模块名:功能名:操作名` 粒度划分（与 DDD 统一语言一致）
- ✅ Token 必须有过期机制与刷新/吊销策略

### 2.2 依赖安全

- ✅ 定期审计传递依赖的已知 CVE
- ✅ 工具组合与执行节奏见 [Java 项目工作流规则](./java-workflow-standards.md)：OWASP Dependency-Check / Snyk / Trivy / Dependabot，**重型扫描必须走 CI**，不进 pre-commit
- ✅ 发现高危 CVE 必须升级或引入等效替代，不得长期搁置

### 2.3 反序列化与序列化

- ❌ 禁止使用 Java 原生序列化（`ObjectInputStream`）处理不可信数据（远程代码执行风险）
- ✅ 优先 JSON 序列化（Jackson / Gson）
- ✅ Jackson 开启多态类型时必须使用 `PolymorphicTypeValidator` 白名单，禁止 `enableDefaultTyping()` 全开

### 2.4 跨域与请求伪造

- ✅ CORS 必须配置可信来源白名单，禁止 `*` 配合 `allowCredentials=true`
- ✅ 有状态的浏览器交互需启用 CSRF 防护；纯 Token 无状态 API 可按框架规范关闭

---

## 3. 代码示例：全局异常处理模板

集中处理 + 统一脱敏的标准范式：

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // 业务异常：返回明确语义，不泄露内部
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusiness(BusinessException ex) {
        log.warn("业务异常: code={}", ex.getCode());
        return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
    }

    // 兜底异常：服务端留详情，客户端给通用提示
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleUnknown(Exception ex) {
        log.error("未处理异常", ex);
        return ResponseEntity.internalServerError()
                .body(ApiResponse.error("系统繁忙，请稍后重试"));
    }
}
```

---

## 4. 安全审查清单

提交前自检：

1. 是否存在硬编码凭证或密钥？
2. 所有 SQL 是否参数化？MyBatis 是否误用 `${}`？
3. 密码是否用 BCrypt/Argon2？随机数是否用 SecureRandom？
4. 外部输入是否在边界校验？文件路径是否防穿越？
5. 异常响应是否泄露堆栈 / SQL / 内部路径？
6. 日志是否输出 PII 或密码？
7. 依赖是否存在未处理的高危 CVE？
8. 是否存在原生反序列化不可信数据？

---

## 5. 相关文档

- **Java 编码规范**：[java-coding-standards.md](./java-coding-standards.md) — 通用安全硬规则（禁止吞异常、保留 root cause）
- **Java Optional 规范**：[java-optional-standards.md](./java-optional-standards.md)
- **Java 项目工作流规则**：[java-workflow-standards.md](./java-workflow-standards.md) — 依赖安全扫描的工具链与 CI 节奏
- **接口文档规范**：[api-documentation.md](./api-documentation.md) — 接口安全性说明
