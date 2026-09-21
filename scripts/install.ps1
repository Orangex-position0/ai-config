$ErrorActionPreference = "Stop"

$DryRun = $false
$Json = $false
$Force = $false

foreach ($Arg in $args) {
    if ($Arg -eq "--dry-run") {
        $DryRun = $true
    } elseif ($Arg -eq "--json") {
        $Json = $true
    } elseif ($Arg -eq "--force") {
        $Force = $true
    } elseif ($Arg -eq "--help" -or $Arg -eq "-h") {
        Write-Output "Usage: install.ps1 [--dry-run] [--json] [--force]"
        exit 0
    } else {
        throw "Unknown argument: $Arg"
    }
}

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$AgentsHome = if ($env:AGENTS_HOME) { $env:AGENTS_HOME } else { Join-Path $HOME ".agents" }
$ClaudeHome = if ($env:CLAUDE_HOME) { $env:CLAUDE_HOME } else { Join-Path $HOME ".claude" }
$CodexHome = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME ".codex" }
$Generated = "Generated from ai-config. Do not edit generated copies directly."
$Operations = @()
$Warnings = @()
$SharedDirs = @("rules", "skills", "agents", "commands", "templates", "assets", "references")
$HelperScripts = @("scripts/inline-template.mjs", "scripts/export-resume-pdf.mjs")

function Add-Operation($Kind, $Source, $Destination, $Mode = "planned") {
    $script:Operations += [PSCustomObject]@{
        kind = $Kind
        source = $Source
        destination = $Destination
        mode = $Mode
    }
}

function Set-LastOperationMode($Mode) {
    if ($script:Operations.Count -eq 0) { return }
    $script:Operations[$script:Operations.Count - 1].mode = $Mode
}

function Test-ManagedSharedHome() {
    Test-Path (Join-Path $AgentsHome "install-state.json")
}

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

function Remove-Existing($Path) {
    if (Test-Path $Path) {
        Remove-Item -Recurse -Force $Path
    }
}

function Install-SharedDir($SourceRelative, $DestinationRelative = $SourceRelative) {
    $Source = Join-Path $Root $SourceRelative
    if (-not (Test-Path $Source)) { return }
    $Destination = Join-Path $AgentsHome $DestinationRelative
    Add-Operation "install-shared-dir" $Source $Destination
    if ($DryRun) { return }

    if (Test-Path $Destination) {
        if ($Force -or (Test-ManagedSharedHome) -or (Test-DirSame $Source $Destination)) {
            Remove-Existing $Destination
        } else {
            throw "Refusing to replace unmanaged shared directory: $Destination (use --force)"
        }
    }

    New-Item -ItemType Directory -Force (Split-Path -Parent $Destination) | Out-Null
    Copy-Item -Recurse -Force $Source $Destination
}

function Install-SharedFile($SourceRelative, $DestinationRelative = $SourceRelative) {
    $Source = Join-Path $Root $SourceRelative
    if (-not (Test-Path $Source)) { return }
    $Destination = Join-Path $AgentsHome $DestinationRelative
    Add-Operation "install-shared-file" $Source $Destination
    if ($DryRun) { return }

    if (Test-Path $Destination) {
        if ($Force -or (Test-ManagedSharedHome) -or (Test-FileSame $Source $Destination)) {
            Remove-Item -Force $Destination
        } else {
            throw "Refusing to replace unmanaged shared file: $Destination (use --force)"
        }
    }

    New-Item -ItemType Directory -Force (Split-Path -Parent $Destination) | Out-Null
    Copy-Item -Force $Source $Destination
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

function New-DirectoryProjection($Source, $Destination) {
    try {
        New-Item -ItemType SymbolicLink -Path $Destination -Target $Source | Out-Null
        Set-LastOperationMode "symlink"
        return
    } catch {
        if (Test-Path $Destination) { Remove-Existing $Destination }
    }

    try {
        $Parent = Split-Path -Parent $Destination
        New-Item -ItemType Directory -Force $Parent | Out-Null
        $Output = & cmd.exe /c mklink /J "$Destination" "$Source" 2>&1
        if ($LASTEXITCODE -eq 0 -and (Test-Path $Destination)) {
            Set-LastOperationMode "junction"
            return
        }
    } catch {
        if (Test-Path $Destination) { Remove-Existing $Destination }
    }

    New-Item -ItemType Directory -Force (Split-Path -Parent $Destination) | Out-Null
    Copy-Item -Recurse -Force $Source $Destination
    Set-LastOperationMode "copy-fallback"
    $script:Warnings += "copy fallback used for $Destination"
}

function Test-SharedSourceForProjection($Relative) {
    if ($Relative -eq "scripts") {
        return (Test-Path (Join-Path $Root "scripts/inline-template.mjs")) -or (Test-Path (Join-Path $Root "scripts/export-resume-pdf.mjs"))
    }
    if ($Relative -eq "agents" -and -not (Test-Path (Join-Path $Root "agents"))) {
        return Test-Path (Join-Path $Root "agent")
    }
    return Test-Path (Join-Path $Root $Relative)
}

function Project-SharedDir($Relative, $RuntimeHome) {
    $Source = Join-Path $AgentsHome $Relative
    if (-not (Test-Path $Source)) {
        if (-not ($DryRun -and (Test-SharedSourceForProjection $Relative))) {
            return
        }
    }
    $Destination = Join-Path $RuntimeHome $Relative
    Add-Operation "project-dir" $Source $Destination
    if ($DryRun) { return }

    if (Test-Path $Destination) {
        $Target = Get-LinkTarget $Destination
        if ($Target -and (Test-Path $Target) -and ((Get-CanonicalPath $Target) -eq (Get-CanonicalPath $Source))) {
            Set-LastOperationMode "link-existing"
            return
        }
        if ($Force -or (Test-DirSame $Source $Destination)) {
            Remove-Existing $Destination
        } else {
            throw "Refusing to replace drifted runtime directory: $Destination (use --force)"
        }
    }

    New-Item -ItemType Directory -Force (Split-Path -Parent $Destination) | Out-Null
    New-DirectoryProjection $Source $Destination
}

function Install-RuntimeFile($SourceRelative, $Destination) {
    $Source = Join-Path $Root $SourceRelative
    if (-not (Test-Path $Source)) { return }
    Add-Operation "install-runtime-file" $Source $Destination
    if ($DryRun) { return }

    if (Test-Path $Destination) {
        if ($Force -or (Test-FileSame $Source $Destination)) {
            Remove-Item -Force $Destination
        } else {
            throw "Refusing to replace drifted runtime file: $Destination (use --force)"
        }
    }

    New-Item -ItemType Directory -Force (Split-Path -Parent $Destination) | Out-Null
    Copy-Item -Force $Source $Destination
}

foreach ($Dir in $SharedDirs) {
    if ($Dir -eq "agents" -and -not (Test-Path (Join-Path $Root "agents")) -and (Test-Path (Join-Path $Root "agent"))) {
        Install-SharedDir "agent" "agents"
    } else {
        Install-SharedDir $Dir
    }
}
foreach ($Helper in $HelperScripts) {
    Install-SharedFile $Helper
}

foreach ($Dir in ($SharedDirs + @("scripts"))) {
    Project-SharedDir $Dir $ClaudeHome
    Project-SharedDir $Dir $CodexHome
}
Install-RuntimeFile "CLAUDE.md" (Join-Path $ClaudeHome "CLAUDE.md")
Install-RuntimeFile "AGENTS.md" (Join-Path $CodexHome "AGENTS.md")

if (-not $DryRun) {
    New-Item -ItemType Directory -Force $AgentsHome | Out-Null
    $State = [PSCustomObject]@{
        generated = $Generated
        installedAt = (Get-Date).ToUniversalTime().ToString("o")
        sourceRoot = $Root.Path
        agentsHome = $AgentsHome
        claudeHome = $ClaudeHome
        codexHome = $CodexHome
        operationCount = $Operations.Count
        operations = $Operations
        warnings = $Warnings
    }
    $StatePath = Join-Path $Root "install-state.json"
    $SharedStatePath = Join-Path $AgentsHome "install-state.json"
    $State | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 $StatePath
    $State | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 $SharedStatePath
}

if ($Json) {
    [PSCustomObject]@{
        dryRun = $DryRun
        force = $Force
        agentsHome = $AgentsHome
        operationCount = $Operations.Count
        operations = $Operations
        warnings = $Warnings
    } | ConvertTo-Json -Depth 6
} else {
    Write-Output "$(if ($DryRun) { "Planned" } else { "Installed" }) $($Operations.Count) operations."
    Write-Output "Shared home: $AgentsHome"
    foreach ($Operation in $Operations) {
        Write-Output "- $($Operation.kind) [$($Operation.mode)]: $($Operation.source) -> $($Operation.destination)"
    }
    foreach ($Warning in $Warnings) {
        Write-Output "Warning: $Warning"
    }
}
