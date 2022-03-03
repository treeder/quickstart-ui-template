FROM node:17

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
