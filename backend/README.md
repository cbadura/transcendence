```
npm i -g @nestjs/cli
nest new backend
nest g res user

docker run --rm -p 5432:5432 -d -e POSTGRES_DB=transcendence -e POSTGRES_USER=transcendence -e POSTGRES_PASSWORD=transcendence postgres:15.4-alpine3.18
nc -zv 127.0.0.1 5432 (to check connection to postgres)

npm install --save @nestjs/typeorm typeorm pg
```
https://typeorm.io
```
npm run start:dev
curl -X POST -H "Content-Type: application/json" --data '{"name":"nadiia"}' localhost:3000/user

docker ps
docker exec -it <container id> /bin/bash
psql -U transcendence
\x
select * from "user";
\dt+ (display tables)
```
![https://i.imgur.com/stEwQMr.png](https://i.imgur.com/stEwQMr.png)