# use the official Bun image
FROM oven/bun:1 as base
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/prod
COPY . /temp/prod/
RUN rm /temp/prod/bun.lockb
RUN sed '/prepare/d' /temp/prod/package.json > temp_package.json && mv temp_package.json /temp/prod/package.json
RUN cd /temp/prod && bun install --frozen-lockfile --production && bun run build:api

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/apps/api/dist .

# configuration

# run the app
USER bun
EXPOSE 3003/tcp
ENTRYPOINT [ "bun", "run", "main.js" ]
