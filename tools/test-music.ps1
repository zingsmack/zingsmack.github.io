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
$filmJson = [System.IO.File]::ReadAllText((Join-Path $repoRoot 'moviemakers-content.json'))
$filmContent = $filmJson | ConvertFrom-Json
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
Assert-True ($css -match 'is-film-portfolio.*section-heading__title') 'Film-only heading styling is missing.'
Assert-True ($css -match '(?s)#showreel \.section-heading__title.*?white-space:\s*nowrap') 'The film showreel heading is not kept on one line.'
Assert-True ($css -match '\.film-clip-card \.release-card__title h3') 'Smaller film clip title styling is missing.'
Assert-True ($css -match '(?s)\.is-film-portfolio \.music-header\s*\{.*?position:\s*sticky;.*?top:\s*0;') 'The moviemakers header is not pinned.'
Assert-True ($css -match '(?s)\.is-film-portfolio \.music-nav\s*\{.*?flex-wrap:\s*wrap;.*?overflow-x:\s*visible;') 'The moviemakers navigation can still scroll horizontally.'
Assert-True ($css -match '(?s)\.is-film-portfolio \.music-nav a.*?text-transform:\s*none;') 'Film navigation capitalization is not preserved from content.'
Assert-True ($css -match '(?s)\.montage-item__overlay\s*\{.*?text-transform:\s*uppercase;') 'Montage tags are no longer uppercase.'
Assert-True ($css -match '(?s)\.is-film-portfolio \.hero-pattern\s*\{\s*visibility:\s*hidden;') 'The film hero artwork is not hidden.'
Assert-True ($script -match 'portfolioImage\(content\.media\.pattern, "hero-pattern reveal"\)') 'The hero artwork container was removed.'
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
Assert-True ($filmContent.sections.recognition.awardImage -eq $content.sections.recognition.awardImage) 'Film section 04 no longer uses the shared award image.'
Assert-True ($filmContent.sections.recognition.testimonialsImage -eq $content.sections.recognition.testimonialsImage) 'Film section 04 no longer uses the shared testimonial image.'
Assert-True (($filmContent.sections.montage.items.image -join ',') -eq ($content.sections.montage.items.image -join ',')) 'Film section 05 no longer uses the shared montage images.'
foreach ($property in $content.media.PSObject.Properties) {
    $filmMedia = $filmContent.media.PSObject.Properties[$property.Name].Value
    Assert-True ($null -ne $filmMedia) "Film media is missing: $($property.Name)"
    Assert-True ($filmMedia.source -eq $property.Value.source) "Film media source changed: $($property.Name)"
    Assert-True ($filmMedia.width -eq $property.Value.width -and $filmMedia.height -eq $property.Value.height) "Film media dimensions changed: $($property.Name)"
}

Assert-True ($filmJson -notmatch 'TBC') 'A TBC placeholder remains in the moviemakers content.'
Assert-True ($filmContent.page.intro -eq 'welcome to my portfolio!  please press play to watch the video below.') 'Film page introduction copy is incorrect.'
Assert-True ($filmContent.sections.showreel.copy -eq 'a selection of music i have created, accompanied by visual footage i have shot.') 'Film showreel copy is incorrect.'
Assert-True ($filmContent.sections.releases.copy -eq 'a selection of personal tracks i released') 'Film release copy is incorrect.'
Assert-True ($filmContent.sections.recognition.copy -eq 'now owned by the parents of Akai and Moog, Native Instruments have provided music creators with pioneering tools since 1996 and are considered a music technology industry-leader.') 'Film recognition copy is incorrect.'
Assert-True ($filmContent.sections.recognition.testimonialsTranscription -eq 'above is a collection of lovely comments on music that i have worked on.') 'Film testimonial copy is incorrect.'
Assert-True ($filmContent.sections.montage.copy -eq 'this part of the earth looks like...') 'Film montage introduction is incorrect.'
$expectedOverlays = @(
    'sometimes i look like this, made you look!',
    'recording foley',
    'faders and rotaries are sum of...',
    'music anywhere',
    'dialogue and singing are two separate angels',
    'all day all night',
    'sometimes i look with this',
    'part-country, part-urban, part-suburban',
    'is midnight time for techno',
    'sometime i look at this'
)
Assert-True (($filmContent.sections.montage.items.overlay -join ',') -eq ($expectedOverlays -join ',')) 'A film montage overlay is incorrect.'
Assert-True ($filmContent.sections.filmClips.copy -eq 'a selection of music scored to visual footage') 'Film clip introduction is incorrect.'
Assert-True ($filmContent.page.copyright -eq ([char]0x00A9 + ' 2026 Leon Briggs. all rights reserved.')) 'Film copyright is incorrect.'
Assert-True ($filmContent.page.videoLabels.captions -eq '-' -and $filmContent.page.videoLabels.transcript -eq '*') 'Film-only video labels are incorrect.'
Assert-True ($filmContent.page.videoLabels.play -eq 'play') 'The film play label is not lowercase.'
Assert-True ($filmContent.page.uiLabels.home -eq 'home' -and $filmContent.page.uiLabels.returnHome -eq 'return home') 'Film-only interface labels are incorrect.'
Assert-True ($script -match 'document\.title = content\.page\.title') 'The selected portfolio title is not applied to the document.'
Assert-True ($filmJson -cnotmatch '(?<![A-Za-z0-9])I(?![A-Za-z0-9])') 'A standalone uppercase I remains in moviemakers content.'
$expectedSocialUrls = @(
    'https://www.youtube.com/@LEONLIII',
    'https://instagram.com/leonliii',
    'https://linkedin.com/in/leon-briggs-09387656'
)
Assert-True (($filmContent.page.socialLinks.url -join ',') -eq ($expectedSocialUrls -join ',')) 'A film footer social URL is incorrect.'
Assert-True ($script -match 'socialIcon') 'Social icon rendering is missing.'
Assert-True ($script -match 'content\.page\.videoLabels') 'Content-specific video labels are missing.'

$expectedFilmUrls = @(
    'https://youtube.com/shorts/FGa79I45HzE',
    'https://youtu.be/BvV3s_7KNGQ',
    'https://www.youtube.com/watch?v=tS7JZtRBbiI',
    'https://www.youtube.com/watch?v=QuPaTz6wl5I',
    'https://www.youtube.com/watch?v=ZuCNQZj7xjw',
    'https://youtube.com/watch?v=cRHXCJmf1XA',
    'https://www.youtube.com/watch?v=Ki4mFaVpLrc',
    'https://youtu.be/HS8tS66gStI'
)
$filmVideos = @($filmContent.sections.introduction.video, $filmContent.sections.showreel.video) + @($filmContent.sections.releases.items) + @($filmContent.sections.filmClips.items)
Assert-True (($filmVideos.url -join ',') -eq ($expectedFilmUrls -join ',')) 'A supplied film video URL changed unexpectedly.'
$expectedFilmPosters = @(
    '',
    'assets/musicassetsextrafilm/optimized/02.jpg',
    '',
    'assets/musicassetsextrafilm/optimized/03_02.jpg',
    'assets/musicassetsextrafilm/optimized/03_03.jpg',
    'assets/musicassetsextrafilm/optimized/06_01.jpg',
    '',
    ''
)
$filmPosters = @($filmVideos | ForEach-Object {
    if ($_.PSObject.Properties['poster']) { [string]$_.poster } else { '' }
})
Assert-True (($filmPosters -join ',') -eq ($expectedFilmPosters -join ',')) 'A supplied film poster mapping changed unexpectedly.'
foreach ($poster in $filmPosters | Where-Object { $_ }) {
    Assert-True (Test-Path -LiteralPath (Join-Path $repoRoot $poster) -PathType Leaf) "Missing film poster: $poster"
}
Assert-True ($script -match 'video\.poster') 'Custom video poster support is missing.'
Assert-True ($script -match 'pathname\.startsWith\("/shorts/"\)') 'YouTube Shorts URL support is missing.'
Assert-True ($filmContent.sections.releases.items.Count -eq 3) 'The film release collection must contain three cards.'
Assert-True ($filmContent.sections.filmClips.items.Count -eq 3) 'The Music to TV / Film collection must contain three cards.'
$expectedClipTitles = @(
    'HBO/Westworld',
    'the Captain / 8Dio',
    'the wonders and hardships'
)
$expectedDescriptionCounts = @(3, 2, 6)
Assert-True (($filmContent.sections.filmClips.items.title -join ',') -eq ($expectedClipTitles -join ',')) 'A film clip title changed unexpectedly.'
Assert-True (-not ($filmContent.sections.filmClips.items | Where-Object { $_.PSObject.Properties['credit'] })) 'A duplicate film clip credit remains.'
$descriptionCounts = @($filmContent.sections.filmClips.items | ForEach-Object { @($_.description).Count })
Assert-True (($descriptionCounts -join ',') -eq ($expectedDescriptionCounts -join ',')) 'A film clip description paragraph is missing.'
Assert-True ($filmContent.sections.filmClips.items[2].description[1] -eq 'the static artwork image was provided via Artstation ''link in Youtube description''') 'The Artstation attribution text is incorrect.'
foreach ($clip in $filmContent.sections.filmClips.items) {
    Assert-True (-not (@($clip.description) | Where-Object { [string]::IsNullOrWhiteSpace($_) })) "A film clip description contains an empty paragraph: $($clip.title)"
}
Assert-True ($script -match 'clip\.description') 'Film clip description rendering is missing.'
Assert-True ($css -match '\.film-clip__description') 'Film clip description styling is missing.'

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