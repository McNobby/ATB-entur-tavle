FROM node:16-alpine

COPY ./package*.json ./

RUN npm install

COPY . ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]
