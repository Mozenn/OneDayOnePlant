#! /bin/bash

docker-compose up -d --build 
if [ -d "/var/www/onedayoneplant.net/html" ]
then
	rm -r /var/www/onedayoneplant.net/html/image
	rm -r /var/www/onedayoneplant.net/html/css
else
	mkdir -p /var/www/onedayoneplant.net/html
fi
cp -r public/* /var/www/onedayoneplant.net/html
