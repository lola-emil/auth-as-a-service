FROM node:22.16.0-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN yarn install


COPY . .

RUN yarn build

FROM node:22.16.0-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./


RUN yarn install --production --frozen-lockfile


EXPOSE 5001