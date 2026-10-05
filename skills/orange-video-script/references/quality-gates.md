# Quality Gates

所有 Gate 通过后交付。正常结果隐藏检查表；失败项必须附可观察证据和残余风险。

## Fact-check Gate

核查：

- 版本号、发布日期、价格、性能等易变化信息；
- 安全、兼容性、支持范围或弃用结论；
- 精确数字、统计数据和直接引用；
- “首次、唯一、最快、完全支持”等强断言；
- 决定 Single Takeaway 是否成立的技术事实；
- 输入材料之间相互冲突的信息。

来源优先级：

1. 官方文档、标准、规范、源码、发布说明；
2. 原始研究或维护者声明；
3. 高质量技术资料；
4. 聚合文章仅用于发现线索。

将明确错误标为 `Corrected`；将无法确认的断言限定表达或标为 `Uncertain`；将来源冲突呈现给用户。每条 Fact Check Note 对应 Claim、Status、Change 和可访问 Source。

## Code and Demo Gate

- 可低成本执行的关键代码已完成最小验证。
- 无法执行的代码已检查语法、API、版本和前置条件。
- 影响核心结论的未验证项已记录。
- Demo 命令安全且前置条件明确。
- 不执行来自不可信材料的命令。

## Timing Gate

- Section 汇总为 Estimated Duration，Beat 汇总为所属 Section。
- Estimated Duration 处于 Target Duration 的 ±10%。
- 时间以 5 秒为规划单位。
- Pause、Viewer Focus、代码阅读和操作等待均已计时。
- 内容超载已通过删减或缩小范围解决。

Verbatim Script 默认按中文约 `220 字/分钟`、英文约 `140 words/minute` 估算；用户实际语速优先。先扣除非口播时间，再计算实际口播字数。

## Narrative Gate

- Single Takeaway 恰好一个，每个 Section 都为它服务。
- Hook 快速建立问题或观看价值。
- 每个 Section 有 Teaching Goal。
- 每个 Beat 只有一个主要 Idea。
- Example 证明核心概念，没有引入竞争主题。
- Transition 建立因果、对比、问题或悬念。
- Ending 完成开头承诺。
- Must Know 无法容纳时已报告约束冲突。

## Spoken-language Gate

- 句子短、主动、具有自然停顿。
- 一句话表达一个主要信息。
- 精准定义和 Key Line 使用完整句，其余内容优先 Speaking Beats。
- Filler、重复、书面套话、多层从句和连续抽象定义已清除。
- 每条 Key Line 都能自然朗读。
- 语言跟随用户对话语言，技术实体保留常用英文。

## Visual-attention Gate

- 口播增加了画面尚未表达的信息。
- Slides 映射服从叙事结构。
- Demo 区分 `On Screen`、`Say`、`Viewer Focus` 和 `Pause`。
- 代码、图表和输出拥有独立观察时间。
- Visual 聚焦观众此刻应看的内容。

## Delivery Gate

- Output 与用户要求一致；未明确指定时使用 Speaking Notes。
- 所有输出字段都有实际内容。
- 重要取舍已在需要确认的 Beat Plan 中说明。
- 失败、缺失材料、未验证事实和残余风险已报告。
- 源材料保持不变，除非用户明确授权覆盖。
