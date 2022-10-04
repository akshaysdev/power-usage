## Instructions

1. Install node and install nvm. Go to the root folder and run

```bash
nvm use
```
then,

```bash
npm install
```

2. Install postgres and redis to your system and start both the servers

3. Create .env file in the root folder

```.env
PORT
POSTGRES_USER
POSTGRES_HOST
POSTGRES_PASSWORD
POSTGRES_DATABASE
POSTGRES_PORT
ACCESS_TOKEN_SECRET
REDIS_PORT
REDIS_HOST
REDIS_DB
```

4. Start the node server

```bash
npm start
```

5. Instead you can run all the services with docker, install docker and docker-compose, and then,

```bash
docker-compose up --build
```

### Or run your docker services separately,

References,
```
d = runs a detached container
rm = removes the container when the respective server is stopped
v = volume
p = port
t = tag
```

```bash
docker run --name <postgres-container-name> --network <my-net> -p 5432:5432 -e POSTGRES_USER=<username> -e POSTGRES_PASSWORD=<password> -v /path/to/the/database:/var/lib/postgresql/data/ -d --rm postgres
```
then ,

```bash
docker run --name <redis-container-name> --network <my-net> -p 6379:6379 -v /path/to/the/database:/data -d --rm redis
```
To run the server first run,

```
docker build -t <image-name>
```

then,

```bash
docker run --name <server-container-name> --network <my-net> -p 8000:8000 -v /path/to/the/project:/home/apps/power-usage -v node_modules:/home/apps/power-usage/node_modules -d --rm <built-image-name>
```
