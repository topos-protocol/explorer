FROM node:lts-alpine

ARG VITE_SUBNET_REGISTRATOR_CONTRACT_ADDRESS
ARG VITE_TOPOS_CORE_CONTRACT_ADDRESS

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . ./

RUN npm run build

CMD npm run preview -- --port 80 --host 0.0.0.0