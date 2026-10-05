# Behavior Scenarios

修改或审计 Skill 时逐项检查预期过程。验证行为分支，不要求输出固定措辞。

## 1. Slides-based technical talk

**Input**

```text
把 slides.html 做成 8 分钟 Rust Newtype 技术讲解，观众是有后端经验的 Rust 初学者。
```

**Expected**

- `Task: create`，`Output: notes`；
- `Primary Genre: Technical Explainer`，`Modifiers: Slides-based`；
- 直接生成，时长本身不触发 Beat Plan 确认；
- 保留 Slide(s) 映射，允许合并页面和静默页面；
- 默认没有 Verbatim Script。

## 2. Ambiguous long source

**Input**

```text
根据这篇同时讨论类型安全、性能优化和 API 设计的长文做一期视频。
```

**Expected**

- 询问 Audience 和 Target Duration；
- 提出不超过 3 个 Single Takeaway 候选；
- 说明每个方向会舍弃什么；
- 用户确认前只输出 Beat Plan，不生成完整稿。

## 3. Short-form explainer

**Input**

```text
用 90 秒解释为什么 UserId 和 OrderId 不应该都是裸 u64。
```

**Expected**

- `Primary Genre: Technical Explainer`，`Modifiers: Short-form`；
- 使用 `Problem → Core Idea → One Example → Takeaway`；
- 只有一个 Example；
- 默认 Speaking Notes，没有通用“点赞关注” CTA。

## 4. Slides plus Demo

**Input**

```text
根据 slides.html 做讲稿，中间现场运行 cargo test；总长 6 分钟。
```

**Expected**

- `Modifiers: Slides-based, Demo`；
- Demo Beat 含 `On Screen`、`Say`、`Viewer Focus` 和 `Pause`；
- 命令执行和观察时间进入 Estimated Duration；
- 页面文字和命令动作不被逐项复述。

## 5. Existing script diagnosis

**Input**

```text
检查并优化 script.md，让它更适合真人讲解。
```

**Expected**

- `Task: diagnose`；
- 同一次交付包含问题分级和完整重写稿；
- 默认重写为 Speaking Notes；
- 保留用户稳定的表达习惯；
- Estimated Duration 处于 Target Duration 的 ±10%，缺少 Target 时先询问。

## 6. Explicit verbatim request

**Input**

```text
为这个提纲写一份 5 分钟中文提词器逐字稿。
```

**Expected**

- `Task: create`，`Output: verbatim`；
- 按 Section 和 Beat 组织，不输出一整块连续文章；
- 包含 Timing Check；
- 使用用户语速，未提供时按中文约 220 字/分钟估算；
- Estimated Total 处于 5 分钟的 ±10%。

## 7. Explicit coaching request

**Input**

```text
这是我写的初稿。请作为脚本老师给我建议，不要直接替我改，我想自己练习。
```

**Expected**

- `Task: coach`；
- 读取 Coaching Workflow；
- 输出全局 Diagnostic Map，但每轮只训练一个高杠杆问题；
- 引用原文证据，给出 Principle、Revision Prompt 和 Success Criteria；
- 不输出完整重写稿，停在 `Your Turn` 等待用户提交新版；
- 学习记录不会自动写入文件。

## 8. Existing script without intent

**Input**

```text
这是 script.md。
```

**Expected**

- 不根据“存在已有脚本”自动进入 `coach`；
- 询问用户希望诊断并获得完整优化稿、直接修改，还是进入教学模式；
- 用户选择前不生成诊断、重写或教学反馈。
