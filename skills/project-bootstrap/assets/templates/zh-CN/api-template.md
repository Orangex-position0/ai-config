# API 文档

## 基础信息

- 服务名称：<service-name>
- 接口版本：v<major>.<minor>.<patch>
- Base URL：<protocol>://<domain>:<port>/<base-path>
- 认证方式：<Bearer Token / Cookie Session / API Key / 无>
- 数据格式：请求 `<content-type>`，响应 `<content-type>`

## 接口清单

| 方法 | 路径                 | 接口名称   | 认证    | 说明       |
| ---- | -------------------- | ---------- | ------- | ---------- |
| GET  | `/api/v1/<resource>` | <接口名称> | <是/否> | <接口作用> |

## 接口详情

### <METHOD> <PATH> · <接口名称>

接口说明：<说明接口解决什么问题>

请求地址：`<protocol>://<domain>:<port>/<path>`

请求头：

| 参数名        | 类型   | 必填 | 示例值           | 备注       |
| ------------- | ------ | ---- | ---------------- | ---------- |
| Authorization | string | 是   | `Bearer <token>` | <认证说明> |

请求参数：

| 参数名      | 位置            | 类型   | 必填 | 默认值 | 取值范围 | 格式     | 示例值    | 备注     |
| ----------- | --------------- | ------ | ---- | ------ | -------- | -------- | --------- | -------- |
| <paramName> | path/query/body | string | 是   | <none> | <range>  | <format> | <example> | <remark> |

请求示例：

```bash
curl -X <METHOD> '<url>' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '<json-body>'
```

响应参数：

| 参数名      | 类型   | 必填 | 格式     | 取值范围 | 示例值    | 备注     |
| ----------- | ------ | ---- | -------- | -------- | --------- | -------- |
| <fieldName> | string | 是   | <format> | <range>  | <example> | <remark> |

响应示例：

```json
{
    "data": {}
}
```

错误码：

| HTTP 状态码 | 错误码           | 说明           | 处理建议           |
| ----------- | ---------------- | -------------- | ------------------ |
| 400         | validation_error | 请求参数不合法 | 检查参数格式和值域 |

安全性说明：

- 访问授权：<说明认证与授权方式>
- 传输加密：<说明是否要求 HTTPS>
- 敏感数据：<列出敏感字段及脱敏要求>

## 版本管理

- 当前版本：v<major>.<minor>.<patch>
- 兼容策略：<说明兼容和废弃策略>

## 更新记录

| 版本   | 日期       | 修订人 | 变更摘要       |
| ------ | ---------- | ------ | -------------- |
| v0.1.0 | YYYY-MM-DD | <name> | 初始化接口文档 |
