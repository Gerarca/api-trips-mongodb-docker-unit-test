FROM node:18

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "src/server.js"]
