#!/bin/sh
# Prepair 720x720 splash.png
convert www/splash.png -geometry 128x128 www/view/icon.png
convert www/splash.png -geometry 128x128 www/view/icon/android/icon128.png
convert www/splash.png -geometry 96x96 www/view/icon/android/icon96.png
convert www/splash.png -geometry 72x72 www/view/icon/android/icon72.png
convert www/splash.png -geometry 48x48 www/view/icon/android/icon48.png
convert www/splash.png -geometry 36x36 www/view/icon/android/icon36.png

convert www/splash.png -geometry 720x720 -background "#dedede" -mattecolor "#dedede" -frame 280x0 www/view/screen/android/screen1280l.png
convert www/splash.png -geometry 720x720 -background "#dedede" -mattecolor "#dedede" -frame 0x280 www/view/screen/android/screen1280p.png
convert www/splash.png -geometry 480x480 -background "#dedede" -mattecolor "#dedede" -frame 160x0 www/view/screen/android/screen800l.png
convert www/splash.png -geometry 480x480 -background "#dedede" -mattecolor "#dedede" -frame 0x160 www/view/screen/android/screen800p.png
convert www/splash.png -geometry 320x320 -background "#dedede" -mattecolor "#dedede" -frame 80x0 www/view/screen/android/screen480l.png
convert www/splash.png -geometry 320x320 -background "#dedede" -mattecolor "#dedede" -frame 0x80 www/view/screen/android/screen480p.png
convert www/splash.png -geometry 200x200 -background "#dedede" -mattecolor "#dedede" -frame 60x0 www/view/screen/android/screen320l.png
convert www/splash.png -geometry 200x200 -background "#dedede" -mattecolor "#dedede" -frame 0x60 www/view/screen/android/screen320p.png
