$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
function Assert-True {
    param([bool]$Condition, [string]$Message)
    if (-not $Condition) { throw $Message }
}

$required = @(
    'music.html',
    'music-content.json',
    'css\music.css',
    'js\music.js',
    'MUSIC-EDITING-GUIDE.md',
    'docs\music-redesign-plan.md'
)
foreach ($relative in $required) {
    Assert-True (Test-Path -LiteralPath (Join-Path $repoRoot $relative) -PathType Leaf) "Missing required file: $relative"
}

$html = [System.IO.File]::ReadAllText((Join-Path $repoRoot 'music.html'))
$css = [System.IO.File]::ReadAllText((Join-Path $repoRoot 'css\music.css'))
$script = [System.IO.File]::ReadAllText((Join-Path $repoRoot 'js\music.js'))
$content = [System.IO.File]::ReadAllText((Join-Path $repoRoot 'music-content.json')) | ConvertFrom-Json
$expectedTitle = 'Music ' + [char]0x2014 + ' Production, Releases & Collaboration'

Assert-True ($content.page.title -eq $expectedTitle) 'The primary page title is not exact.'
Assert-True ($html -match 'noindex, nofollow') 'music.html is missing noindex, nofollow.'
Assert-True ($html -notmatch '<iframe') 'A YouTube iframe is present before user activation.'
Assert-True ($script -match 'musicmakers') 'The requested viewing word is missing.'
Assert-True ($script -match 'youtube-nocookie\.com') 'Privacy-enhanced YouTube embeds are missing.'
Assert-True ($script -notmatch 'autoplaying') 'Unexpected autoplay implementation found.'
Assert-True ($css -match ':focus-visible') 'Visible focus styling is missing.'
Assert-True ($css -match 'prefers-reduced-motion:\s*reduce') 'Reduced-motion styling is missing.'
Assert-True ($css -match '@media \(max-width: 620px\)') 'Narrow-screen release stacking breakpoint is missing.'

$sectionNames = @($content.sections.PSObject.Properties.Name)
$expectedSections = @('introduction', 'showreel', 'releases', 'recognition', 'montage', 'workingTogether')
Assert-True (($sectionNames -join ',') -eq ($expectedSections -join ',')) 'Music sections are not in the required order.'

$videos = @($content.sections.introduction.video, $content.sections.showreel.video) + @($content.sections.releases.items)
foreach ($video in $videos) {
    Assert-True (-not [string]::IsNullOrWhiteSpace($video.title)) 'A video title is missing.'
    Assert-True (-not [string]::IsNullOrWhiteSpace($video.url)) 'A video URL is missing.'
    Assert-True ($null -ne $video.captions) 'A video captions field is missing.'
    Assert-True ($null -ne $video.transcript) 'A video transcript field is missing.'
}

Add-Type -AssemblyName System.Drawing
foreach ($property in $content.media.PSObject.Properties) {
    $media = $property.Value
    $assetPath = Join-Path $repoRoot $media.source
    Assert-True (Test-Path -LiteralPath $assetPath -PathType Leaf) "Missing media file: $($media.source)"
    $image = [System.Drawing.Image]::FromFile($assetPath)
    try {
        Assert-True ($image.Width -eq [int]$media.width) "Width mismatch for $($property.Name)."
        Assert-True ($image.Height -eq [int]$media.height) "Height mismatch for $($property.Name)."
    }
    finally {
        $image.Dispose()
    }
}

$cname = ([System.IO.File]::ReadAllText((Join-Path $repoRoot 'CNAME'))).Trim()
Assert-True ($cname -eq 'leonliii.com') 'CNAME changed unexpectedly.'
Write-Host 'Music page checks passed.'