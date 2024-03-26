# Backend on Bun with ElysiaJS

Diary-SPO API-"proxy" on [Bun](https://bun.sh/) JS runtime + [ElysiaJS](https://elysiajs.com/) framework.

## Installation

### JS runtime

This project requires [Bun](https://bun.sh/) latest version.

Before start installing Bun, install curl and unzip. On Ubuntu/Debian run:

```bash
sudo apt install -y curl unzip
```

To install Bun on Debian/Ubuntu run:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Download

To download backend (this repository) run:

```bash
git clone https://github.com/Diary-SPO/bun-elysia/ && cd bun-elysia
```

### Dependencies

To install dependencies run:

```bash
bun i
```

## Configuration

Before starting the server, you need to have a configuration file.

Create file with name `.env` in project root (or where server runs).
File has the following syntax:

```ini
# Адрес сервера дневника
SERVER_URL='адрес_целевого_дневника'

# Порт этого сервера (не обязательно)
PORT=ваш_порт # по умолчанию 3003
```

Here is a possible example of your file:

```ini
SERVER_URL='https://poo.tomedu.ru'
PORT=3000
```

You can rewrite file `.env.example` and rename to `.env`

## Launch and build scripts

```bash
bun start     # run methods from source code
bun dev       # run with watch mode
bun run build # build to ./dist folder
bun serve     # build and run production
```

Open link from terminal (http://localhost:3003/) with your browser to see "hello" page of running server.
