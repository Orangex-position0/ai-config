# ADR 生命周期规则

## 状态机

```
Proposed ──评审通过──> Accepted ──不再使用──> Deprecated
                          │
                          └──被新 ADR 取代──> Superseded
```

**不可逆**：状态只能向后流转，不能回退。例如 Accepted 不能回到 Proposed。

## 状态语义

| 状态 | 含义 | 触发条件 | 可执行动作 |
|------|------|---------|-----------|
| **Proposed** | 已起草，待评审 | 初始状态 | 评审、修改内容（此时仍可变） |
| **Accepted** | 已通过并生效 | 评审通过、决策落地 | 执行决策、被取代、被废弃 |
| **Deprecated** | 不再推荐使用，但未移除 | 出现更好方案但未立即替换 | 标记后继续运行，等待迁移 |
| **Superseded** | 已被新 ADR 取代 | 新 ADR 被 Accepted | 仅作为历史记录，不再执行 |

## 不可变原则

**Accepted 之后，内容冻结。**

任何修改都必须通过新建 ADR 实现，而非编辑已有 ADR：

- ❌ 直接修改 Accepted ADR 的决策、后果、撤销条件
- ❌ 删除已有 ADR 文件
- ✅ 新建 ADR 取代旧 ADR（走 Superseded 流程）
- ✅ 追加"变更历史"表格的行（仅用于状态变更记录，不修改正文）

**唯一例外**：错别字、格式修正等不改变语义的改动。

## 版本关联管理

当 ADR-N 被 ADR-M（M > N）取代时，**必须建立双向引用**。

### 在新 ADR（ADR-M）中

1. frontmatter 增加 `supersedes` 字段：

```yaml
---
状态: Accepted
supersedes: ADR-N
---
```

2. 在"上下文"段落开头补充一句：

> 本 ADR 取代 ADR-N，原因见下文。

### 在旧 ADR（ADR-N）中

1. frontmatter 状态改为 `Superseded`，并增加 `superseded_by` 字段：

```yaml
---
状态: Superseded
superseded_by: ADR-M
---
```

2. 在文件末尾追加"被取代"段落：

```markdown
---

**本 ADR 已被 [ADR-M](ADR-{M}-{标题}.md) 取代。**

取代日期：YYYY-MM-DD
取代原因：{一句话说明}
```

3. 在"变更历史"表格追加一行：

| 日期 | 变更类型 | 原因 | 操作人 |
|------|---------|------|--------|
| YYYY-MM-DD | 状态变更 | 被 ADR-M 取代 | {姓名} |

## 其他状态变更规范

### Accepted → Deprecated

1. frontmatter 状态改为 `Deprecated`
2. 文件末尾追加"废弃说明"段落：

```markdown
---

**本 ADR 已废弃，不再推荐使用。**

废弃日期：YYYY-MM-DD
废弃原因：{一句话说明，如"已被 X 方案替代，但暂无迁移计划"}
```

3. 更新"变更历史"表格

### Proposed → Accepted

1. frontmatter 状态改为 `Accepted`
2. 更新 frontmatter 的 `最后修改` 日期
3. "变更历史"表格追加一行（变更类型：状态变更 / 通过评审）

## 常见错误

| 错误 | 正确做法 |
|------|---------|
| 直接修改 Accepted ADR 的决策内容 | 新建 ADR 取代 |
| 状态变更后未更新"变更历史" | 必须追加变更行 |
| Superseded ADR 未建立双向引用 | 在新旧 ADR 双向补 `supersedes` / `superseded_by` |
| 删除已废弃 ADR 文件 | 保留为历史记录 |
| 回收已废弃 ADR 的编号 | 编号单调递增，永不回收 |
