# API TRIP

This project provides a service API for trip routes

## Configuration
- clone this proyect
- clone .envExample file, create .env file and configure enviroment
- Execute ```npm run dev```

## enviroment
for run using docker, enviroment:
```MONGO_URI=mongodb://dataBase:27017/trips```

for run local test
```MONGO_URI=mongodb://localhost:27017/trips```

for run unit test
```npm run test```

## docker
```
docker compose build 
docker compose up -d
```
or 
```
docker compose up -d --build 
```
