$ErrorActionPreference = "Stop"

$DryRun = $false
$Json = $false

foreach ($Arg in $args) {
    if ($Arg -eq "--dry-run") {
        $DryRun = $true
    } elseif ($Arg -eq "--json") {
        $Json = $true
    } elseif ($Arg -eq "--help" -or $Arg -eq "-h") {
        Write-Output "Usage: install.ps1 [--dry-run] [--json]"
        exit 0
    } else {
        throw "Unknown argument: $Arg"
    }
}

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$ClaudeHome = if ($env:CLAUDE_HOME) { $env:CLAUDE_HOME } else { Join-Path $HOME ".claude" }
$CodexHome = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME ".codex" }
$Generated = "Generated from ai-config. Do not edit generated copies directly."
$Operations = @()

function Add-CopyDirOperation($SourceRelative, $DestinationRoot) {
    Add-CopyDirAsOperation $SourceRelative $SourceRelative $DestinationRoot
}

function Add-CopyDirAsOperation($SourceRelative, $DestinationRelative, $DestinationRoot) {
    $Source = Join-Path $Root $SourceRelative
    if (-not (Test-Path $Source)) {
        return
    }

    $Destination = Join-Path $DestinationRoot $DestinationRelative
    $script:Operations += [PSCustomObject]@{
        kind = "copy-dir"
        source = $Source
        destination = $Destination
    }
}

function Add-AgentOperation($DestinationRoot) {
    $Agents = Join-Path $Root "agents"
    $Agent = Join-Path $Root "agent"

    if (Test-Path $Agents) {
        Add-CopyDirAsOperation "agents" "agents" $DestinationRoot
    } elseif (Test-Path $Agent) {
        Add-CopyDirAsOperation "agent" "agents" $DestinationRoot
    }
}

function Add-CopyFileOperation($SourceRelative, $Destination) {
    $Source = Join-Path $Root $SourceRelative
    if (-not (Test-Path $Source)) {
        return
    }

    $script:Operations += [PSCustomObject]@{
        kind = "copy-file"
        source = $Source
        destination = $Destination
    }
}

function Invoke-Operation($Operation) {
    if ($DryRun) {
        return
    }

    if ($Operation.kind -eq "copy-dir") {
        if (Test-Path $Operation.destination) {
            Remove-Item -Recurse -Force $Operation.destination
        }

        New-Item -ItemType Directory -Force (Split-Path -Parent $Operation.destination) | Out-Null
        Copy-Item -Recurse -Force $Operation.source $Operation.destination
    } elseif ($Operation.kind -eq "copy-file") {
        New-Item -ItemType Directory -Force (Split-Path -Parent $Operation.destination) | Out-Null
        Copy-Item -Force $Operation.source $Operation.destination
    }
}

Add-CopyDirOperation "rules" $ClaudeHome
Add-CopyDirOperation "skills" $ClaudeHome
Add-AgentOperation $ClaudeHome
Add-CopyDirOperation "commands" $ClaudeHome
Add-CopyDirOperation "templates" $ClaudeHome
Add-CopyFileOperation "CLAUDE.md" (Join-Path $ClaudeHome "CLAUDE.md")

Add-CopyDirOperation "rules" $CodexHome
Add-CopyDirOperation "skills" $CodexHome
Add-AgentOperation $CodexHome
Add-CopyDirOperation "templates" $CodexHome
Add-CopyFileOperation "AGENTS.md" (Join-Path $CodexHome "AGENTS.md")

foreach ($Operation in $Operations) {
    Invoke-Operation $Operation
}

if (-not $DryRun) {
    $State = [PSCustomObject]@{
        generated = $Generated
        installedAt = (Get-Date).ToUniversalTime().ToString("o")
        sourceRoot = $Root.Path
        operations = $Operations
    }
    $StatePath = Join-Path $Root "install-state.json"
    $State | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 $StatePath
}

if ($Json) {
    [PSCustomObject]@{
        dryRun = $DryRun
        operationCount = $Operations.Count
        operations = $Operations
    } | ConvertTo-Json -Depth 5
} else {
    Write-Output "$(if ($DryRun) { "Planned" } else { "Installed" }) $($Operations.Count) operations."
    foreach ($Operation in $Operations) {
        Write-Output "- $($Operation.kind): $($Operation.source) -> $($Operation.destination)"
    }
}
