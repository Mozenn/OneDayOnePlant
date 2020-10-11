#! /bin/bash

rm -r build/
docker create -it --name odop-build odop-front bash
docker cp odop-build:/app/build ./build
docker rm -f odop-build 
if [ -d "/var/www/onedayoneplant.net/html" ]
then
	rm -r /var/www/onedayoneplant.net/html/*
else
	mkdir -p /var/www/onedayoneplant.net/html
fi	
mv ./build/* /var/www/onedayoneplant.net/html/
rm -r ./build
