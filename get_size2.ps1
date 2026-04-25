Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('g:\Blasphemous\public\blasphemous-cvstodia-in-game-map-pc-map.webp')
Write-Output $img.Width
Write-Output $img.Height
$img.Dispose()
