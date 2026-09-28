# {{project-name}} UI 设计进度

<!-- 按文档契约创建或恢复；填入真实信息后删除对应提示注释。 -->

## 项目定位

- 项目 ID：{{project-id}}
- 本地项目根目录：{{local-project-root}}
- 文档项目 slug：{{project-slug}}
- 文档根目录：{{document-root}}
- 设计规范：[design-spec.md](design-spec.md)
- 交付模式：{{delivery-mode}}
- 当前视觉载体：{{active-visual-carrier}}
- 默认晋升工具：{{design-tool}}
- HTML 原型路径与运行入口：{{prototype-path-and-entry}}
- 设计文件及链接或等价定位：{{design-file-or-not-promoted}}
- 授权修改范围：{{authorized-scope-or-not-applicable}}

## 当前执行位置

<!-- 顶部仅维护当前情况。阻塞详细证据引用下方卡片，不重复抄写。尚无当前 Flow 时写“尚未进入逐功能设计”，不虚构批次。 -->

- 当前阶段：{{stage}}
- 当前 Flow：{{flow-or-not-started}}
- 当前关卡：{{gate}}
- 当前状态：{{status}}
- 当前未解除阻塞：{{blocker-links-or-none}}
- 下一步：{{next-action}}

### 待确认基线

<!-- 这里只保留当前待确认基线；无待确认关卡时写“无”。ID、证据和确认生命周期遵循文档契约。 -->

- Review ID：{{review-id}}
- 阶段 / Flow / 关卡：{{review-target}}
- 产物及确认范围：{{paths-sections-and-nodes}}
- 基线位置：{{git-version-or-snapshot-links}}
- 待用户决定：{{decisions}}

## 阶段状态

<!-- 按实际位置更新状态；首次建档仅当前阶段进入“进行中”。有效确认记录仅引用仍适用于当前产物的已批准记录。未来阶段的“—”表示尚无产物或确认。 -->

| 阶段 | 状态 | 产物位置 | 有效确认记录 |
| --- | --- | --- | --- |
| PRD | 未开始 | — | — |
| 品牌信息 | 未开始 | — | — |
| 视觉方向 | 未开始 | — | — |
| Design System | 未开始 | — | — |

## 流程批次状态

<!-- PRD 确认设计批次后填入真实 Flow；关卡区分“范围确认”和“最终验收”。有效引用按关卡标明，可同时保留本批范围与验收记录。逐批更新，不把“设计稿已生成”当作验收通过。 -->

| Flow ID | 顺序 | 当前关卡 | 状态 | 流程文档 | 有效确认记录 |
| --- | --- | --- | --- | --- | --- |

## 设计工具晋升

<!-- HTML Review 后记录是否晋升。未决定时不得连接默认晋升工具；不晋升时记录用户决定和冻结的 HTML 基线。 -->

- 晋升决定：{{pending-approved-declined-or-direct-tool-mode}}
- 晋升范围：{{tokens-components-key-screens-or-not-applicable}}
- 批次预算：{{flow-page-size-readback-visual-retry-limits}}
- 当前用量：{{actual-batch-usage}}
- 超预算批准：{{approval-review-id-or-none}}
- HTML 冻结基线：{{prototype-version-and-screenshots}}
- 设计工具批准基线：{{design-tool-version-and-evidence-or-none}}

## 确认记录

<!-- 按文档契约追加确认历史；有效确认引用维护在对应状态表。 -->

| Review ID | 阶段 / Flow / 关卡 | 产物及确认范围 | 基线位置 | 用户确认原意 | 确认时间 |
| --- | --- | --- | --- | --- | --- |

## 预检与阻塞记录

### 最近一次预检

- 类型：{{项目预检、HTML 原型检查、设计工具晋升预检或范围能力复检}}
- 时间：{{preflight-time}}
- 目标与检查范围：{{preflight-scope}}
- 需求与所需能力：{{requirements-and-capabilities}}
- 实际检查及证据：{{preflight-evidence}}
- 结果与能力限制：{{preflight-result}}

<!-- 更新最近一次预检时，保留阻塞卡片中的历史失败与解除证据。没有故障时“阻塞历史”写“无”；有故障时按下列结构逐条追加，不删除已解除记录。 -->

### 阻塞历史

<!-- 每个阻塞填写一张卡片；ID 与生命周期遵循文档契约，顶部仅链接未解除的卡片。

#### {{blocker-id}}

- 发生时间：
- 阻塞前阶段 / Flow / 关卡及状态：
- 操作目标：
- 失败证据：
- 已成功节点：
- 结果未知的操作：
- 需要用户处理或决定：
- 用户回应：
- 重检结果与证据：
- 目标区域回读结果：
- 是否解除及时间：
- 恢复位置与下一步：

无相关项明确写“无”；尚未执行的重检或回读写“待执行”。
-->

## 待重新审核项

<!-- 每项变更填写一行；ID、影响处理和重新审核生命周期遵循文档契约。 -->

| 变更 ID | 变化来源与差异证据 | 受影响阶段 / Flow / 组件 | 原确认记录 | 拟修改范围及用户决定 | 状态 / 新确认记录 |
| --- | --- | --- | --- | --- | --- |
