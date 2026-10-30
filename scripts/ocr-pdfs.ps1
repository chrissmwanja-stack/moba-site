<#
.SYNOPSIS
  Makes scanned PDFs searchable (adds a hidden text layer) before they are uploaded to the MOBA archive.

.DESCRIPTION
  Runs OCRmyPDF over one PDF, or every PDF in a folder. The original files are never changed: searchable
  copies are written to a separate folder. Pages that already contain text are left alone, so it is safe to
  run on a mixed batch. Only the hidden text layer is added; the pictures of the pages are not altered.

  One-time setup (PowerShell):
    winget install Python.Python.3.12
    winget install UB-Mannheim.TesseractOCR
    py -m pip install ocrmypdf
  Close and reopen PowerShell afterwards so the new programs are found. If OCRmyPDF complains about
  Ghostscript, also run:  winget install ArtifexSoftware.GhostScript

.PARAMETER Path
  A PDF file, or a folder containing PDF files.

.PARAMETER OutDir
  Where the searchable copies go. Default: a folder called "searchable" next to the input.

.PARAMETER Language
  Tesseract language code(s). Default "eng". Join several with a plus sign, for example "eng+lug".

.PARAMETER Jobs
  How many pages to process at the same time. Default: all processor cores but one.

.PARAMETER MaxMB
  Warn when a result is larger than this many megabytes. Default 25, the archive upload limit.

.PARAMETER Force
  Replace searchable copies that already exist in OutDir (they are skipped by default).

.EXAMPLE
  .\scripts\ocr-pdfs.ps1 "$HOME\Downloads\MPALA_MAGAZINE_1988.pdf"

.EXAMPLE
  .\scripts\ocr-pdfs.ps1 "D:\MOBA scans" -Language eng
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true, Position = 0)][string]$Path,
  [string]$OutDir,
  [string]$Language = 'eng',
  [int]$Jobs = 0,
  [int]$MaxMB = 25,
  [switch]$Force
)

function Find-OcrMyPdf {
  $exe = Get-Command ocrmypdf -ErrorAction SilentlyContinue
  if ($exe) { return @($exe.Source) }
  foreach ($py in 'py', 'python') {
    if (Get-Command $py -ErrorAction SilentlyContinue) {
      & $py -m ocrmypdf --version *> $null
      if ($LASTEXITCODE -eq 0) { return @($py, '-m', 'ocrmypdf') }
    }
  }
  return $null
}

# The Tesseract installer does not always add itself to PATH.
if ($env:ProgramFiles) {
  $tesseractDir = Join-Path $env:ProgramFiles 'Tesseract-OCR'
  if ((Test-Path -LiteralPath $tesseractDir) -and ($env:PATH -notlike "*$tesseractDir*")) {
    $env:PATH = "$tesseractDir$([IO.Path]::PathSeparator)$env:PATH"
  }
}

if (-not (Get-Command tesseract -ErrorAction SilentlyContinue)) {
  Write-Error "Tesseract was not found. Install it with:  winget install UB-Mannheim.TesseractOCR  (then reopen PowerShell)."
  exit 1
}
$ocr = @(Find-OcrMyPdf)  # @() keeps a one-item result an array
if ($ocr.Count -eq 0 -or -not $ocr[0]) {
  Write-Error "OCRmyPDF was not found. Install it with:  py -m pip install ocrmypdf  (then reopen PowerShell)."
  exit 1
}
$ocrExe = $ocr[0]
$ocrPrefix = @($ocr | Select-Object -Skip 1)

if (-not (Test-Path -LiteralPath $Path)) {
  Write-Error "Not found: $Path"
  exit 1
}
$item = Get-Item -LiteralPath $Path
if ($item.PSIsContainer) {
  if (-not $OutDir) { $OutDir = Join-Path $item.FullName 'searchable' }
  $files = @(Get-ChildItem -LiteralPath $item.FullName -Filter *.pdf -File | Sort-Object Name)
} else {
  if ($item.Extension -ne '.pdf') { Write-Error "That is not a PDF file: $Path"; exit 1 }
  if (-not $OutDir) { $OutDir = Join-Path $item.DirectoryName 'searchable' }
  $files = @($item)
}
if ($files.Count -eq 0) { Write-Error "No PDF files found in $Path"; exit 1 }
if ($Jobs -lt 1) { $Jobs = [Math]::Max(1, [Environment]::ProcessorCount - 1) }

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$OutDir = (Resolve-Path -LiteralPath $OutDir).Path

Write-Host "Making $($files.Count) PDF(s) searchable. Results go to: $OutDir"
Write-Host 'A 100-page scan can take several minutes. Leave this window open.'
Write-Host ''

$report = @()
foreach ($file in $files) {
  $target = Join-Path $OutDir $file.Name
  $inMB = [Math]::Round($file.Length / 1MB, 1)
  if ((Test-Path -LiteralPath $target) -and -not $Force) {
    Write-Host "Skipping $($file.Name): a searchable copy already exists (use -Force to redo it)."
    $report += [pscustomobject]@{ File = $file.Name; 'Original MB' = $inMB; 'Searchable MB' = ''; Result = 'Skipped (already done)' }
    continue
  }
  Write-Host "==> $($file.Name) ($inMB MB)"
  & $ocrExe @ocrPrefix --output-type pdf --skip-text --optimize 1 --jobs $Jobs --language $Language $file.FullName $target
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $target)) {
    Write-Warning "OCR failed for $($file.Name) (exit code $LASTEXITCODE). The original was not changed."
    if (Test-Path -LiteralPath $target) { Remove-Item -LiteralPath $target -Force }
    $report += [pscustomobject]@{ File = $file.Name; 'Original MB' = $inMB; 'Searchable MB' = ''; Result = 'FAILED' }
    continue
  }
  $outMB = [Math]::Round((Get-Item -LiteralPath $target).Length / 1MB, 1)
  $result = 'OK'
  if ($outMB -gt $MaxMB) { $result = "OK, but over $MaxMB MB: too big to upload as one file" }
  $report += [pscustomobject]@{ File = $file.Name; 'Original MB' = $inMB; 'Searchable MB' = $outMB; Result = $result }
}

Write-Host ''
Write-Host 'Summary'
foreach ($row in $report) {
  if ($row.'Searchable MB' -ne '') {
    Write-Host ("  {0}: {1} MB -> {2} MB. {3}" -f $row.File, $row.'Original MB', $row.'Searchable MB', $row.Result)
  } else {
    Write-Host ("  {0}: {1}" -f $row.File, $row.Result)
  }
}
Write-Host ''
Write-Host 'Check one result: open it, press Ctrl+F and search for a word you can see on a page.'
Write-Host 'Then upload the copy from the "searchable" folder in Admin > Archives.'
if (($report | Where-Object { $_.Result -eq 'FAILED' }).Count -gt 0) { exit 2 }
