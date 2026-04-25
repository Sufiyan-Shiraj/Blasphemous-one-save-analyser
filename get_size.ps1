Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('g:\Blasphemous\public\map tile.png')
Write-Output $img.Width
Write-Output $img.Height
$img.Dispose()
