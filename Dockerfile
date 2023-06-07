FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

#todo нужно более хорошее решение для такого
#CMD ["npm","run","start:dev"]