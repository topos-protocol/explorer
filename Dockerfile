FROM node:lts-alpine as build

ARG VITE_SUBNET_REGISTRATOR_CONTRACT_ADDRESS
ARG VITE_TOPOS_CORE_CONTRACT_ADDRESS

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . ./

RUN npm run build

FROM nginx:alpine AS prod

WORKDIR /usr/share/nginx/html

COPY --from=build /usr/src/app/dist .

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
