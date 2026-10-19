# 源码目录

本项目按业务功能组织代码。`app/` 负责应用启动与路由；`features/auth/`、`features/document/`、`features/workspace/` 示范业务模块的位置。`workspace` 页面是初始路由；其他空目录中的 `.gitkeep` 只保留结构，尚未实现认证或文档功能。

每个 feature 内按职责放置代码：

| 目录 | 放什么 |
| --- | --- |
| `api/` | 本模块的接口调用、请求与响应类型 |
| `components/` | 本模块使用的业务组件 |
| `composables/` | 本模块复用的 Vue 逻辑 |
| `stores/` | 需要跨页面或组件保留的模块状态 |
| `types/` | 仅本模块使用的类型 |
| `views/` | 路由级页面 |

例如实现文档功能时，可在 `document/components/` 新增 `DocumentEditor.vue`、`DocumentTree.vue`，在 `document/views/` 新增 `DocumentDetailView.vue`。通过该 feature 的 `index.ts` 导出路由或外部模块需要的入口。

`shared/` 只放多个 feature 确实共用的代码：`api/` 放 HTTP Client，`components/` 放通用组件，`composables/` 放共享 Vue 逻辑，`types/` 放共享类型，`utils/` 放纯工具函数。构建时导入的图片、字体和样式放 `assets/`；固定文件名的静态文件放 `public/`。

如果项目没有认证或文档功能，删除或改名相应示例目录。目录中有真实代码后，删除 `.gitkeep`。
