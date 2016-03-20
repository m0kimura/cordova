#!/bin/sh 
read -p 'PAUSE Cordovaプロジェクトを作成します。' y
cp tools/config.sh config.sh
./tools/cordovaconf.jse $1
./config.sh
