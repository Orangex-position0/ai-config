$ErrorActionPreference = "Stop"

$Json = $false

foreach ($Arg in $args) {
    if ($Arg -eq "--json") {
        $Json = $true
    } elseif ($Arg -eq "--help" -or $Arg -eq "-h") {
        Write-Output "Usage: check.ps1 [--json]"
        exit 0
    } else {
        throw "Unknown argument: $Arg"
    }
}

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$ClaudeHome = if ($env:CLAUDE_HOME) { $env:CLAUDE_HOME } else { Join-Path $HOME ".claude" }
$CodexHome = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME ".codex" }
$Failures = @()

function Test-PathPair($SourceRelative, $DestinationRoot, $DestinationRelative = $SourceRelative) {
    $Source = Join-Path $Root $SourceRelative
    $Destination = Join-Path $DestinationRoot $DestinationRelative

    if (-not (Test-Path $Source)) {
        return
    }

    if (-not (Test-Path $Destination)) {
        $script:Failures += "missing: $Destination"
        return
    }

    $SourceFiles = Get-ChildItem -Recurse -File -Path $Source | Sort-Object FullName
    foreach ($SourceFile in $SourceFiles) {
        $Relative = $SourceFile.FullName.Substring($Source.Length).TrimStart("\", "/")
        $TargetFile = Join-Path $Destination $Relative

        if (-not (Test-Path $TargetFile)) {
            $script:Failures += "missing: $TargetFile"
            continue
        }

        $SourceHash = (Get-FileHash -Algorithm SHA256 $SourceFile.FullName).Hash
        $TargetHash = (Get-FileHash -Algorithm SHA256 $TargetFile).Hash
        if ($SourceHash -ne $TargetHash) {
            $script:Failures += "drift: $TargetFile"
        }
    }
}

function Test-AgentPair($DestinationRoot) {
    if (Test-Path (Join-Path $Root "agents")) {
        Test-PathPair "agents" $DestinationRoot "agents"
    } elseif (Test-Path (Join-Path $Root "agent")) {
        Test-PathPair "agent" $DestinationRoot "agents"
    }
}

function Test-FilePair($SourceRelative, $Destination) {
    $Source = Join-Path $Root $SourceRelative

    if (-not (Test-Path $Source)) {
        return
    }

    if (-not (Test-Path $Destination)) {
        $script:Failures += "missing: $Destination"
        return
    }

    $SourceHash = (Get-FileHash -Algorithm SHA256 $Source).Hash
    $TargetHash = (Get-FileHash -Algorithm SHA256 $Destination).Hash
    if ($SourceHash -ne $TargetHash) {
        $script:Failures += "drift: $Destination"
    }
}

function Test-SkillReadmeLinks() {
    $Readme = Join-Path $Root "skills/README.md"
    if (-not (Test-Path $Readme)) {
        return
    }

    $Content = Get-Content -Raw -Path $Readme
    $Matches = [regex]::Matches($Content, "\]\(\./([^/)]+)/SKILL\.md\)")
    $SkillNames = $Matches | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique

    foreach ($SkillName in $SkillNames) {
        $SkillPath = Join-Path $Root "skills/$SkillName/SKILL.md"
        if (-not (Test-Path $SkillPath)) {
            $script:Failures += "missing skill: skills/$SkillName/SKILL.md referenced by skills/README.md"
        }
    }
}

Test-SkillReadmeLinks

Test-PathPair "rules" $ClaudeHome
Test-PathPair "skills" $ClaudeHome
Test-AgentPair $ClaudeHome
Test-PathPair "commands" $ClaudeHome
Test-PathPair "templates" $ClaudeHome
Test-FilePair "CLAUDE.md" (Join-Path $ClaudeHome "CLAUDE.md")

Test-PathPair "rules" $CodexHome
Test-PathPair "skills" $CodexHome
Test-AgentPair $CodexHome
Test-PathPair "templates" $CodexHome
Test-FilePair "AGENTS.md" (Join-Path $CodexHome "AGENTS.md")

if ($Json) {
    [PSCustomObject]@{
        ok = $Failures.Count -eq 0
        failures = $Failures
    } | ConvertTo-Json -Depth 5
} elseif ($Failures.Count -eq 0) {
    Write-Output "ai-config check passed."
} else {
    Write-Output "ai-config check failed:"
    foreach ($Failure in $Failures) {
        Write-Output "- $Failure"
    }
}

if ($Failures.Count -gt 0) {
    exit 1
}
