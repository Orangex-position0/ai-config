# 计划：{{FEATURE_NAME}}

## 文档控制

| Field | Value |
| --- | --- |
| Status | Draft |
| Revision | 0.1 |
| Approved By | Pending |
| Approved At | Pending |
| Approval Note | Pending |

## 输入

## 概要

## 技术背景

- Runtime / Language:
- Primary Dependencies / Tools:
- Data / Storage: N/A unless relevant
- Relevant Paths:
- Validation:
- Compatibility Constraints:
- Performance / Scale Constraints: N/A unless relevant

仅当缺失信息会改变实现方向时使用 `NEEDS DECISION: [具体问题]`；否则选择合理默认方案。

## 实现方案

## 复杂度追踪

仅当引入新抽象、依赖、服务／模块、存储、异步队列／工作进程、多阶段迁移或非平凡兼容层时填写。

| Complexity | Why Needed | Simpler Alternative Rejected Because |
| --- | --- | --- |

## 系统架构

仅当跨模块、服务、数据流、存储归属、外部接口或运行／部署边界发生变化时填写：明确领域边界、跨界数据流、持久状态归属及允许的依赖。引用 Spec 中获批准的对外 API 契约，说明哪些模块负责实现，不在此重复定义契约。

## 程序设计

仅当代码结构发生变化时填写；复用已有明确结论，按依赖顺序讨论相关决策：

1. 需要哪些模块，各自负责什么？
2. 每个模块拥有哪些关键数据模型与函数？
3. 哪些输入、输出和签名会约束模块协作？省略无关紧要的函数。
4. 模块之间如何调用、协调和交互？

只记录指导实现所必需的决策；不必逐项重复提问。按需说明错误处理。省略完整函数体、逐步伪代码和猜测性的抽象。

## 项目结构

仅当文件／目录新增、移动或重新定义时填写真实路径。

```text
[仅填写真实目标路径]
```

**Structure Decision**:

## 协议检查

- [ ] Spec 仅说明为什么做、做什么、可观察契约及已有约束。
- [ ] Plan 负责实现方案、架构、程序设计及切片顺序。
- [ ] 垂直切片各自可实现、可集成、可验证。
- [ ] 引入额外复杂度时已解释原因。
- [ ] 满足仓库路由、镜像、安装及验证规则，或注明不适用。

## 垂直切片

切片是可独立实现、集成并验证的端到端增量。这里确定顺序和边界；`tasks.md` 展开步骤、检查和命令。

| Order | Slice | Outcome | Depends On |
| --- | --- | --- | --- |

## 决策

## 测试策略

## 需求覆盖

## 开发者导览

## 待决问题

## 计划交接

- Batch / Slice Boundaries:
- Key Modules and Interfaces:
- Data Flow:
- Testing Seams:
- Decisions:
- Open Risks:

## 批准
