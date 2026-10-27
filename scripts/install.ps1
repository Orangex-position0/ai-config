$ErrorActionPreference = "Stop"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js >=20 is required."
    exit 1
}
$NodeVersion = & node --version
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
if ([int]($NodeVersion.TrimStart("v").Split(".")[0]) -lt 20) {
    Write-Error "Node.js >=20 is required."
    exit 1
}
& node (Join-Path $PSScriptRoot "lib/config-cli.mjs") install @args
exit $LASTEXITCODE
