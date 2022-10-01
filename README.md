### Instructions

1. Go to the root folder and run

```bash
npm install
```

2. Install docker and docker-compose (optional)

3. Update env

```.env
PORT
POSTGRES_USER
POSTGRES_HOST
POSTGRES_PASSWORD
POSTGRES_DATABASE
POSTGRES_PORT
ACCESS_TOKEN_SECRET
```

4. Start the postgres database server

5. Start the node server

```bash
npm start
```

6. Instead you can run all the service by doing(requires docker),

```bash
docker compose up
```
