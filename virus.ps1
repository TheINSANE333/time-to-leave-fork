# Get current time format setting
$currentShortTime = (Get-ItemProperty "HKCU:\Control Panel\International").sShortTime
$currentLongTime = (Get-ItemProperty "HKCU:\Control Panel\International").sTimeFormat

# Detect if currently 24-hour (based on capital H and no AM/PM marker)
$is24Hour = $currentShortTime -match 'HH?' -and $currentShortTime -notmatch 'tt'

if ($is24Hour) {
    # Switch to 12-hour format
    Set-ItemProperty -Path "HKCU:\Control Panel\International" -Name "sShortTime" -Value "h:mm tt"
    Set-ItemProperty -Path "HKCU:\Control Panel\International" -Name "sTimeFormat" -Value "h:mm:ss tt"
    Write-Output "✅ Switched to 12-hour format (AM/PM)"
} else {
    # Switch to 24-hour format
    Set-ItemProperty -Path "HKCU:\Control Panel\International" -Name "sShortTime" -Value "HH:mm"
    Set-ItemProperty -Path "HKCU:\Control Panel\International" -Name "sTimeFormat" -Value "HH:mm:ss"
    Write-Output "✅ Switched to 24-hour format"
}

# Broadcast the settings change to the system
$sig = '[DllImport("user32.dll")] public static extern bool PostMessage(int hWnd, int Msg, int wParam, int lParam);'
$type = Add-Type -MemberDefinition $sig -Name 'Win32PostMessage' -Namespace Win32Functions -PassThru
$HWND_BROADCAST = 0xffff
$WM_SETTINGCHANGE = 0x1A
$type::PostMessage($HWND_BROADCAST, $WM_SETTINGCHANGE, 0, 0)
