---
name: video-production-script
description: 将已确认的视频讲稿转换为可执行的声画制作表，规划时间轴、旁白、画面、制作说明和素材来源。
disable-model-invocation: true
---

# Video Production Script

把已经确认的讲稿转换成可直接用于录制、剪辑和素材准备的声画制作表。内容策划、Single Takeaway、叙事结构和口播改写由上游脚本流程完成；本 Skill 只解决制作执行问题。

## Input

读取：

- 已确认的 Speaking Notes 或 Verbatim Script；
- Slides、代码、截图、录屏和其他现有素材；
- 目标时长、画幅、录制方式和已知制作限制。

缺少素材不阻塞可规划的部分；在对应行将来源标为 `待制作` 或 `待提供`。讲稿尚未确认时，先让用户完成内容脚本，不在制作阶段重写核心观点。

**完成条件：** 讲稿版本明确，且每项现有素材或缺失素材均可识别。

## Build the production timeline

按观众注意力和画面变化切段，而不是按固定字数切段。为每段确定：

- 时间范围；
- 实际旁白；
- 观众看到的画面；
- 画面如何进入、变化或退出；
- 使用现有素材还是需要补做。

观众需要阅读代码、观察操作或理解图表时，把停顿写进时间线。画面承担证据、对比、状态变化或注意力引导，旁白承担解释；两者应互补。

**完成条件：** 每段旁白都有对应画面，每个画面都有明确制作目的。

## Output

默认使用：

```md
# Video Production Script

Source Script: [path or version]
Target Duration: [duration]
Format: [aspect ratio / recording format]

| 时间 | 旁白 | 画面 | 制作说明 | 素材来源 |
| --- | --- | --- | --- | --- |
| 00:00–00:08 | ... | ... | ... | Slides 1–2 |
| 00:08–00:13 | （停顿） | ... | 留出阅读时间 | Existing screenshot |
```

素材来源使用可执行值，例如：

- `Slides 3–4`
- `src/example.rs`
- `terminal recording: cargo test`
- `existing screenshot: assets/result.png`
- `待制作：before/after diagram`
- `待提供：product footage`

表格后只附有实际内容的章节：

```md
## Asset Checklist

- Existing: [...]
- Record: [...]
- Create: [...]
- Missing: [...]

## Production Risks

- [unstable demo, unreadable code, missing evidence, timing risk]
```

## Quality gate

交付前确认：

- 时间段连续，预计总时长处于目标的 ±10%；
- 每段画面都帮助理解、提供证据、形成对比或指导制作；
- 代码、图表和操作拥有足够观察时间；
- 素材来源具体到文件、页面、命令或待办项；
- 制作说明描述可执行动作，而不是“加点效果”等模糊要求；
- 内容含义与已确认讲稿一致。

**完成条件：** 所有检查通过，或残余风险已明确记录。
