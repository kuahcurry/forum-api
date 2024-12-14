FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV APP_ENV=production
ENV APP_PORT=8080
CMD [ "npm", "start" ]
EXPOSE 8080