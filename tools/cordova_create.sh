#!/bin/sh
#
# $1 module
# $2 corp
# $3 name
read -p "HTMLのダウンロードを実行しますか? (yes)" x
if [ "${x}" != "yes" ] ; then
  exit
fi
#
cd ~/cordova
cordova create $1 $2$1 $3
#
cd $1
cordova.jse $1 $2
cordova platform add android
cordova pugin add cordova-plugin-whitelist
cordova pugin add cordova-plugin-splashscreen
cordova pugin add cordova-plugin-console
#
mkdir js
mkdir library
mkdir model
mkdir view
mkdir view/css
mkdir view/icon
mkdir view/img
mkdir view/screen
#
cp index.html
cp base.css
cp base.js
cp execute.sjs
cp jquery-2.1.1.js
cp library.sjs
cp screen.sjs
cp stratified.js
cp white.jpg
# pause
cordova prepair -d
read -p "[ENTER]終了" y

