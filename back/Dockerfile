FROM node:18-alpine
WORKDIR /usr/src/back
COPY back/package*.json ./
RUN npm install
COPY back/ .
EXPOSE 3000
CMD ["npm", "start"]
