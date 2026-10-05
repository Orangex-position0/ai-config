# Genre and Modifiers

用一个 `Primary Genre` 决定叙事逻辑，用零个或多个 `Modifiers` 调整呈现方式、节奏和字段。Modifier 不取代 Genre。

## Primary Genre: Technical Explainer

当前实现的 Primary Genre 是 `Technical Explainer`，适合编程知识、技术概念、Framework / Library、Architecture 和 AI Coding 技巧。

默认叙事：

```text
Problem → Why → Core Idea → Example → Pitfall → Takeaway
```

优先回答：

- 为什么这个问题值得解决；
- 旧方法为什么失效；
- 核心机制如何工作；
- 一个最小 Example 证明什么；
- 最容易产生的错误认知是什么。

可按内容省略不承担教学作用的节点。类比只解释一个关系，并呈现会影响理解的边界。

## Modifier: Slides-based

用于 HTML Slides、PPT、技术分享和 conference-style talk。

为每个 Section 确定：

```text
Teaching Goal → Time Budget → Speaking Beats → Key Line → Transition
```

用 `Slide(s)` 保留页面映射。叙事可以：

- 合并多页为一个 Beat；
- 让一页支撑多个先后 Beat；
- 把页面作为静默观察段；
- 建议调整页面顺序。

口播补充 Why、Context、Example、Analogy、Pitfall、Emphasis 和 Transition。页面过密时，用 `Slide Notes` 建议删减、拆页、换图或调整顺序。

## Modifier: Demo

用于 Coding Demo、CLI、IDE 操作和产品演示。

每个操作 Beat 使用：

```text
On Screen + Say + Viewer Focus + Pause
```

采用注意力分时：

1. 操作前说明观察目标；
2. 执行时只说必要信息；
3. 结果出现后留出阅读时间；
4. 再解释结果的意义。

命令等待、代码阅读和画面观察均计入时间预算。

## Modifier: Short-form

用于 30–180 秒的单概念视频；用户未指定时默认 90 秒。长视频的开场不是 Short-form Modifier。

默认压缩为：

```text
Problem → Core Idea → One Example → Takeaway
```

前几秒建立问题或价值，只保留一个结论和一个最短有效 Example。背景历史、第二案例和旁支定义只在构成理解前提时保留。Ending 回收开头承诺；CTA 仅在用户目标需要行动时出现。

## Composition

示例：

```text
Primary Genre: Technical Explainer
Modifiers: Slides-based, Demo

Sections:
1. Hook
2. Problem
3. Core Idea
4. Live CLI — apply Demo fields
5. Pitfall
6. Takeaway
```

另一个示例：

```text
Primary Genre: Technical Explainer
Modifiers: Short-form
Narrative: Problem → Core Idea → One Example → Takeaway
```

Genre 决定“为什么这样讲”，Modifier 决定“通过什么形式讲”。只有 Modifier 影响当前 Section 时，才增加它的专属字段。
