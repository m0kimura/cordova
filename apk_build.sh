#!/bin/sh
cordova build
# copy to dropbox
cp ./platforms/android/build/outputs/apk/android-debug.apk /mnt/hdd/Dropbox/apli/android-debug.apk
## 1.当該フォルダに移動して実行
## 2.ビルド後、Dropbox/Apliフォルダにコピーして自動アップロード
