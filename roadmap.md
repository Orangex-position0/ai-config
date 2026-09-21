# 待讨论项

- [x] Implement 阶段默认使用 tdd，那是否要增加一些相关文件？可以参考 matt pocock 的 `/implement` skill 是如何写的？
  - 结论：不新增 TDD 文件；由 Plan 定义 seam、Tasks 定义 Verification、Implement 执行最小 TDD 循环并记录 Evidence。
- [x] Validate 阶段显式 ai 验收，然后人工 review。但是人工 review 应该只 review 关键代码路径，而不是全部代码，参考笔记
  - 结论：先由 AI 全量核对 Contract，再由人工按风险审查关键代码路径；两部分统一记录在 `validation.md`。
- [x] Specify 阶段，我推荐按一定顺序来讨论
    - 目的：让开发者能更了解项目结构，而不是 ai 写了代码后，你也不了解架构、各个模块的功能等
    - 顺序可以讨论，我初步想法：首先讨论需求（如果没有需求文档），然后架构设计 --> 技术栈（包括语言、框架、关键的库） --> 定义 MVP 边界 --> 拆解模块（分为哪些模块，一般按功能来划分） --> 每个模块对应一个 spec --> 具体讨论每个模块的 spec
    - 架构设计是否可放在后面，因为一般是先有需求，再设计模块，然后思考如何组织模块（也就是架构设计）
  - 结论：Specify 只确定问题、场景、MVP、业务能力和 feature 边界；架构、技术栈与代码模块移至 Plan，并在批准前完成 Developer Orientation。
- [x] 要考虑到 token 消耗，因为 superpower 就是因为太重了，token 消耗非常高，所以社区比较诟病，很多开发者选择使用轻量级的 openspec 来替代
  - 结论：通过按需读取、单任务执行、复用未变化结论和明确停止条件控制成本，不维护数字 token 预算。
- [x] spec.md 文档需要一个 rule.md 作为规范说明文档吗？因为 spec 的编写规范有很多，而且后期也会不断更新
  - 结论：不创建 `.sdd/rule.md`；通用规则集中维护于 `protocol/spec-writing.md`，项目约束和结构分别归 Constitution 与模板。
