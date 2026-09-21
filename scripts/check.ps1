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
$AgentsHome = if ($env:AGENTS_HOME) { $env:AGENTS_HOME } else { Join-Path $HOME ".agents" }
$ClaudeHome = if ($env:CLAUDE_HOME) { $env:CLAUDE_HOME } else { Join-Path $HOME ".claude" }
$CodexHome = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME ".codex" }
$Failures = @()
$Warnings = @()
$Modes = @()
$SharedDirs = @("rules", "skills", "agents", "commands", "templates", "assets", "references")
$HelperScripts = @("scripts/inline-template.mjs", "scripts/export-resume-pdf.mjs")

function Get-CanonicalPath($Path) {
    (Get-Item -LiteralPath $Path -Force).FullName
}

function Get-RelativeFiles($Path) {
    if (-not (Test-Path $Path)) { return @{} }
    $RootPath = (Get-CanonicalPath $Path).TrimEnd("\", "/")
    $Map = @{}
    foreach ($File in Get-ChildItem -Recurse -File -Path $RootPath | Sort-Object FullName) {
        $Relative = $File.FullName.Substring($RootPath.Length).TrimStart("\", "/")
        $Map[$Relative] = (Get-FileHash -Algorithm SHA256 $File.FullName).Hash
    }
    $Map
}

function Test-DirSame($Source, $Destination) {
    if (-not (Test-Path $Source) -or -not (Test-Path $Destination)) { return $false }
    $SourceFiles = Get-RelativeFiles $Source
    $DestFiles = Get-RelativeFiles $Destination
    if ($SourceFiles.Count -ne $DestFiles.Count) { return $false }
    foreach ($Key in $SourceFiles.Keys) {
        if (-not $DestFiles.ContainsKey($Key)) { return $false }
        if ($SourceFiles[$Key] -ne $DestFiles[$Key]) { return $false }
    }
    return $true
}

function Test-FileSame($Source, $Destination) {
    if (-not (Test-Path $Source) -or -not (Test-Path $Destination)) { return $false }
    $SourceHash = (Get-FileHash -Algorithm SHA256 $Source).Hash
    $DestHash = (Get-FileHash -Algorithm SHA256 $Destination).Hash
    $SourceHash -eq $DestHash
}

function Test-PathPair($SourceRelative, $DestinationRoot, $DestinationRelative = $SourceRelative) {
    $Source = Join-Path $Root $SourceRelative
    $Destination = Join-Path $DestinationRoot $DestinationRelative
    if (-not (Test-Path $Source)) { return }
    if (-not (Test-Path $Destination)) {
        $script:Failures += "missing: $Destination"
    } elseif (-not (Test-DirSame $Source $Destination)) {
        $script:Failures += "drift: $Destination"
    }
}

function Test-FilePair($SourceRelative, $Destination) {
    $Source = Join-Path $Root $SourceRelative
    if (-not (Test-Path $Source)) { return }
    if (-not (Test-Path $Destination)) {
        $script:Failures += "missing: $Destination"
    } elseif (-not (Test-FileSame $Source $Destination)) {
        $script:Failures += "drift: $Destination"
    }
}

function Get-LinkTarget($Path) {
    if (-not (Test-Path $Path)) { return $null }
    $Item = Get-Item $Path -Force
    if (-not (($Item.Attributes -band [IO.FileAttributes]::ReparsePoint) -eq [IO.FileAttributes]::ReparsePoint)) {
        return $null
    }
    $Target = $Item.Target
    if ($Target -is [array]) { return $Target[0] }
    return $Target
}

function Test-ProjectionDir($Relative, $RuntimeHome, $Label) {
    $Source = Join-Path $AgentsHome $Relative
    $Destination = Join-Path $RuntimeHome $Relative
    if (-not (Test-Path $Source)) { return }

    $Target = Get-LinkTarget $Destination
    if ($Target) {
        $ResolvedTarget = if (Test-Path $Target) { Get-CanonicalPath $Target } else { $null }
        $ResolvedSource = if (Test-Path $Source) { Get-CanonicalPath $Source } else { $null }
        if ($ResolvedTarget -and $ResolvedSource -and $ResolvedTarget -eq $ResolvedSource) {
            $script:Modes += "$Label`:$Relative`:link"
            return
        }
    }

    if (-not (Test-Path $Destination)) {
        $script:Failures += "missing: $Destination"
    } elseif (Test-DirSame $Source $Destination) {
        $script:Modes += "$Label`:$Relative`:copy"
        $script:Warnings += "copy fallback projection detected: $Destination"
    } else {
        $script:Failures += "drift: $Destination"
    }
}

function Test-SharedInstall() {
    foreach ($Dir in $SharedDirs) {
        if ($Dir -eq "agents" -and -not (Test-Path (Join-Path $Root "agents")) -and (Test-Path (Join-Path $Root "agent"))) {
            Test-PathPair "agent" $AgentsHome "agents"
        } else {
            Test-PathPair $Dir $AgentsHome
        }
    }
    foreach ($Helper in $HelperScripts) {
        Test-FilePair $Helper (Join-Path $AgentsHome $Helper)
    }
}

function Test-Projection($RuntimeHome, $Label) {
    foreach ($Dir in ($SharedDirs + @("scripts"))) {
        Test-ProjectionDir $Dir $RuntimeHome $Label
    }
}

function Test-SkillReadmeLinks() {
    $Readme = Join-Path $Root "skills/README.md"
    if (-not (Test-Path $Readme)) { return }
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

function Test-HardcodedRuntimePaths() {
    foreach ($Dir in @("skills", "rules")) {
        $Path = Join-Path $Root $Dir
        if (-not (Test-Path $Path)) { continue }
        $Matches = Get-ChildItem -Recurse -File -Filter "*.md" -Path $Path |
            Select-String -Pattern "~/\.(claude|codex)/"
        foreach ($Match in $Matches) {
            $script:Warnings += "runtime-specific path reference: $($Match.Path):$($Match.LineNumber):$($Match.Line.Trim())"
        }
    }
}

Test-SkillReadmeLinks
Test-SharedInstall
Test-Projection $ClaudeHome "claude"
Test-Projection $CodexHome "codex"
Test-FilePair "CLAUDE.md" (Join-Path $ClaudeHome "CLAUDE.md")
Test-FilePair "AGENTS.md" (Join-Path $CodexHome "AGENTS.md")
Test-HardcodedRuntimePaths

if ($Json) {
    [PSCustomObject]@{
        ok = $Failures.Count -eq 0
        agentsHome = $AgentsHome
        failures = $Failures
        warnings = $Warnings
        modes = $Modes
    } | ConvertTo-Json -Depth 6
} elseif ($Failures.Count -eq 0) {
    Write-Output "ai-config check passed."
    foreach ($Warning in $Warnings) {
        Write-Output "Warning: $Warning"
    }
} else {
    Write-Output "ai-config check failed:"
    foreach ($Failure in $Failures) {
        Write-Output "- $Failure"
    }
    foreach ($Warning in $Warnings) {
        Write-Output "Warning: $Warning"
    }
}

if ($Failures.Count -gt 0) {
    exit 1
}
