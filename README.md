# esd-project-g1t1


This is a flight booking system using a microservice architecture deployed on docker containers 
created by G1T1 for SMU ESD IS213 

## To Run The System
- Download repository as zip folder
- Unzip folder
- In command line cd to the directory of folder
- Initiate docker-compose to build images using `docker-compose build`
- Run containers using `docker-compose up -d`
- Once done, use `docker-compose down` to terminate all running containers and networks 

<!-- 

## flask_mail microservice
- Responsible for sending a notification email to the customer
- Will receive data regading the flight booking, passenger information and payments from the Make A Booking CMS
- To run microservice install flask_mail using

`pip install flask_mail`
 -->



Copyright ESD IS213 G1T1 2022
