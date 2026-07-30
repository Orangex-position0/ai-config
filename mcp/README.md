# MCP 索引

本目录只记录 MCP 的来源、用途和安装入口，不集中安装或同步 MCP 配置。MCP 往往绑定本机路径、账号授权、token 和运行时，自动化管理容易把本机状态误提交或误覆盖。

## 原则

- 只提交 MCP 名称、用途、官网或 GitHub、推荐安装命令、需要的环境变量名。
- 不提交 token、API key、`Authorization` 值、OAuth 状态、本机绝对路径或运行时生成配置。
- Codex/Claude 自动注入的 MCP 不迁移到本项目。
- 真正启用 MCP 时，在 Claude/Codex 官方配置入口中手动安装。

## MCP 清单

| MCP | 用途 | 来源 | 安装 / 配置入口 | 环境变量 |
| --- | --- | --- | --- | --- |
| `codebase-memory-mcp` | 代码库索引、结构查询 | 项目 README 或包发布页 | 按官方文档安装，并确保命令在 `PATH` 中 | 无 |
| `web-reader` | 读取网页内容 | BigModel / Z.ai MCP endpoint | 在 Claude/Codex MCP 配置中添加 remote endpoint | `BIGMODEL_API_KEY` 或对应授权变量 |
| `web-search-prime` | Web 搜索 | BigModel / Z.ai MCP endpoint | 在 Claude/Codex MCP 配置中添加 remote endpoint | `BIGMODEL_API_KEY` 或对应授权变量 |
| `zai-mcp-server` | Z.ai MCP server | npm package | `npx -y @z_ai/mcp-server` | `Z_AI_API_KEY`, `Z_AI_MODE` |
| `excalidraw` | 生成和编辑 Excalidraw 手绘风格图表 | <https://github.com/excalidraw/excalidraw-mcp> | 推荐 remote endpoint: `https://mcp.excalidraw.com`；也可从 Releases 下载 `.mcpb` | 无 |

## 迁移方式

1. 先确认 MCP 是否长期需要。
2. 查官方 README 或产品文档，确认最新安装命令和配置格式。
3. 在本文件补充来源、命令和环境变量名。
4. 在本机 Claude/Codex 配置里手动启用。
5. 运行对应工具的 MCP list/status 命令确认可用。

不要把运行时自动注入的 MCP 记录进清单，例如 Codex 桌面内置的 `node_repl`。

## 备注

如果以后 MCP 数量变多，且确实需要跨机器一键同步，再引入 `mcp/servers.json` 和安装脚本。现在文档索引就够了。
