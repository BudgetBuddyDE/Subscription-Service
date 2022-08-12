FROM node:alpine

LABEL org.opencontainers.image.source https://github.com/BudgetBuddyDE/Subscription-Service

WORKDIR /usr/src/subscription-service/

COPY package*.json ./

COPY . .

RUN npm run build

CMD ["node", "dist/index.js"]