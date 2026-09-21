# Python 栈

> 维护说明：本文件只持有 Python 项目初始化的少量增量。通用文档模板仍由 `project-bootstrap` 主流程处理。

## 默认边界

Python 分支默认面向 `uv + pyproject.toml + src/ layout` 项目。检测到 Poetry、PDM、pipenv 或裸 `requirements.txt` 时尊重既有项目，不强行迁移到 uv；新项目或无明确包管理器时优先使用 uv 命令。

不默认生成 FastAPI / Flask / Django 代码或目录。检测到 Web/API 信号时，只影响 `docs/api/api-template.md` 是否生成，并按需读取 `<rules>/python/fastapi.md` 等框架规则。

## rules 指针

`<rules>` 由 `project-bootstrap` 定义为当前宿主的 rules 根目录。先解析下列 rule key，再按「使用锚点」读取对应章节。

| Rule key | 文件 |
|---|---|
| `python-coding` | `<rules>/python/coding-style.md` |
| `python-testing` | `<rules>/python/testing.md` |
| `python-security` | `<rules>/python/security.md` |
| `python-fastapi` | `<rules>/python/fastapi.md` |
| `conventional-commit` | `<rules>/common/conventional-commit.md` |

## 使用锚点

| 用途 | Rule key | 章节 |
|---|---|---|
| 格式与 lint 工具 | `python-coding` | Formatting |
| 测试与覆盖率命令 | `python-testing` | Framework + Coverage |
| Bandit 安全扫描 | `python-security` | Security Scanning |
| FastAPI API 项目约束 | `python-fastapi` | 全文 |
| commit 规范 | `conventional-commit` | 项目特定约定 |

## pyproject.toml（物化指令）

目标项目没有 `pyproject.toml` 时，生成最小 uv 项目配置；不默认生成可发布 package 配置、`build-system`、console scripts、author、license、classifiers 或 urls。

项目名处理：

- 目录名可安全转成 PEP 508 distribution name（ASCII、字母数字、`.` / `_` / `-`，且不以分隔符开头或结尾）时，用该名称。
- 目录名包含中文、空格、特殊符号或无法安全判断时，先问用户项目名；不要臆造。
- 这不是 Python import package 名；import package 仍按「目录结构」规则单独判断。

```toml
[project]
name = "<project-name>"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = []

[dependency-groups]
dev = [
  "bandit",
  "pytest",
  "pytest-cov",
  "ruff",
]

[tool.ruff]
line-length = 88
target-version = "py312"

[tool.pytest.ini_options]
testpaths = ["tests"]

[tool.uv]
package = false
```

若已有 `pyproject.toml`，不要覆盖；只根据已存在的工具配置调整 hooks/CI 命令。Python rule 中的 `black` / `isort` 职责由 `ruff format` 与 `ruff check` 承担，除非项目已经显式配置 `black` / `isort`。

## lefthook.yml（增量，rules 未覆盖）

Python 推荐配置：

```yaml
# pre-commit：格式 + lint + Secret，全部秒级
pre-commit:
  parallel: true
  commands:
    format:
      glob: "*.py"
      run: uv run ruff format --check {staged_files}
    lint:
      glob: "*.py"
      run: uv run ruff check {staged_files}
    secret-scan:
      run: gitleaks protect --staged

# pre-push：测试覆盖率 + 安全扫描
pre-push:
  commands:
    test:
      run: uv run pytest --cov=src --cov-report=term-missing
    security:
      run: uv run bandit -r src/

# commit-msg：基础提交信息校验
commit-msg:
  commands:
    gitlint:
      run: gitlint --msg-filename {1}
```

适配规则：

- 若项目已有 `mypy.ini`、`.mypy.ini`、`pyrightconfig.json`，或 `pyproject.toml` 中已有 mypy/pyright 配置，则在 `pre-push.commands` 追加对应类型检查；否则不强加。
- 若项目不是 uv 项目且已有明确命令入口，按项目既有包管理器改写 `uv run ...`；不确定时保留 uv 主路径并提示用户确认。
- `gitlint` 和 `gitleaks` 是外部工具。检测不到时提示安装，不删除 hook 命令。

## GitHub Actions CI

只在 `project-bootstrap` 主流程判定需要 GitHub Actions CI 时生成 `.github/workflows/ci.yml`；若同名文件已存在，跳过并提示，不覆盖。

默认 CI：

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  python:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.12", "3.13"]
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v5
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
      - run: uv sync --all-extras --dev
      - run: uv run ruff format --check .
      - run: uv run ruff check .
      - run: uv run pytest --cov=src --cov-report=term-missing
      - run: uv run bandit -r src/
```

适配规则：

- 默认只跑 Ubuntu + Python 3.12/3.13。
- 若已有 `pyproject.toml` 且 `[project] requires-python` 明确包含更低版本（如 `>=3.11`），把矩阵扩展到项目声明的最低受支持 minor 到当前默认最高 minor。
- 不默认生成 PyPI publish、Docker build/push、coverage upload、依赖漏洞扫描、multi-OS matrix、cron 或 release workflow。

## 目录结构（物化指令）

默认只建空目录（`.gitkeep` 占位）：

- `src/`
- `tests/`

只有在包名明确时才建 `src/<package>/`。包名明确信号包括：

- 已存在 `src/<package>/`
- `pyproject.toml` 中已有 `[project] name = "..."`
- 用户明确给出 Python import package 名

包名不能安全推断时，退回只创建 `src/`，不臆造包名。

## 前提依赖

Python dev 依赖默认通过 `pyproject.toml` 的 `dependency-groups.dev` 声明：`ruff`、`pytest`、`pytest-cov`、`bandit`。检测到缺失时提示用户执行 `uv add --dev ruff pytest pytest-cov bandit`，不替用户联网安装。
