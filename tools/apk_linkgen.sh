#!/bin/sh
#
sv=$PWD
cd ../library
ln -is $PWD/$1 ${sv}/www/js/$1
cd ${sv}
