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
    'moviemakers-content.json',
    'assets\musicassetsextrafilm\ambitvfilmtemplate.txt',
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
$filmContent = [System.IO.File]::ReadAllText((Join-Path $repoRoot 'moviemakers-content.json')) | ConvertFrom-Json
$expectedTitle = 'Music ' + [char]0x2014 + ' Production, Releases & Collaboration'

Assert-True ($content.page.title -eq $expectedTitle) 'The primary page title is not exact.'
Assert-True ($html -match 'noindex, nofollow') 'music.html is missing noindex, nofollow.'
Assert-True ($html -match '<form[^>]+id="music-unlock-form"') 'The word gate is not a semantic form.'
Assert-True ($html -match '<label for="music-word">') 'The word gate input is missing its label.'
Assert-True ($html -match '<button type="submit">') 'The word gate is missing its native submit button.'
Assert-True ($html -notmatch '<iframe') 'A YouTube iframe is present before user activation.'
Assert-True ($script -match 'musicmakers') 'The Music viewing word is missing.'
Assert-True ($script -match 'moviemakers') 'The film viewing word is missing.'
Assert-True ($script -match 'moviemakers-content\.json') 'The film content target is missing.'
Assert-True ($script -match 'youtube-nocookie\.com') 'Privacy-enhanced YouTube embeds are missing.'
Assert-True ($script -notmatch 'autoplaying') 'Unexpected autoplay implementation found.'
Assert-True ($css -match ':focus-visible') 'Visible focus styling is missing.'
Assert-True ($css -match 'is-film-portfolio.*section-heading__title') 'Film-only heading wrapping is missing.'
Assert-True ($css -match 'prefers-reduced-motion:\s*reduce') 'Reduced-motion styling is missing.'
Assert-True ($css -match '(?s)prefers-reduced-motion:\s*reduce.*?\.js \.reveal\s*\{\s*opacity:\s*1;\s*transform:\s*none;') 'Reduced-motion reveals are not forced visible.'
Assert-True ($script -match 'matchMedia\("\(prefers-reduced-motion: reduce\)"\)') 'Reduced-motion JavaScript handling is missing.'
Assert-True ($css -match '@media \(max-width: 620px\)') 'Narrow-screen release stacking breakpoint is missing.'

$sectionNames = @($content.sections.PSObject.Properties.Name)
$expectedSections = @('introduction', 'showreel', 'releases', 'recognition', 'montage', 'studioVideo', 'workingTogether')
Assert-True (($sectionNames -join ',') -eq ($expectedSections -join ',')) 'Music sections are not in the required order.'

$filmSectionNames = @($filmContent.sections.PSObject.Properties.Name)
$expectedFilmSections = @('introduction', 'showreel', 'releases', 'recognition', 'montage', 'filmClips', 'workingTogether')
Assert-True (($filmSectionNames -join ',') -eq ($expectedFilmSections -join ',')) 'Film sections are not in the required order.'
Assert-True (($filmContent.sections.recognition | ConvertTo-Json -Depth 20 -Compress) -eq ($content.sections.recognition | ConvertTo-Json -Depth 20 -Compress)) 'Film section 04 no longer matches Music section 04.'
Assert-True (($filmContent.sections.montage | ConvertTo-Json -Depth 20 -Compress) -eq ($content.sections.montage | ConvertTo-Json -Depth 20 -Compress)) 'Film section 05 no longer matches Music section 05.'
Assert-True (($filmContent.media | ConvertTo-Json -Depth 20 -Compress) -eq ($content.media | ConvertTo-Json -Depth 20 -Compress)) 'Film media no longer matches the shared Music media.'

$expectedFilmUrls = @(
    'https://www.youtube.com/watch?v=hx4aRwIlr5U',
    'https://www.youtube.com/watch?v=hx4aRwIlr5U',
    'https://www.youtube.com/watch?v=tS7JZtRBbiI',
    'https://www.youtube.com/watch?v=QuPaTz6wl5I',
    'https://www.youtube.com/watch?v=ZuCNQZj7xjw',
    'https://www.youtube.com/watch?v=hx4aRwIlr5U',
    'https://www.youtube.com/watch?v=hx4aRwIlr5U',
    'https://www.youtube.com/watch?v=hx4aRwIlr5U'
)
$filmVideos = @($filmContent.sections.introduction.video, $filmContent.sections.showreel.video) + @($filmContent.sections.releases.items) + @($filmContent.sections.filmClips.items)
Assert-True (($filmVideos.url -join ',') -eq ($expectedFilmUrls -join ',')) 'A supplied film video URL changed unexpectedly.'
Assert-True ($filmContent.sections.releases.items.Count -eq 3) 'The film release collection must contain three cards.'
Assert-True ($filmContent.sections.filmClips.items.Count -eq 3) 'The Music to TV / Film collection must contain three cards.'

$videos = @($content.sections.introduction.video, $content.sections.showreel.video, $content.sections.studioVideo.video) + @($content.sections.releases.items) + $filmVideos
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