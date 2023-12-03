FROM node:alpine

LABEL org.opencontainers.image.source https://github.com/BudgetBuddyDE/Subscription-Service

WORKDIR /usr/src/subscription-service/

COPY package*.json ./


RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]