FROM node:latest
WORKDIR /usr/src

COPY package*.json ./
COPY tsconfig.json ./
COPY src/ ./

RUN npm install

EXPOSE 3000