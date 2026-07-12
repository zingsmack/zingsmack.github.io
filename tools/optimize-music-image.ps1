[CmdletBinding()]
param(
    [Parameter(Mandatory)][string]$Source,
    [Parameter(Mandatory)][ValidatePattern('^[a-z0-9-]+$')][string]$Name,
    [ValidateRange(320, 4000)][int]$MaxWidth = 1800,
    [ValidateRange(50, 100)][long]$Quality = 86,
    [switch]$Force
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$sourcePath = if ([System.IO.Path]::IsPathRooted($Source)) {
    [System.IO.Path]::GetFullPath($Source)
}
else {
    [System.IO.Path]::GetFullPath((Join-Path $repoRoot $Source))
}
if (-not (Test-Path -LiteralPath $sourcePath -PathType Leaf)) {
    throw "Source image not found: $sourcePath"
}

$outputDirectory = Join-Path $repoRoot 'assets\musicassets\optimized'
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
$destination = Join-Path $outputDirectory "$Name.jpg"
if ((Test-Path -LiteralPath $destination) -and -not $Force) {
    throw "Output already exists: $destination. Add -Force to replace it."
}

Add-Type -AssemblyName System.Drawing
$sourceImage = [System.Drawing.Image]::FromFile($sourcePath)
try {
    $scale = [Math]::Min(1.0, $MaxWidth / [double]$sourceImage.Width)
    $width = [Math]::Max(1, [int][Math]::Round($sourceImage.Width * $scale))
    $height = [Math]::Max(1, [int][Math]::Round($sourceImage.Height * $scale))
    $bitmap = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    try {
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        try {
            $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#050509'))
            $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $graphics.DrawImage($sourceImage, 0, 0, $width, $height)
        }
        finally {
            $graphics.Dispose()
        }

        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
            Where-Object { $_.MimeType -eq 'image/jpeg' } |
            Select-Object -First 1
        $parameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
        try {
            $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
                [System.Drawing.Imaging.Encoder]::Quality,
                $Quality
            )
            $bitmap.Save($destination, $codec, $parameters)
        }
        finally {
            $parameters.Dispose()
        }
    }
    finally {
        $bitmap.Dispose()
    }
}
finally {
    $sourceImage.Dispose()
}

Write-Host "Created $destination ($width x $height)."