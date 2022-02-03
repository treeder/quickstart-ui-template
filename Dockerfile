FROM node:17

WORKDIR /app

COPY package*.json ./

# RUN npm install
RUN npm ci

COPY . .

# RUN npm run build

EXPOSE 3000

# CMD [ "npm", "start" ]
CMD ["node", "server.js"]
