# Memory Game

> This application is made with ExpressJs and PostgreSQL

## Get starting

- Clone the project

```sh
git clone git@github.com:GermainMichaud/memory-game.git
cd ./memory-game
```

- Install dependencies

```sh
npm i # or npm install
```

- Run the application

```sh
npm run dev # in dev mode (with hot reload)
# or
npm start
```

## Database

### Option 1

Create your own database localy.

### Option 2

If you have `Docker` and `Docker Compose` installed on your environment

Run:

```sh
docker-compose up -d
```

By default it will create a container with an instance of Postgres. See `docker-compose.yml` file for more information about credentials, port, ...
