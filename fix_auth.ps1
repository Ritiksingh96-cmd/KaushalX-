$files = Get-ChildItem -Path "app" -Recurse -Include "*.ts","*.tsx"
foreach ($file in $files) {
    if ($file.PSIsContainer) { continue }
    $content = Get-Content $file.FullName | Out-String
    $newContent = $content -replace 'import \{ getServerSession \} from "next-auth"', 'import { auth } from "@/lib/auth"'
    $newContent = $newContent -replace 'getServerSession\(authOptions\)', 'auth()'
    $newContent = $newContent -replace 'import \{ authOptions \} from "@/lib/auth"', ''
    if ($content -ne $newContent) {
        $newContent | Set-Content $file.FullName
        Write-Host "Fixed $($file.Name)"
    }
}
