#!/usr/bin/env python3
"""旧校验入口：转发到 check-skills.mjs，避免维护两套不同的 YAML 规则。

需要 Node.js >=20；先执行 npm ci 安装校验依赖。
支持 check-skills.mjs 的 --json / --help 参数，原样传播退出码。
"""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path


def main() -> int:
    node = shutil.which("node")
    if not node:
        print("Node.js >=20 is required; run npm ci before validation.", file=sys.stderr)
        return 1
    script = Path(__file__).resolve().with_name("check-skills.mjs")
    return subprocess.run([node, str(script), *sys.argv[1:]], check=False).returncode


if __name__ == "__main__":
    raise SystemExit(main())
