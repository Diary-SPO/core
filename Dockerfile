FROM oven/bun
WORKDIR /home/bun/app

# Обновляем пакеты
RUN apt update && apt upgrade

# Копируем в контейнер
COPY . .

# Устанавливаем git
RUN apt install git -y

# Устанавливаем пакеты
RUN bun i

USER bun
EXPOSE ${PORT:-3003}/tcp
CMD ["bun", "run", "dev:api"]
