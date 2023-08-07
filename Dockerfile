FROM node:alpine

LABEL org.opencontainers.image.source https://github.com/BudgetBuddyDE/Subscription-Service

WORKDIR /usr/src/subscription-service/

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build

CMD ["npm", "run start"]