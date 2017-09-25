FROM node:latest

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
RUN npm install

COPY .babelrc .
COPY index.html .
COPY server.js .

# Bundle app source
COPY src/ /usr/src/app/src/

RUN npm run build_js

EXPOSE 3000

CMD npm run start