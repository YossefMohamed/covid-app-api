FROM node:16.5.0-alpine

ENV PORT 8080

WORKDIR /app

COPY package.json .
RUN npm install
COPY . .

CMD npm start








