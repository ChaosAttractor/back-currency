FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx sequelize-cli db:migrate

CMD ["npm","run","start:dev"]