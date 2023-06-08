FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY --from=ghcr.io/ufoscout/docker-compose-wait:latest /wait /wait

RUN npm install

COPY . .

#вернуть
#CMD ["npm","run","start:dev"]