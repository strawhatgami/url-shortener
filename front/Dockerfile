FROM node:18-alpine
RUN mkdir -p /usr/src/front
WORKDIR /usr/src/front
COPY front/package.json ./
COPY front/yarn.lock ./
RUN npm install
COPY front/ .
# TODO lint the file
#RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "dev"]
