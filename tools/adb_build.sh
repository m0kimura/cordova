#!/bin/sh
cordova build

# copy to dropbox
adb install -r ./platforms/android/build/outputs/apk/android-debug.apk

## 1.端末コネクト
## 2.当該フォルダに移動して実行
