FROM node:alpine

LABEL org.opencontainers.image.source https://github.com/BudgetBuddyDE/Subscription-Service

WORKDIR /usr/src/subscription-service/

COPY package*.json ./


RUN --mount=type=secret,id=npm,target=.npmrc npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]